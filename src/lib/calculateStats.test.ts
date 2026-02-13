import { describe, it, expect } from 'vitest';
import { calculateStats } from './stats';

describe('calculateStats', () => {
  it('should calculate the correct IQR for the user provided dataset', () => {
    const numbers = [2,2,19,61,64,64,70,79,82,92,93,95,118,123,127,138,160,167,171,176,176,186,217,232,267,282,284,286,310,313,318,323,324,325,337,369,386,389,413,417,444,450,454,460,476,480,505,512,546,546,552,584,590,593,593,595,614,620,623,636,644,648,650,680,680,684,692,698,704,710,721,732,740,744,752,760,763,773,777,794,805,806,807,822,823,846,858,864,880,889,895,934,944,947,950,956,967,983,988,989];
    const stats = calculateStats(numbers, false);
    
    // User says IQR should be 487.25
    // Current reports 475.75
    expect(stats.iqr).toBe(487.25);
    expect(stats.q1).toBe(270.75);
    expect(stats.q3).toBe(758);
    expect(stats.mode).toBe("2, 64, 176, 546, 593, 680");
  });
});
