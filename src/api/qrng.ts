import {
  getOutshiftApiKey,
  getQrngProvider,
  type QrngProvider,
} from "../lib/qrngSettings";

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

interface QrngRequestBody extends QrngIntParams {
  provider?: QrngProvider;
  apiKey?: string | null;
}

async function qrngPost<T>(
  path: "/randint" | "/rand" | "/test",
  body: QrngRequestBody,
): Promise<T | undefined> {
  const payload: QrngRequestBody = {
    ...body,
    provider: body.provider ?? getQrngProvider(),
    apiKey: getOutshiftApiKey() ?? null,
  };

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    try {
      const res = await fetch(withCacheBust(path), {
        method: "POST",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      lastSource = parseSource(res.headers.get("X-QRNG-Source"));
      const json = (await res.json()) as T & QrngErrorResponse;
      if (!res.ok) {
        throw new Error(json.error ?? `HTTP ${res.status}`);
      }
      const notice = (json as { notice?: string }).notice;
      if (typeof notice === "string" && notice.length > 0) {
        pendingNotice = notice;
      }
      return json;
    } catch {
      if (attempt < MAX_ATTEMPTS - 1) {
        await sleep(RETRY_DELAY_MS);
      }
    }
  }
  return undefined;
}

export async function randint(
  params: QrngIntParams = {},
): Promise<number[] | undefined> {
  const data = await qrngPost<QrngIntResponse>("/randint", params);
  return data?.result;
}

export async function rand(size = 1): Promise<number[] | undefined> {
  const data = await qrngPost<QrngFloatResponse>("/rand", { size });
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
  try {
    const res = await fetch(withCacheBust("/test"), {
      method: "POST",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        provider: provider ?? getQrngProvider(),
        apiKey: getOutshiftApiKey(),
      }),
    });
    const json = (await res.json()) as QrngTestResult & QrngErrorResponse;
    return {
      ok: res.ok && json.ok === true,
      message: json.message ?? json.error ?? "Connection failed",
      source: json.source,
      raw: json.raw,
      mapped: json.mapped,
      request: json.request,
    };
  } catch (e) {
    return {
      ok: false,
      message: e instanceof Error ? e.message : "Connection failed",
    };
  }
}
