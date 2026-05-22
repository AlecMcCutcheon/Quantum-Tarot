import {
  getOutshiftApiKey,
  getQrngProvider,
  type QrngProvider,
} from "../lib/qrngSettings";
import {
  runRand as runRandDirect,
  runRandint as runRandintDirect,
  runTest as runTestDirect,
} from "../lib/qrngProviders";

export interface QrngIntResponse {
  result: number[];
  raw?: unknown;
  /** Set when server failed over to the alternate QRNG provider. */
  notice?: string;
}

export interface QrngFloatResponse {
  result: number[];
  raw?: unknown;
}

export interface QrngErrorResponse {
  error: string;
}

export interface QrngIntParams {
  min?: number;
  max?: number;
  size?: number;
}

export type QrngSource = QrngProvider | "unknown";

const MAX_ATTEMPTS = 5;
const RETRY_DELAY_MS = 1000;

/** GitHub Pages project sites have no Vite /api proxy. */
const STATIC_HOSTED =
  import.meta.env.PROD && import.meta.env.BASE_URL !== "/";

function qrngApiBase(): string {
  const base = import.meta.env.BASE_URL || "/";
  return `${base.endsWith("/") ? base : `${base}/`}api/qrng`;
}

let lastSource: QrngSource = "unknown";
let pendingNotice: string | null = null;
let preferViteProxy: boolean | null = import.meta.env.DEV ? null : false;

export function getLastQrngSource(): QrngSource {
  return lastSource;
}

export function takeQrngNotice(): string | null {
  const n = pendingNotice;
  pendingNotice = null;
  return n;
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseSource(header: string | null): QrngSource {
  if (header === "outshift" || header === "qrandom") {
    return header;
  }
  return "unknown";
}

function withCacheBust(path: string): string {
  return `${qrngApiBase()}${path}?_=${Date.now()}-${performance.now()}`;
}

function proxyResponseUnavailable(res: Response): boolean {
  if (res.status === 404 || res.status === 405) return true;
  const ct = res.headers.get("content-type") ?? "";
  return !ct.includes("application/json");
}

function applyNotice(notice?: string): void {
  if (typeof notice === "string" && notice.length > 0) {
    pendingNotice = notice;
  }
}

interface QrngRequestBody extends QrngIntParams {
  provider?: QrngProvider;
  apiKey?: string | null;
}

function buildPayload(body: QrngRequestBody): QrngRequestBody {
  return {
    ...body,
    provider: body.provider ?? getQrngProvider(),
    apiKey: getOutshiftApiKey() ?? null,
  };
}

async function parseProxyJson<T extends QrngIntResponse | QrngFloatResponse>(
  res: Response,
): Promise<T | "unavailable" | undefined> {
  if (proxyResponseUnavailable(res)) {
    return "unavailable";
  }
  const text = await res.text();
  let json: T & QrngErrorResponse;
  try {
    json = JSON.parse(text) as T & QrngErrorResponse;
  } catch {
    return "unavailable";
  }
  if (!res.ok) {
    throw new Error(json.error ?? `HTTP ${res.status}`);
  }
  lastSource = parseSource(res.headers.get("X-QRNG-Source"));
  applyNotice((json as QrngIntResponse).notice);
  return json;
}

async function tryViteProxyPost<T extends QrngIntResponse | QrngFloatResponse>(
  path: "/randint" | "/rand",
  payload: QrngRequestBody,
): Promise<T | "unavailable" | undefined> {
  try {
    const res = await fetch(withCacheBust(path), {
      method: "POST",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await parseProxyJson<T>(res);
  } catch (e) {
    if (e instanceof TypeError || e instanceof SyntaxError) {
      return "unavailable";
    }
    return undefined;
  }
}

async function runDirectRandint(
  params: QrngIntParams,
): Promise<QrngIntResponse | undefined> {
  const min = params.min ?? 0;
  const max = params.max ?? 0;
  const size = params.size ?? 1;
  const out = await runRandintDirect(
    getQrngProvider(),
    getOutshiftApiKey(),
    min,
    max,
    size,
  );
  if ("error" in out) {
    return undefined;
  }
  lastSource = out.source;
  applyNotice(out.notice);
  return { result: out.result, raw: out.raw, notice: out.notice };
}

async function runDirectRand(size: number): Promise<QrngFloatResponse | undefined> {
  const out = await runRandDirect(getQrngProvider(), getOutshiftApiKey(), size);
  if ("error" in out) {
    return undefined;
  }
  lastSource = out.source;
  applyNotice(out.notice);
  return { result: out.result, raw: out.raw };
}

async function qrngPost<T extends QrngIntResponse | QrngFloatResponse>(
  path: "/randint" | "/rand",
  body: QrngRequestBody,
  direct: () => Promise<T | undefined>,
): Promise<T | undefined> {
  const payload = buildPayload(body);
  const attempts = STATIC_HOSTED ? 1 : MAX_ATTEMPTS;

  for (let attempt = 0; attempt < attempts; attempt++) {
    if (!STATIC_HOSTED && preferViteProxy !== false) {
      const proxy = await tryViteProxyPost<T>(path, payload);
      if (proxy === "unavailable") {
        preferViteProxy = false;
      } else if (proxy !== undefined) {
        preferViteProxy = true;
        return proxy;
      }
    }

    const directResult = await direct();
    if (directResult !== undefined) {
      return directResult;
    }

    if (attempt < attempts - 1) {
      await sleep(RETRY_DELAY_MS);
    }
  }
  return undefined;
}

export async function randint(
  params: QrngIntParams = {},
): Promise<number[] | undefined> {
  const data = await qrngPost<QrngIntResponse>("/randint", params, () =>
    runDirectRandint(params),
  );
  return data?.result;
}

export async function rand(size = 1): Promise<number[] | undefined> {
  const data = await qrngPost<QrngFloatResponse>("/rand", { size }, () =>
    runDirectRand(size),
  );
  return data?.result;
}

export interface QrngTestResult {
  ok: boolean;
  message: string;
  source?: QrngSource;
  raw?: unknown;
  mapped?: number[];
  request?: unknown;
}

export async function testQrngConnection(
  provider?: QrngProvider,
): Promise<QrngTestResult> {
  const chosen = provider ?? getQrngProvider();
  const apiKey = getOutshiftApiKey();
  const payload = { provider: chosen, apiKey };

  if (!STATIC_HOSTED && preferViteProxy !== false) {
    try {
      const res = await fetch(withCacheBust("/test"), {
        method: "POST",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!proxyResponseUnavailable(res)) {
        const json = (await res.json()) as QrngTestResult & QrngErrorResponse;
        preferViteProxy = true;
        if (json.source) lastSource = json.source;
        return {
          ok: res.ok && json.ok === true,
          message: json.message ?? json.error ?? "Connection failed",
          source: json.source,
          raw: json.raw,
          mapped: json.mapped,
          request: json.request,
        };
      }
      preferViteProxy = false;
    } catch {
      preferViteProxy = false;
    }
  }

  const direct = await runTestDirect(chosen, apiKey);
  if (direct.source) {
    lastSource = direct.source;
  }
  return direct;
}
