const { performance } = require('perf_hooks');

// Generate large test data
const POOL_SIZE = 10000;
const PLAYED_SIZE = 5000;
const ITERATIONS = 100;

const pool = Array.from({ length: POOL_SIZE }, (_, i) => ({ id: `q${i}` }));
const playedQuestionIds = Array.from({ length: PLAYED_SIZE }, (_, i) => `q${i * 2}`);
const currentPlayer = { playedIds: Array.from({ length: PLAYED_SIZE / 2 }, (_, i) => `q${i * 4}`) };
const config = { repeatOtherPlayers: false, repeatSamePlayer: false };

// BASELINE
const startBaseline = performance.now();
let resultBaseline;
for (let i = 0; i < ITERATIONS; i++) {
  resultBaseline = pool.filter(q => {
    const alreadyPlayedGlobal = playedQuestionIds.includes(q.id);
    const alreadyPlayedByMe = currentPlayer?.playedIds?.includes(q.id);

    if (!config.repeatOtherPlayers && alreadyPlayedGlobal) return false;
    if (!config.repeatSamePlayer && alreadyPlayedByMe) return false;
    return true;
  });
}
const endBaseline = performance.now();
const baselineTime = endBaseline - startBaseline;

// OPTIMIZED
const startOptimized = performance.now();
let resultOptimized;
for (let i = 0; i < ITERATIONS; i++) {
  const globalPlayedSet = new Set(playedQuestionIds);
  const myPlayedSet = new Set(currentPlayer?.playedIds || []);

  resultOptimized = pool.filter(q => {
    const alreadyPlayedGlobal = globalPlayedSet.has(q.id);
    const alreadyPlayedByMe = myPlayedSet.has(q.id);

    if (!config.repeatOtherPlayers && alreadyPlayedGlobal) return false;
    if (!config.repeatSamePlayer && alreadyPlayedByMe) return false;
    return true;
  });
}
const endOptimized = performance.now();
const optimizedTime = endOptimized - startOptimized;

console.log(`Baseline: ${baselineTime.toFixed(2)} ms`);
console.log(`Optimized: ${optimizedTime.toFixed(2)} ms`);
console.log(`Improvement: ${((baselineTime - optimizedTime) / baselineTime * 100).toFixed(2)}% faster`);
