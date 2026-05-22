/**
 * Edge QRNG proxy for static hosting (GitHub Pages).
 * qrandom.io and Outshift do not send browser CORS headers.
 *
 * Deploy: npx wrangler deploy --config worker/wrangler.toml
 * Then set repo variable QRNG_PROXY_URL to the workers.dev URL and rebuild Pages.
 */
import {
  runRand,
  runRandint,
  runTest,
  type QrngRunResult,
} from "../src/lib/qrngProviders";
import type { QrngProvider } from "../src/lib/qrngSettings";

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Cache-Control": "no-store",
};

function json(
  status: number,
  body: object,
  source?: QrngProvider,
): Response {
  const headers = new Headers(CORS_HEADERS);
  headers.set("Content-Type", "application/json");
  if (source) headers.set("X-QRNG-Source", source);
  return new Response(JSON.stringify(body), { status, headers });
}

function routePath(pathname: string): "randint" | "rand" | "test" | null {
  if (pathname.endsWith("/randint")) return "randint";
  if (pathname.endsWith("/rand")) return "rand";
  if (pathname.endsWith("/test")) return "test";
  return null;
}

interface Body {
  provider?: QrngProvider;
  apiKey?: string | null;
  min?: number;
  max?: number;
  size?: number;
}

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS_HEADERS });
    }
    if (request.method !== "POST") {
      return json(405, { error: "POST only" });
    }

    const route = routePath(new URL(request.url).pathname);
    if (!route) {
      return json(404, { error: "Unknown route" });
    }

    let body: Body = {};
    try {
      body = (await request.json()) as Body;
    } catch {
      return json(400, { error: "Invalid JSON body" });
    }

    const provider = body.provider ?? "qrandom";
    const apiKey = body.apiKey ?? null;

    if (route === "test") {
      const out = await runTest(provider, apiKey);
      return json(out.ok ? 200 : 502, out, out.source);
    }

    if (route === "randint") {
      const min = body.min ?? 0;
      const max = body.max ?? 0;
      const size = body.size ?? 1;
      const out = await runRandint(provider, apiKey, min, max, size);
      return runToResponse(out);
    }

    const size = body.size ?? 1;
    const out = await runRand(provider, apiKey, size);
    return runToResponse(out);
  },
};

function runToResponse(out: QrngRunResult): Response {
  if ("error" in out) {
    return json(502, { error: out.error });
  }
  return json(200, {
    result: out.result,
    raw: out.raw,
    ...(out.notice ? { notice: out.notice } : {}),
  }, out.source);
}
