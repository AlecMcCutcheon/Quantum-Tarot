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

const QRNG_BASE = "/api/qrng";
const MAX_ATTEMPTS = 5;
const RETRY_DELAY_MS = 1000;

let lastSource: QrngSource = "unknown";
let pendingNotice: string | null = null;
/** null = try proxy once; true = static host / no dev proxy; false = use Vite proxy */
let preferDirectClient: boolean | null = null;

export function getLastQrngSource(): QrngSource {
  return lastSource;
}

/** One-shot notice after a successful draw that used provider failover. */
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
  return `${QRNG_BASE}${path}?_=${Date.now()}-${performance.now()}`;
}

function isProxyUnavailable(res: Response | null): boolean {
  if (!res) return true;
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

async function tryProxyPost<T extends QrngIntResponse | QrngFloatResponse>(
  path: "/randint" | "/rand",
  body: QrngRequestBody,
): Promise<T | "unavailable" | undefined> {
  const payload: QrngRequestBody = {
    ...body,
    provider: body.provider ?? getQrngProvider(),
    apiKey: getOutshiftApiKey() ?? null,
  };

  try {
    const res = await fetch(withCacheBust(path), {
      method: "POST",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (isProxyUnavailable(res)) {
      return "unavailable";
    }
    lastSource = parseSource(res.headers.get("X-QRNG-Source"));
    const json = (await res.json()) as T & QrngErrorResponse;
    if (!res.ok) {
      throw new Error(json.error ?? `HTTP ${res.status}`);
    }
    applyNotice((json as QrngIntResponse).notice);
    return json;
  } catch (e) {
    if (e instanceof TypeError) {
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
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    if (preferDirectClient !== true) {
      const proxy = await tryProxyPost<T>(path, body);
      if (proxy === "unavailable") {
        preferDirectClient = true;
      } else if (proxy !== undefined) {
        preferDirectClient = false;
        return proxy;
      }
    }

    const directResult = await direct();
    if (directResult !== undefined) {
      preferDirectClient = true;
      return directResult;
    }

    if (attempt < MAX_ATTEMPTS - 1) {
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

  if (preferDirectClient !== true) {
    try {
      const res = await fetch(withCacheBust("/test"), {
        method: "POST",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: chosen,
          apiKey,
        }),
      });
      if (!isProxyUnavailable(res)) {
        preferDirectClient = false;
        const json = (await res.json()) as QrngTestResult & QrngErrorResponse;
        lastSource = parseSource(res.headers.get("X-QRNG-Source"));
        return {
          ok: res.ok && json.ok === true,
          message: json.message ?? json.error ?? "Connection failed",
          source: json.source,
          raw: json.raw,
          mapped: json.mapped,
          request: json.request,
        };
      }
      preferDirectClient = true;
    } catch {
      preferDirectClient = true;
    }
  }

  const direct = await runTestDirect(chosen, apiKey);
  if (direct.source) {
    lastSource = direct.source;
  }
  preferDirectClient = true;
  return direct;
}
