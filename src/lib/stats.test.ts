import { describe, it, expect } from 'vitest';
import { calculateWelchTTest, calculateSampleSummary, calculateMannWhitneyU, calculatePairedTTest } from './stats';

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

  describe('calculateMannWhitneyU', () => {
    it('should correctly calculate Mann-Whitney U for a known sample', () => {
      const sampleA = [12, 15, 11, 18, 14];
      const sampleB = [9, 13, 10, 12, 8];

      const result = calculateMannWhitneyU(sampleA, sampleB);

      expect(result).not.toBeNull();
      if (result) {
        expect(result.uA).toBe(3.5);
        expect(result.uB).toBe(21.5);
        expect(result.z).toBeCloseTo(1.78, 2);
        expect(result.p).toBeCloseTo(0.075, 3);
      }
    });

    it('should handle no ties correctly', () => {
      const sampleA = [1, 3, 5];
      const sampleB = [2, 4, 6];

      const result = calculateMannWhitneyU(sampleA, sampleB);

      expect(result).not.toBeNull();
      if (result) {
        expect(result.uA).toBe(3);
        expect(result.uB).toBe(6);
        // uSmallest = 3, meanU = 4.5
        // sigmaU = sqrt(3*3*7/12) = 2.2913
        // z = (|3 - 4.5| - 0.5) / 2.2913 = 1 / 2.2913 = 0.4364
        expect(result.z).toBeCloseTo(0.4364, 4);
      }
    });
  });

  describe('calculatePairedTTest', () => {
    it('should correctly calculate paired t-test for a known sample', () => {
      // Sample A: [10, 12, 15, 18, 20]
      // Sample B: [8, 11, 14, 17, 19]
      // Differences: [2, 1, 1, 1, 1]
      // Mean difference: 1.2
      // SD of differences: 0.4472
      // SE: 0.4472 / sqrt(5) = 0.2
      // t: 1.2 / 0.2 = 6
      const sampleA = [10, 12, 15, 18, 20];
      const sampleB = [8, 11, 14, 17, 19];

      const result = calculatePairedTTest(sampleA, sampleB);

      expect(result).not.toBeNull();
      if (result) {
        expect(result.n).toBe(5);
        expect(result.meanDiff).toBeCloseTo(1.2, 4);
        expect(result.t).toBeCloseTo(6.0, 4);
        expect(result.df).toBe(4);
        expect(result.p).toBeCloseTo(0.0039, 4);
      }
    });

    it('should return null for unequal sample sizes', () => {
      const result = calculatePairedTTest([1, 2], [1, 2, 3]);
      expect(result).toBeNull();
    });
  });
});
