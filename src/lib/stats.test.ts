import { describe, it, expect } from 'vitest';
import { calculateWelchTTest, calculateSampleSummary } from './stats';

describe('stats lib', () => {
  describe('calculateWelchTTest', () => {
    it('should correctly calculate Welch\'s t-test for a known sample', () => {
      // sample 1: (mean/stdev/n) 162/3/15
      // sample 2: 154/4/17
      const m1 = 162, s1 = 3, n1 = 15;
      const m2 = 154, s2 = 4, n2 = 17;

      const result = calculateWelchTTest(m1, s1, n1, m2, s2, n2);

      // expected t-score (within 0.001): 6.4441
      expect(result.t).toBeCloseTo(6.4441, 3);

      // expected DoFs (to the nearest integer): 29.2957
      // Note: User said "to the nearest integer" but gave 29.2957.
      // I'll check for the exact-ish value first.
      expect(result.df).toBeCloseTo(29.2957, 4);

      // expected p: <0.0001
      expect(result.p).toBeLessThan(0.0001);
    });
  });

  describe('calculateSampleSummary', () => {
    it('should correctly calculate summary for a list of numbers', () => {
      const numbers = [10, 12, 23, 23, 16, 23, 21, 16];
      const summary = calculateSampleSummary(numbers);
      expect(summary).not.toBeNull();
      if (summary) {
        expect(summary.n).toBe(8);
        expect(summary.mean).toBe(18);
        expect(summary.sd).toBeCloseTo(5.2372, 4);
      }
    });

    it('should return null for empty array', () => {
      expect(calculateSampleSummary([])).toBeNull();
    });
  });
});
