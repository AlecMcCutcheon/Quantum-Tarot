/** Map a quantum API decimal string/number into inclusive [min, max]. */
export function mapDecimalToRange(
  raw: string | number,
  min: number,
  max: number,
): number {
  const span = max - min + 1;
  const digits = String(raw).replace(/\D/g, "") || "0";
  let mod = 0n;
  for (let i = 0; i < digits.length; i++) {
    mod = (mod * 10n + BigInt(digits.charCodeAt(i) - 48)) % BigInt(span);
  }
  return min + Number(mod);
}

/** Unit float in [0, 1) from decimal digits. */
export function mapDecimalToUnit(raw: string | number): number {
  const digits = String(raw).replace(/\D/g, "") || "0";
  let mod = 0n;
  const divisor = 1_000_000_000n;
  for (let i = 0; i < digits.length; i++) {
    mod = (mod * 10n + BigInt(digits.charCodeAt(i) - 48)) % divisor;
  }
  return Number(mod) / Number(divisor);
}
