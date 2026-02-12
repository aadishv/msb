import { describe, it, expect } from 'vitest';
import { calculateStats } from '../lib/stats';

describe('calculateStats', () => {
  const dataset = [3, 3, 3, 3];

  it('calculates basic stats for population correctly', () => {
    const stats = calculateStats(dataset, true);
    expect(stats.count).toBe(4);
    expect(stats.mean).toBe(3);
    expect(stats.median).toBe(3);
    expect(stats.mode).toBe('3');
    expect(stats.min).toBe(3);
    expect(stats.max).toBe(3);
    expect(stats.range).toBe(0);
    expect(stats.variance).toBe(0);
    expect(stats.stdDev).toBe(0);
  });

  it('calculates stats for a varied dataset (Population)', () => {
    const data = [10, 2, 38, 23, 38, 23, 21];
    // Sorted: 2, 10, 21, 23, 23, 38, 38
    // Mean: (10+2+38+23+38+23+21) / 7 = 155 / 7 ≈ 22.1428
    const stats = calculateStats(data, true);
    
    expect(stats.count).toBe(7);
    expect(stats.mean).toBeCloseTo(22.142857, 4);
    expect(stats.median).toBe(23);
    expect(stats.mode).toBe('23, 38');
    expect(stats.min).toBe(2);
    expect(stats.max).toBe(38);
  });

  it('differentiates between Population and Sample variance', () => {
    const data = [1, 2, 3];
    // Mean = 2
    // Sum of squares: (1-2)^2 + (2-2)^2 + (3-2)^2 = 1 + 0 + 1 = 2
    
    const popStats = calculateStats(data, true);
    expect(popStats.variance).toBe(2 / 3); // 0.666...
    
    const sampleStats = calculateStats(data, false);
    expect(sampleStats.variance).toBe(2 / 2); // 1
  });

  it('handles empty input', () => {
    const stats = calculateStats([], true);
    expect(stats.count).toBe(0);
    expect(stats.mean).toBe(0);
  });

  it('calculates quartiles correctly', () => {
    const data = [1, 2, 3, 4, 5, 6, 7, 8];
    // Pos = (8-1) * 0.25 = 1.75 -> Index 1 (2) + 0.75 * (3-2) = 2.75
    // Pos = (8-1) * 0.75 = 5.25 -> Index 5 (6) + 0.25 * (7-6) = 6.25
    const stats = calculateStats(data, true);
    expect(stats.q1).toBe(2.75);
    expect(stats.q3).toBe(6.25);
    expect(stats.iqr).toBe(3.5);
  });

  describe('Welch T-Test', () => {
    it('calculates t-score and p-value correctly', () => {
      // Example: m1=25, s1=5, n1=30, m2=22, s2=6, n2=28
      const { calculateWelchTTest } = require('../lib/stats');
      const results = calculateWelchTTest(25, 5, 30, 22, 6, 28);
      
      expect(results.t).toBeCloseTo(2.0609, 4);
      expect(results.df).toBeCloseTo(52.7218, 4);
      expect(results.p).toBeCloseTo(0.0442, 4);
    });
  });
});
