interface IntentFieldProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  /** Initial visit vs returning after a reading. */
  mode?: "initial" | "afterReading";
  spacetimeOn?: boolean;
}

export function IntentField({
  value,
  onChange,
  disabled,
  mode = "initial",
  spacetimeOn = false,
}: IntentFieldProps) {
  const helper =
    mode === "afterReading"
      ? spacetimeOn
        ? "Text focus is optional while spacetime is on—both mix into the hash with fresh QRNG. Your first draw stays in the chain."
        : "Your first draw stays in the chain. Edit focus anytime—each collapse still gets new random numbers hashed with your wording. Clear the field for a direct map with no focus mix."
      : spacetimeOn
        ? "Optional words plus spacetime (when toggled on) hash with fresh random numbers each draw."
        : "Optional: your question or intention is hashed with fresh random numbers each draw. Wording matters, not length. Leave blank for a direct map from QRNG alone.";

  return (
    <div className="w-full max-w-md text-left">
      <label
        htmlFor="draw-intent"
        className="block text-xs font-medium tracking-wide text-star/60 uppercase"
      >
        Focus (optional)
      </label>
      <p className="mt-1 text-xs leading-relaxed text-star/45">{helper}</p>
      <textarea
        id="draw-intent"
        rows={3}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        placeholder="A name, question, situation, or intention…"
        className="mt-3 w-full resize-y rounded-xl border border-white/15 bg-void/60 px-4 py-3 text-sm leading-relaxed text-star placeholder:text-star/30 focus:border-accent/50 focus:outline-none disabled:opacity-50"
      />
    </div>
  );
}
