import type { ReactNode } from "react";

interface ReadabilityBlobProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  /** Tighter blobs for small label stacks (card headers). */
  compact?: boolean;
}

/** Soft blurred blobs behind text so orbit/star backdrops stay readable. */
export function ReadabilityBlob({
  children,
  className = "",
  contentClassName = "",
  compact = false,
}: ReadabilityBlobProps) {
  return (
    <div
      className={`readability-blob-wrap relative ${compact ? "readability-blob-wrap--compact" : ""} ${className}`.trim()}
    >
      <div className="readability-blob readability-blob--primary" aria-hidden />
      <div className="readability-blob readability-blob--secondary" aria-hidden />
      <div className={`relative z-10 ${contentClassName}`.trim()}>{children}</div>
    </div>
  );
}
