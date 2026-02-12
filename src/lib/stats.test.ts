import { describe, it, expect } from 'vitest';
import { calculateWelchTTest, calculateSampleSummary, calculateMannWhitneyU, calculatePairedTTest, calculateANOVA, calculateRepeatedMeasuresANOVA, calculateTukeyHSD, calculateKruskalWallis } from './stats';

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

  describe('calculateANOVA', () => {
    it('should correctly calculate ANOVA for a known sample', () => {
      // Group 1: 10, 12, 11, 13, 11 (Mean: 11.4, n=5)
      // Group 2: 14, 15, 13, 16, 14 (Mean: 14.4, n=5)
      // Group 3: 18, 17, 19, 17, 18 (Mean: 17.8, n=5)
      // Grand Mean: (11.4 + 14.4 + 17.8) / 3 = 14.5333
      // SS_between = 5*(11.4-14.533)^2 + 5*(14.4-14.533)^2 + 5*(17.8-14.533)^2
      // SS_between = 49.066 + 0.088 + 53.355 = 102.533
      // SS_within = 2+2+2+4+2 + 2+1+2+4+2 + 2+1+2+1+2 = 2.0+1.4+2.8 = ... (actually it's simpler)
      // Let's use known values for this test
      const samples = [
        [10, 12, 11, 13, 11],
        [14, 15, 13, 16, 14],
        [18, 17, 19, 17, 18]
      ];

      const result = calculateANOVA(samples);

      expect(result).not.toBeNull();
      if (result) {
        expect(result.dfBetween).toBe(2);
        expect(result.dfWithin).toBe(12);
        expect(result.fValue).toBeCloseTo(46.606, 3);
        expect(result.pValue).toBeLessThan(0.0001);
      }
    });

    it('should return null for insufficient samples', () => {
      expect(calculateANOVA([[1, 2]])).toBeNull();
      expect(calculateANOVA([[1, 2], []])).toBeNull();
      expect(calculateANOVA([[1], [2]])).toBeNull(); // dfWithin = 2 - 2 = 0
    });
  });

  describe('calculateRepeatedMeasuresANOVA', () => {
    it('should correctly calculate RM ANOVA for a known sample', () => {
      // Example data: 3 treatments, 4 subjects
      const samples = [
        [10, 12, 11, 13], // Treatment 1
        [14, 15, 13, 16], // Treatment 2
        [18, 17, 19, 17]  // Treatment 3
      ];
      
      const result = calculateRepeatedMeasuresANOVA(samples);
      expect(result).not.toBeNull();
      if (result) {
        expect(result.dfBetween).toBe(2);
        expect(result.dfSubjects).toBe(3);
        expect(result.dfWithin).toBe(6);
        expect(result.fValue).toBeGreaterThan(0);
        expect(result.pValue).toBeLessThan(0.05);
        expect(result.tukeyResults).toBeDefined();
        expect(result.tukeyResults?.length).toBe(3); // 3 pairs for 3 groups
      }
    });

    it('should return null for unequal sample sizes', () => {
      const samples = [[1, 2], [3, 4, 5]];
      expect(calculateRepeatedMeasuresANOVA(samples)).toBeNull();
    });
  });

  describe('calculateTukeyHSD', () => {
    it('should return correct results for significant differences', () => {
      const means = [10, 20, 30];
      const ns = [5, 5, 5];
      const msError = 2;
      const dfError = 12;
      const results = calculateTukeyHSD(means, ns, msError, dfError);
      expect(results.length).toBe(3);
      expect(results[0].pValue).toBeLessThan(0.05);
      expect(results[1].pValue).toBeLessThan(0.001);
      expect(results[2].pValue).toBeLessThan(0.05);
    });
  });

  describe('calculateKruskalWallis', () => {
    it('should correctly calculate Kruskal-Wallis for sequential groups', () => {
      const samples = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
      ];

      const result = calculateKruskalWallis(samples);

      expect(result).not.toBeNull();
      if (result) {
        expect(result.h).toBeCloseTo(7.2, 1);
        expect(result.df).toBe(2);
        expect(result.p).toBeCloseTo(0.0273, 4);
      }
    });
  });
});
