/** Mulberry32 PRNG — deterministic stream from quantum integer seed. */
export function seededRng(seed: number[]): () => number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed[i], 0x5bd1e995);
    h ^= h >>> 15;
  }
  if (h === 0) h = 0x6d2b79f5;

  return () => {
    h = Math.imul(h ^ (h >>> 15), h | 1);
    h ^= h >>> 13;
    h = Math.imul(h ^ (h >>> 16), h | 1);
    return (h >>> 0) / 4294967296;
  };
}

export function seedFromIntegers(ints: number[]): number[] {
  return ints.map((n) => (n >>> 0) ^ (n * 2654435761));
}
