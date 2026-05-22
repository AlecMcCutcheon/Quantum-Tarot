import type { IncomingMessage, ServerResponse } from "http";
import type { Plugin } from "vite";
import { mapDecimalToRange, mapDecimalToUnit } from "./src/lib/quantumMap";

/** Quantum-only sources — no local / pseudo-random fallback. */
export type QrngSourceId = "outshift" | "qrandom";

const OUTSHIFT_URL = "https://api.qrng.outshift.com/api/v1/random_numbers";
const QRANDOM_INT = "https://qrandom.io/api/random/int";
const QRANDOM_INTS = "https://qrandom.io/api/random/ints";
const QRANDOM_INTS_SAFE_MAX = 1_000_000_000;
const TIMEOUT_MS = 12000;

function bitsForRange(min: number, max: number): number {
  const span = max - min + 1;
  return Math.min(10000, Math.max(8, Math.ceil(Math.log2(span)) + 2));
}

function readJsonBody(req: IncomingMessage): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    if (req.method !== "POST") {
      resolve({});
      return;
    }
    const chunks: Buffer[] = [];
    req.on("data", (chunk) => chunks.push(chunk as Buffer));
    req.on("end", () => {
      try {
        const raw = Buffer.concat(chunks).toString("utf8");
        resolve(raw ? (JSON.parse(raw) as Record<string, unknown>) : {});
      } catch {
        resolve({});
      }
    });
    req.on("error", reject);
  });
}

function normalizeKey(key: string): string {
  return key.trim().replace(/\r\n/g, "");
}

function resolveOutshiftKey(
  req: IncomingMessage,
  body: Record<string, unknown>,
): string | null {
  if (typeof body.apiKey === "string" && body.apiKey.trim()) {
    return normalizeKey(body.apiKey);
  }
  const fromEnv = process.env.OUTSHIFT_QRNG_API_KEY?.trim();
  if (fromEnv) return normalizeKey(fromEnv);
  const header = req.headers["x-outshift-api-key"];
  const h = Array.isArray(header) ? header[0] : header;
  if (h?.trim()) return normalizeKey(h);
  return null;
}

function resolveProvider(
  body: Record<string, unknown>,
  outshiftKey: string | null,
): QrngSourceId {
  const p = body.provider;
  if (p === "outshift" || p === "qrandom") return p;
  if (p === "anu") return "qrandom";
  return outshiftKey ? "outshift" : "qrandom";
}

/** Outshift keys from the dashboard sometimes include a trailing comma. */
function keyVariants(apiKey: string): string[] {
  const base = normalizeKey(apiKey);
  if (base.endsWith(",")) return [base];
  return [base, `${base},`];
}

async function fetchOutshift(
  apiKey: string,
  body: object,
): Promise<{ ok: true; json: unknown } | { ok: false; status: number; text: string }> {
  for (const key of keyVariants(apiKey)) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
      const res = await fetch(OUTSHIFT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-id-api-key": key,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(timer);
      const text = await res.text();
      if (res.ok) {
        try {
          return { ok: true, json: JSON.parse(text) as unknown };
        } catch {
          return { ok: false, status: res.status, text: "Invalid JSON from Outshift" };
        }
      }
      if (res.status === 401 && !key.endsWith(",")) {
        continue;
      }
      return { ok: false, status: res.status, text };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Network error";
      return { ok: false, status: 0, text: msg };
    }
  }
  return {
    ok: false,
    status: 401,
    text: "Invalid x-id-api-key. Copy the full key from the Outshift dashboard (a trailing comma is part of some keys).",
  };
}

interface OutshiftBlock {
  decimal?: string | number;
  binary?: string;
}

function parseOutshiftBlocks(
  json: unknown,
  min: number,
  max: number,
  size: number,
): number[] | null {
  const data = json as { random_numbers?: OutshiftBlock[] };
  if (!Array.isArray(data.random_numbers) || data.random_numbers.length < size) {
    return null;
  }
  return data.random_numbers.slice(0, size).map((block) => {
    const raw = block.decimal ?? "0";
    return mapDecimalToRange(raw, min, max);
  });
}

function parseOutshiftFloats(json: unknown, size: number): number[] | null {
  const data = json as { random_numbers?: OutshiftBlock[] };
  if (!Array.isArray(data.random_numbers) || data.random_numbers.length < size) {
    return null;
  }
  return data.random_numbers.slice(0, size).map((block) => {
    const raw = block.decimal ?? "0";
    return mapDecimalToUnit(raw);
  });
}

async function tryOutshift(
  apiKey: string,
  min: number,
  max: number,
  size: number,
  format: "decimal" | "all" = "decimal",
): Promise<
  | { result: number[]; raw: unknown; request: object }
  | { error: string }
> {
  const request = {
    encoding: "raw",
    format,
    bits_per_block: bitsForRange(min, max),
    number_of_blocks: size,
  };
  const fetched = await fetchOutshift(apiKey, request);
  if (!fetched.ok) {
    return { error: `Outshift: ${fetched.text}` };
  }
  const result = parseOutshiftBlocks(fetched.json, min, max, size);
  if (!result) {
    return { error: "Outshift: unexpected response shape" };
  }
  return { result, raw: fetched.json, request };
}

async function tryOutshiftFloats(
  apiKey: string,
  size: number,
): Promise<
  | { result: number[]; raw: unknown; request: object }
  | { error: string }
> {
  const request = {
    encoding: "raw",
    format: "decimal",
    bits_per_block: 32,
    number_of_blocks: size,
  };
  const fetched = await fetchOutshift(apiKey, request);
  if (!fetched.ok) {
    return { error: `Outshift: ${fetched.text}` };
  }
  const result = parseOutshiftFloats(fetched.json, size);
  if (!result) {
    return { error: "Outshift: unexpected response shape" };
  }
  return { result, raw: fetched.json, request };
}

async function fetchWithTimeout(url: string): Promise<Response | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    return res.ok ? res : null;
  } catch {
    return null;
  }
}

async function tryQrandomInt(
  min: number,
  max: number,
  size: number,
): Promise<{ result: number[]; raw: unknown[] } | null> {
  const url =
    size === 1 && max > QRANDOM_INTS_SAFE_MAX
      ? `${QRANDOM_INT}?min=${min}&max=${max}`
      : `${QRANDOM_INTS}?min=${min}&max=${Math.min(max, QRANDOM_INTS_SAFE_MAX)}&n=${size}`;
  const res = await fetchWithTimeout(url);
  if (!res) return null;
  const json = (await res.json()) as { number?: number; numbers?: number[] };
  if (Array.isArray(json.numbers) && json.numbers.length >= size) {
    return { result: json.numbers.slice(0, size), raw: [json] };
  }
  if (size === 1 && typeof json.number === "number") {
    return { result: [json.number], raw: [json] };
  }
  return null;
}

function sendJson(res: ServerResponse, source: QrngSourceId, payload: object): void {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
  res.setHeader("X-QRNG-Source", source);
  res.statusCode = 200;
  res.end(JSON.stringify(payload));
}

/** Outshift quota / outage — try qrandom.io instead of failing the draw. */
function isFailoverEligible(error: string): boolean {
  const e = error.toLowerCase();
  if (
    e.includes("no api key") ||
    (e.includes("invalid") && e.includes("key"))
  ) {
    return false;
  }
  return (
    e.includes("daily limit") ||
    e.includes("exceeds your") ||
    e.includes("usage") ||
    e.includes("quota") ||
    e.includes("rate limit") ||
    e.includes("too many") ||
    e.includes("unreachable") ||
    e.includes("network error") ||
    e.includes("timeout") ||
    e.includes("abort") ||
    e.includes("unexpected response")
  );
}

const FAILOVER_NOTICE =
  "Outshift limit or outage — this draw used qrandom.io quantum randomness instead.";

function sendError(res: ServerResponse, status: number, message: string): void {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
  res.end(JSON.stringify({ error: message }));
}

async function runRandint(
  provider: QrngSourceId,
  outshiftKey: string | null,
  min: number,
  max: number,
  size: number,
): Promise<
  | { source: QrngSourceId; result: number[]; raw?: unknown; notice?: string }
  | { error: string }
> {
  if (provider === "outshift") {
    if (!outshiftKey) {
      return { error: "Outshift selected but no API key. Add one in Settings." };
    }
    const outshift = await tryOutshift(outshiftKey, min, max, size);
    if ("error" in outshift) {
      if (isFailoverEligible(outshift.error)) {
        const qrandom = await tryQrandomInt(min, max, size);
        if (qrandom) {
          return {
            source: "qrandom",
            result: qrandom.result,
            raw: qrandom.raw,
            notice: FAILOVER_NOTICE,
          };
        }
      }
      return { error: outshift.error };
    }
    return { source: "outshift", result: outshift.result, raw: outshift.raw };
  }

  const qrandom = await tryQrandomInt(min, max, size);
  if (!qrandom) return { error: "qrandom.io unreachable." };
  return { source: "qrandom", result: qrandom.result, raw: qrandom.raw };
}

async function runRand(
  provider: QrngSourceId,
  outshiftKey: string | null,
  size: number,
): Promise<
  | { source: QrngSourceId; result: number[]; raw?: unknown; notice?: string }
  | { error: string }
> {
  if (provider === "outshift") {
    if (!outshiftKey) {
      return { error: "Outshift selected but no API key. Add one in Settings." };
    }
    const outshift = await tryOutshiftFloats(outshiftKey, size);
    if ("error" in outshift) {
      if (isFailoverEligible(outshift.error)) {
        const qrandom = await tryQrandomInt(0, 1_000_000_000, size);
        if (qrandom) {
          return {
            source: "qrandom",
            result: qrandom.result.map((n) => n / 1_000_000_000),
            raw: qrandom.raw,
            notice: FAILOVER_NOTICE,
          };
        }
      }
      return { error: outshift.error };
    }
    return { source: "outshift", result: outshift.result, raw: outshift.raw };
  }

  const qrandom = await tryQrandomInt(0, 1_000_000_000, size);
  if (!qrandom) return { error: "qrandom.io unreachable." };
  return {
    source: "qrandom",
    result: qrandom.result.map((n) => n / 1_000_000_000),
    raw: qrandom.raw,
  };
}

export function qrngServerPlugin(): Plugin {
  return {
    name: "qrng-server",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ?? "";
        if (!url.startsWith("/api/qrng/")) {
          next();
          return;
        }

        const pathOnly = url.replace(/^\/api\/qrng/, "").split("?")[0] ?? "";
        const body = await readJsonBody(req);
        const outshiftKey = resolveOutshiftKey(req, body);
        const provider = resolveProvider(body, outshiftKey);

        const min =
          typeof body.min === "number"
            ? body.min
            : parseInt(String(body.min ?? "0"), 10);
        const max =
          typeof body.max === "number"
            ? body.max
            : parseInt(String(body.max ?? "0"), 10);
        const size =
          typeof body.size === "number"
            ? body.size
            : parseInt(String(body.size ?? "1"), 10);

        if (pathOnly === "/test") {
          if (provider === "outshift") {
            if (!outshiftKey) {
              sendError(res, 400, "No Outshift API key provided.");
              return;
            }
            const test = await tryOutshift(outshiftKey, 0, 77, 2, "all");
            if ("error" in test) {
              res.statusCode = 502;
              res.setHeader("Content-Type", "application/json");
              res.end(
                JSON.stringify({ ok: false, message: test.error, source: "outshift" }),
              );
              return;
            }
            const blocks = (test.raw as { random_numbers?: OutshiftBlock[] })
              .random_numbers;
            const mapped = blocks?.map((b, i) => {
              const raw = b.decimal ?? "0";
              return i === 0
                ? mapDecimalToRange(raw, 0, 77)
                : mapDecimalToRange(raw, 0, 3);
            });
            sendJson(res, "outshift", {
              ok: true,
              message: `Outshift OK — mapped card ${mapped?.[0]}, orientation ${mapped?.[1]}`,
              source: "outshift",
              raw: test.raw,
              request: test.request,
              mapped,
            });
            return;
          }

          const qrandom = await tryQrandomInt(0, 77, 1);
          if (!qrandom) {
            res.statusCode = 502;
            res.end(
              JSON.stringify({ ok: false, message: "qrandom.io unreachable", source: "qrandom" }),
            );
            return;
          }
          sendJson(res, "qrandom", {
            ok: true,
            message: `qrandom.io OK — sample card ${qrandom.result[0]}`,
            source: "qrandom",
            raw: qrandom.raw,
            mapped: qrandom.result,
          });
          return;
        }

        if (pathOnly === "/randint") {
          const out = await runRandint(provider, outshiftKey, min, max, size);
          if ("error" in out) {
            sendError(res, 502, out.error);
            return;
          }
          sendJson(res, out.source, {
            result: out.result,
            raw: out.raw,
            ...(out.notice ? { notice: out.notice } : {}),
          });
          return;
        }

        if (pathOnly === "/rand") {
          const out = await runRand(provider, outshiftKey, size);
          if ("error" in out) {
            sendError(res, 502, out.error);
            return;
          }
          sendJson(res, out.source, {
            result: out.result,
            raw: out.raw,
            ...(out.notice ? { notice: out.notice } : {}),
          });
          return;
        }

        next();
      });
    },
  };
}
