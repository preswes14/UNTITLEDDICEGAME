// ============================================================================
// Deterministic, serializable RNG.
//
// FULLY IMPLEMENTED — reference implementation, do not rewrite.
//
// Why this exists: the engine must be a pure function of (state, action).
// Math.random() would make saves non-reproducible and multiplayer clients
// diverge. Instead, RNG state is 4 plain numbers stored inside RunState and
// every draw returns BOTH the value and the next state.
//
// Usage pattern inside systems:
//   const [roll, rng] = d20(state.rng);
//   return { ...state, rng, ... };
//
// Algorithm: sfc32 (Small Fast Counter) — good quality, 128-bit state,
// trivially JSON-serializable. Seeded from a string via MurmurHash3 mixing.
// ============================================================================

/** Four uint32 words. Plain data — serializes with the rest of RunState. */
export type RngState = readonly [number, number, number, number];

/** Derive an RngState from an arbitrary seed string. */
export function seedRng(seed: string): RngState {
  // xmur3 string hash -> four 32-bit seeds
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  const next = () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
  let s: RngState = [next(), next(), next(), next()];
  // Warm up: discard early correlated outputs.
  for (let i = 0; i < 12; i++) s = nextU32(s)[1];
  return s;
}

/** Core generator: one uint32 draw. */
export function nextU32(s: RngState): [number, RngState] {
  let [a, b, c, d] = s;
  a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0;
  const t = (a + b) | 0;
  a = b ^ (b >>> 9);
  b = (c + (c << 3)) | 0;
  c = (c << 21) | (c >>> 11);
  d = (d + 1) | 0;
  const out = (t + d) | 0;
  c = (c + out) | 0;
  return [out >>> 0, [a >>> 0, b >>> 0, c >>> 0, d >>> 0]];
}

/** Uniform float in [0, 1). */
export function nextFloat(s: RngState): [number, RngState] {
  const [u, s2] = nextU32(s);
  return [u / 4294967296, s2];
}

/** Uniform integer in [min, max] inclusive. */
export function nextInt(s: RngState, min: number, max: number): [number, RngState] {
  if (max < min) throw new Error(`nextInt: max ${max} < min ${min}`);
  const span = max - min + 1;
  // Rejection sampling to avoid modulo bias.
  const limit = Math.floor(4294967296 / span) * span;
  let u: number, s2: RngState = s;
  do {
    [u, s2] = nextU32(s2);
  } while (u >= limit);
  return [min + (u % span), s2];
}

/** A d20 roll: integer in [1, 20]. */
export function d20(s: RngState): [number, RngState] {
  return nextInt(s, 1, 20);
}

/** Uniform slot on a 20-face die: integer in [0, 19]. */
export function d20Slot(s: RngState): [number, RngState] {
  return nextInt(s, 0, 19);
}

/** Pick one element uniformly. */
export function pick<T>(s: RngState, arr: readonly T[]): [T, RngState] {
  if (arr.length === 0) throw new Error('pick: empty array');
  const [i, s2] = nextInt(s, 0, arr.length - 1);
  return [arr[i] as T, s2];
}

/**
 * Weighted pick. Weights need not sum to any particular value.
 * Used for the 47/27/27 neutral-encounter outcome splits.
 */
export function pickWeighted<T>(
  s: RngState,
  entries: readonly { weight: number; value: T }[],
): [T, RngState] {
  const totalWeight = entries.reduce((sum, e) => sum + e.weight, 0);
  if (totalWeight <= 0) throw new Error('pickWeighted: non-positive total weight');
  const [f, s2] = nextFloat(s);
  let cursor = f * totalWeight;
  for (const e of entries) {
    cursor -= e.weight;
    if (cursor < 0) return [e.value, s2];
  }
  return [entries[entries.length - 1]!.value, s2];
}

/**
 * Fisher–Yates shuffle (returns a new array).
 * NOTE: the legacy prototype used `arr.sort(() => Math.random() - 0.5)`,
 * which is biased and engine-dependent (REVIEW.md #2). Always use this.
 */
export function shuffled<T>(s: RngState, arr: readonly T[]): [T[], RngState] {
  const out = arr.slice();
  let s2 = s;
  for (let i = out.length - 1; i > 0; i--) {
    const [j, sNext] = nextInt(s2, 0, i);
    s2 = sNext;
    const tmp = out[i] as T;
    out[i] = out[j] as T;
    out[j] = tmp;
  }
  return [out, s2];
}
