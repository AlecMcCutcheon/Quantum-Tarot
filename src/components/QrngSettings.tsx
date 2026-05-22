import { useCallback, useEffect, useState } from "react";
import { testQrngConnection } from "../api/qrng";
import {
  clearOutshiftApiKey,
  getOutshiftApiKey,
  getQrngProvider,
  hasOutshiftApiKey,
  setOutshiftApiKey,
  setQrngProvider,
  type QrngProvider,
} from "../lib/qrngSettings";

const PROVIDERS: { id: QrngProvider; label: string }[] = [
  { id: "outshift", label: "Outshift QRNG" },
  { id: "qrandom", label: "qrandom.io" },
];

export function QrngSettings() {
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState("");
  const [provider, setProvider] = useState<QrngProvider>("outshift");
  const [saved, setSaved] = useState(false);
  const [testMsg, setTestMsg] = useState<string | null>(null);
  const [testOk, setTestOk] = useState(false);
  const [testing, setTesting] = useState(false);
  const [rawOpen, setRawOpen] = useState(false);
  const [rawJson, setRawJson] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setToken(getOutshiftApiKey() ?? "");
      setProvider(getQrngProvider());
      setSaved(hasOutshiftApiKey());
      setTestMsg(null);
      setTestOk(false);
      setRawJson(null);
      setRawOpen(false);
    }
  }, [open]);

  const handleSave = useCallback(() => {
    setQrngProvider(provider);
    if (token.trim()) {
      setOutshiftApiKey(token);
      setSaved(true);
    } else {
      clearOutshiftApiKey();
      setSaved(false);
    }
    setOpen(false);
  }, [token, provider]);

  const handleClear = useCallback(() => {
    clearOutshiftApiKey();
    setToken("");
    setSaved(false);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-20 rounded-full border border-white/10 bg-void/80 p-2.5 text-star/50 shadow-lg backdrop-blur-sm transition hover:border-accent/40 hover:text-accent"
        aria-label="QRNG settings"
        title="Quantum RNG settings"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
        {saved && (
          <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-accent" />
        )}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-30 flex items-end justify-center bg-black/60 p-4 sm:items-center"
          role="dialog"
          aria-labelledby="qrng-settings-title"
          aria-modal="true"
          onClick={() => setOpen(false)}
        >
          <div
            className="max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-2xl border border-white/10 bg-nebula p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              id="qrng-settings-title"
              className="font-display text-sm font-semibold tracking-wide text-accent uppercase"
            >
              Quantum RNG
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-star/70">
              Choose one quantum source for draws. Outshift keys stay in this
              browser only (<code className="text-xs">localStorage</code>).
            </p>

            <fieldset className="mt-4">
              <legend className="text-left text-xs font-medium text-star/60">
                Provider
              </legend>
              <div className="mt-2 flex flex-col gap-2">
                {PROVIDERS.map((p) => (
                  <label
                    key={p.id}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm text-star/80 ${
                      provider === p.id
                        ? "border-accent/40 bg-accent/5"
                        : "border-white/10"
                    }`}
                  >
                    <input
                      type="radio"
                      name="qrng-provider"
                      value={p.id}
                      checked={provider === p.id}
                      onChange={() => setProvider(p.id)}
                      className="accent-accent"
                    />
                    {p.label}
                  </label>
                ))}
              </div>
            </fieldset>

            {provider === "outshift" && (
              <>
                <label className="mt-4 block text-left text-xs font-medium text-star/60">
                  Outshift API key (
                  <code className="text-star/50">x-id-api-key</code>)
                </label>
                <input
                  type="password"
                  autoComplete="off"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Paste key from Outshift dashboard"
                  className="mt-1 w-full rounded-lg border border-white/15 bg-void/60 px-3 py-2 text-sm text-star placeholder:text-star/30 focus:border-accent/50 focus:outline-none"
                />
                <p className="mt-2 text-left text-xs text-star/45">
                  Copy the key exactly. Some keys end with a comma — include it
                  if present.
                </p>
              </>
            )}

            {testMsg && (
              <p
                className={`mt-3 text-left text-xs ${testOk ? "text-green-400/90" : "text-red-300/90"}`}
              >
                {testMsg}
              </p>
            )}

            {rawJson && (
              <div className="mt-3 text-left">
                <button
                  type="button"
                  onClick={() => setRawOpen((v) => !v)}
                  className="text-xs text-accent underline-offset-2 hover:underline"
                >
                  {rawOpen ? "Hide" : "View"} raw API response
                </button>
                {rawOpen && (
                  <pre className="mt-2 max-h-48 overflow-auto rounded-lg border border-white/10 bg-void/80 p-2 font-mono text-[10px] leading-snug text-star/70 whitespace-pre-wrap break-all">
                    {rawJson}
                  </pre>
                )}
              </div>
            )}

            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                disabled={
                  testing || (provider === "outshift" && !token.trim())
                }
                onClick={async () => {
                  setTesting(true);
                  setTestMsg(null);
                  setRawJson(null);
                  setRawOpen(false);
                  if (provider === "outshift" && token.trim()) {
                    setOutshiftApiKey(token);
                  }
                  const r = await testQrngConnection(provider);
                  setTestOk(r.ok);
                  setTestMsg(r.message);
                  if (r.raw !== undefined) {
                    setRawJson(
                      JSON.stringify(
                        { request: r.request, response: r.raw, mapped: r.mapped },
                        null,
                        2,
                      ),
                    );
                  }
                  setTesting(false);
                }}
                className="rounded-lg px-4 py-2 text-sm text-accent hover:bg-accent/10 disabled:opacity-40"
              >
                {testing ? "Testing…" : "Test connection"}
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="rounded-lg px-4 py-2 text-sm text-star/60 hover:text-star"
              >
                Clear key
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg px-4 py-2 text-sm text-star/60 hover:text-star"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="rounded-lg bg-accent/20 px-4 py-2 text-sm font-medium text-accent hover:bg-accent/30"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
