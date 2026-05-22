type DrawButtonVariant = "collapse" | "another";

interface DrawButtonProps {
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
  /** Overrides default loading label for the variant. */
  loadingLabel?: string;
  shimmer?: boolean;
  variant?: DrawButtonVariant;
}

const LABELS: Record<
  DrawButtonVariant,
  { idle: string; loading: string }
> = {
  collapse: { idle: "Collapse the Wave", loading: "Collapsing…" },
  another: { idle: "New Measurement", loading: "Returning…" },
};

export function DrawButton({
  onClick,
  disabled,
  loading,
  loadingLabel,
  shimmer = false,
  variant = "collapse",
}: DrawButtonProps) {
  const labels = LABELS[variant];
  const showShimmer = loading && shimmer;
  const label = loading ? (loadingLabel ?? labels.loading) : labels.idle;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-busy={loading}
      className={`font-display relative overflow-hidden rounded-full border px-8 py-3 text-sm font-semibold tracking-widest uppercase transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-void disabled:cursor-not-allowed disabled:opacity-40 ${
        showShimmer
          ? "border-accent/60 bg-accent/20 text-accent"
          : "border-accent/40 bg-accent/15 text-accent hover:border-accent hover:bg-accent/25"
      }`}
    >
      {showShimmer ? (
        <span
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-accent/35 to-transparent motion-safe:animate-[shimmer_1.4s_ease-in-out_infinite] bg-[length:200%_100%]"
          aria-hidden
        />
      ) : null}
      <span className="relative">{label}</span>
    </button>
  );
}
