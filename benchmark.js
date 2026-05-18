const { performance } = require('perf_hooks');

const players = [
  { id: '1', name: 'Alice', points: 50 },
  { id: '2', name: 'Bob', points: 30 },
  { id: '3', name: 'Charlie', points: 80 },
  { id: '4', name: 'Diana', points: 10 },
  { id: '5', name: 'Eve', points: 90 },
];

const ITERATIONS = 100000;

// BASELINE
const startBaseline = performance.now();
let resultBaseline;
for (let i = 0; i < ITERATIONS; i++) {
  resultBaseline = [...players].sort((a, b) => b.points - a.points);
}
const endBaseline = performance.now();
const baselineTime = endBaseline - startBaseline;

// OPTIMIZED (memoized)
const startOptimized = performance.now();
let resultOptimized;
// simulate useMemo running once when dependencies change
const memoizedResult = [...players].sort((a, b) => b.points - a.points);
for (let i = 0; i < ITERATIONS; i++) {
  resultOptimized = memoizedResult;
}
const endOptimized = performance.now();
const optimizedTime = endOptimized - startOptimized;

console.log(`Baseline (sorting every render): ${baselineTime.toFixed(2)} ms`);
console.log(`Optimized (useMemo): ${optimizedTime.toFixed(2)} ms`);
console.log(`Improvement: ${((baselineTime - optimizedTime) / baselineTime * 100).toFixed(2)}% faster`);
