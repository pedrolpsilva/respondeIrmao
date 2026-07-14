const { performance } = require('perf_hooks');

const POOL_SIZE = 10000;
const PLAYED_SIZE = 5000;

const pool = Array.from({ length: POOL_SIZE }, (_, i) => ({ id: `q_${i}` }));
const playedQuestionIds = Array.from({ length: PLAYED_SIZE }, (_, i) => `q_${i * 2}`);
const playedIdsByMe = Array.from({ length: PLAYED_SIZE / 2 }, (_, i) => `q_${i * 4}`);

const config = {
  repeatOtherPlayers: false,
  repeatSamePlayer: false
};

const forceResetRepeated = false;

function testIncludes() {
  const start = performance.now();
  for (let i = 0; i < 100; i++) {
    const available = pool.filter(q => {
      const alreadyPlayedGlobal = playedQuestionIds.includes(q.id);
      const alreadyPlayedByMe = playedIdsByMe.includes(q.id);

      if (forceResetRepeated) return true;
      if (!config.repeatOtherPlayers && alreadyPlayedGlobal) return false;
      if (!config.repeatSamePlayer && alreadyPlayedByMe) return false;
      return true;
    });
  }
  const end = performance.now();
  return end - start;
}

function testSet() {
  const start = performance.now();
  for (let i = 0; i < 100; i++) {
    const playedGlobalSet = new Set(playedQuestionIds);
    const playedByMeSet = new Set(playedIdsByMe);
    const available = pool.filter(q => {
      const alreadyPlayedGlobal = playedGlobalSet.has(q.id);
      const alreadyPlayedByMe = playedByMeSet.has(q.id);

      if (forceResetRepeated) return true;
      if (!config.repeatOtherPlayers && alreadyPlayedGlobal) return false;
      if (!config.repeatSamePlayer && alreadyPlayedByMe) return false;
      return true;
    });
  }
  const end = performance.now();
  return end - start;
}

const timeIncludes = testIncludes();
const timeSet = testSet();

console.log(`Array.includes approach: ${timeIncludes.toFixed(2)} ms`);
console.log(`Set.has approach: ${timeSet.toFixed(2)} ms`);
console.log(`Speedup: ${(timeIncludes / timeSet).toFixed(2)}x`);
