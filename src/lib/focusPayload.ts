import type { SpacetimeSnapshot } from "../types/spacetime";

/** Canonical string mixed into SHA-256 with QRNG (text + optional spacetime). */
export function buildAlignmentFocusString(
  text: string,
  spacetime?: SpacetimeSnapshot | null,
): string {
  const intent = text.trim();
  if (!spacetime) return intent;
  return JSON.stringify({ intent, spacetime });
}

export function hasActiveFocus(
  text: string,
  spacetime?: SpacetimeSnapshot | null,
): boolean {
  return Boolean(text.trim()) || Boolean(spacetime);
}
