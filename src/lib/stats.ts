import { chiSquareUpperTailPValue, fUpperTailPValue, mean, normalCdf, sum, tTwoTailedPValue } from './math';

export type ParsedNumberInput = {
  tokens: Array<{ type: 'delimiter' | 'valid' | 'error'; content: string; value?: number }>;
  numbers: number[];
  errors: number;
};

export function parseNumberInput(value: string): ParsedNumberInput {
  const rawTokens = value.split(/([,\s\n]+)/);
  const numbers: number[] = [];
  let errors = 0;

  const tokens = rawTokens.map((token) => {
    if (/^[,\s\n]+$/.test(token) || token === '') {
      return { type: 'delimiter' as const, content: token };
    }

    const parsed = Number(token);
    if (Number.isFinite(parsed)) {
      numbers.push(parsed);
      return { type: 'valid' as const, content: token, value: parsed };
    }

    errors += 1;
    return { type: 'error' as const, content: token };
  });

  return { tokens, numbers, errors };
}

export function format(value: number | null, digits = 4): string {
  if (value === null || Number.isNaN(value)) return '-';
  if (!Number.isFinite(value)) return value > 0 ? '∞' : '-∞';
  return value.toLocaleString(undefined, { maximumFractionDigits: digits });
}

export interface DescriptiveStats {
  n: number;
  sum: number;
  sumOfSquares: number;
  mean: number;
  sumOfSquaresFromMean: number;
  sampleVariance: number;
  populationVariance: number;
  sampleStandardDeviation: number;
  populationStandardDeviation: number;
  standardError: number;
}

function requireNonEmpty(values: readonly number[], name: string): void {
  if (values.length === 0) throw new Error(`${name} must not be empty`);
}

export function descriptiveStats(values: readonly number[]): DescriptiveStats {
  requireNonEmpty(values, 'values');
  const n = values.length;
  const total = sum(values);
  const sumOfSquares = values.reduce((acc, value) => acc + value * value, 0);
  const average = total / n;
  const sumOfSquaresFromMean = sumOfSquares - (total * total) / n;
  const sampleVariance = n > 1 ? sumOfSquaresFromMean / (n - 1) : 0;
  const populationVariance = sumOfSquaresFromMean / n;

  return {
    n,
    sum: total,
    sumOfSquares,
    mean: average,
    sumOfSquaresFromMean,
    sampleVariance,
    populationVariance,
    sampleStandardDeviation: Math.sqrt(sampleVariance),
    populationStandardDeviation: Math.sqrt(populationVariance),
    standardError: Math.sqrt(sampleVariance / n),
  };
}

export function calculateSampleSummary(numbers: number[]): { mean: number; sd: number; n: number } | null {
  if (numbers.length === 0) return null;
  const stats = descriptiveStats(numbers);
  return { mean: stats.mean, sd: stats.sampleStandardDeviation, n: stats.n };
}

function getPercentile(sorted: readonly number[], percentile: number): number {
  if (sorted.length === 0) return 0;
  const position = (sorted.length - 1) * percentile;
  const base = Math.floor(position);
  const fraction = position - base;
  if (base < 0) return sorted[0]!;
  if (base >= sorted.length - 1) return sorted[sorted.length - 1]!;
  return sorted[base]! + fraction * (sorted[base + 1]! - sorted[base]!);
}

export function calculateStats(numbers: number[], isPopulation: boolean) {
  if (numbers.length === 0) {
    return {
      count: 0,
      sum: 0,
      sumOfSquares: 0,
      mean: 0,
      median: 0,
      mode: '-',
      min: 0,
      max: 0,
      range: 0,
      q1: 0,
      q3: 0,
      iqr: 0,
      variance: 0,
      stdDev: 0,
      qd: 0,
      mad: 0,
      ss: 0,
      standardError: 0,
    };
  }

  const sorted = [...numbers].sort((a, b) => a - b);
  const stats = descriptiveStats(numbers);
  const n = stats.n;
  const median = n % 2 === 1 ? sorted[Math.floor(n / 2)]! : (sorted[n / 2 - 1]! + sorted[n / 2]!) / 2;
  const q1 = getPercentile(sorted, 0.25);
  const q3 = getPercentile(sorted, 0.75);
  const iqr = q3 - q1;

  const counts = new Map<number, number>();
  for (const number of numbers) {
    const rounded = Math.round(number * 1e8) / 1e8;
    counts.set(rounded, (counts.get(rounded) ?? 0) + 1);
  }
  const maxCount = Math.max(...counts.values());
  const modeValues = Array.from(counts.entries())
    .filter(([, count]) => count === maxCount && count > 1)
    .map(([value]) => value)
    .sort((a, b) => a - b);
  const mode = modeValues.length > 0 ? modeValues.join(', ') : 'No';
  const variance = isPopulation ? stats.populationVariance : stats.sampleVariance;
  const stdDev = Math.sqrt(variance);
  const mad = numbers.reduce((acc, value) => acc + Math.abs(value - stats.mean), 0) / n;

  return {
    count: n,
    sum: stats.sum,
    sumOfSquares: stats.sumOfSquares,
    mean: stats.mean,
    median,
    mode,
    min: sorted[0]!,
    max: sorted[sorted.length - 1]!,
    range: sorted[sorted.length - 1]! - sorted[0]!,
    q1,
    q3,
    iqr,
    variance,
    stdDev,
    qd: iqr / 2,
    mad,
    ss: stats.sumOfSquaresFromMean,
    standardError: stats.standardError,
  };
}

export interface ConfidenceInterval {
  estimate: number;
  marginOfError: number;
  lower: number;
  upper: number;
}

function criticalT(df: number): { t95: number; t99: number } {
  if (df <= 1) return { t95: 12.71, t99: 63.66 };
  if (df === 2) return { t95: 4.3, t99: 9.92 };
  if (df === 3) return { t95: 3.18, t99: 5.84 };
  if (df === 4) return { t95: 2.78, t99: 4.6 };
  if (df === 5) return { t95: 2.57, t99: 4.03 };
  if (df === 6) return { t95: 2.45, t99: 3.71 };
  if (df === 7) return { t95: 2.36, t99: 3.5 };
  if (df === 8) return { t95: 2.31, t99: 3.36 };
  if (df === 9) return { t95: 2.26, t99: 3.25 };
  if (df === 10) return { t95: 2.23, t99: 3.17 };
  if (df <= 12) return { t95: 2.18, t99: 3.05 };
  if (df <= 15) return { t95: 2.13, t99: 2.95 };
  if (df <= 20) return { t95: 2.09, t99: 2.85 };
  if (df <= 30) return { t95: 2.04, t99: 2.75 };
  if (df <= 40) return { t95: 2.02, t99: 2.7 };
  if (df <= 60) return { t95: 2.0, t99: 2.66 };
  if (df <= 84) return { t95: 1.99, t99: 2.64 };
  return { t95: 1.99, t99: 2.63 };
}

function interval(estimate: number, standardError: number, critical: number): ConfidenceInterval {
  const marginOfError = standardError * critical;
  return {
    estimate,
    marginOfError,
    lower: estimate - marginOfError,
    upper: estimate + marginOfError,
  };
}

export function calculateWelchTTest(m1: number, s1: number, n1: number, m2: number, s2: number, n2: number) {
  const v1 = (s1 * s1) / n1;
  const v2 = (s2 * s2) / n2;
  const diff = m1 - m2;
  const se = Math.sqrt(v1 + v2);
  const t = diff / se;
  const df = ((v1 + v2) ** 2) / ((v1 ** 2) / (n1 - 1) + (v2 ** 2) / (n2 - 1));
  const p = tTwoTailedPValue(Math.abs(t), df);
  const critical = criticalT(Math.round(df));
  const ci95 = interval(diff, se, critical.t95);
  const ci99 = interval(diff, se, critical.t99);

  return {
    t,
    df,
    p,
    ciLow: ci95.lower,
    ciHigh: ci95.upper,
    ci95,
    ci99,
  };
}

export function calculateIndependentTTest(sampleA: number[], sampleB: number[]) {
  if (sampleA.length < 2 || sampleB.length < 2) return null;
  const a = descriptiveStats(sampleA);
  const b = descriptiveStats(sampleB);
  const differenceInMeans = a.mean - b.mean;

  const pooledDf = a.n + b.n - 2;
  const pooledVariance = (a.sumOfSquaresFromMean + b.sumOfSquaresFromMean) / pooledDf;
  const pooledSe = Math.sqrt(pooledVariance / a.n + pooledVariance / b.n);
  const pooledT = differenceInMeans / pooledSe;
  const pooledP = tTwoTailedPValue(Math.abs(pooledT), pooledDf);
  const pooledCritical = criticalT(pooledDf);

  const welchSe = Math.sqrt(a.sampleVariance / a.n + b.sampleVariance / b.n);
  const welchT = differenceInMeans / welchSe;
  const welchDf = ((a.sampleVariance / a.n + b.sampleVariance / b.n) ** 2) /
    (((a.sampleVariance / a.n) ** 2) / (a.n - 1) + ((b.sampleVariance / b.n) ** 2) / (b.n - 1));
  const welchP = tTwoTailedPValue(Math.abs(welchT), welchDf);
  const welchCritical = criticalT(Math.round(welchDf));

  const varianceRatio = a.sampleVariance / a.n >= b.sampleVariance / b.n
    ? {
        f: (a.sampleVariance / a.n) / (b.sampleVariance / b.n),
        degreesOfFreedom1: a.n - 1,
        degreesOfFreedom2: b.n - 1,
      }
    : {
        f: (b.sampleVariance / b.n) / (a.sampleVariance / a.n),
        degreesOfFreedom1: b.n - 1,
        degreesOfFreedom2: a.n - 1,
      };

  return {
    sampleA: a,
    sampleB: b,
    differenceInMeans,
    pooled: {
      t: pooledT,
      df: pooledDf,
      p: pooledP,
      ci95: interval(differenceInMeans, pooledSe, pooledCritical.t95),
      ci99: interval(differenceInMeans, pooledSe, pooledCritical.t99),
      standardError: pooledSe,
    },
    welch: {
      t: welchT,
      df: welchDf,
      p: welchP,
      ci95: interval(differenceInMeans, welchSe, welchCritical.t95),
      ci99: interval(differenceInMeans, welchSe, welchCritical.t99),
      standardError: welchSe,
    },
    varianceRatio: {
      ...varianceRatio,
      p: fUpperTailPValue(varianceRatio.f, varianceRatio.degreesOfFreedom1, varianceRatio.degreesOfFreedom2),
    },
  };
}

export function calculatePairedTTest(sampleA: number[], sampleB: number[]) {
  if (sampleA.length === 0 || sampleA.length !== sampleB.length || sampleA.length < 2) return null;
  const differences = sampleA.map((value, index) => value - sampleB[index]!);
  const diffStats = descriptiveStats(differences);
  const df = diffStats.n - 1;
  const se = Math.sqrt(diffStats.sampleVariance / diffStats.n);
  const t = diffStats.mean / se;
  const p = tTwoTailedPValue(Math.abs(t), df);
  const critical = criticalT(df);
  const ci95 = interval(diffStats.mean, se, critical.t95);
  const ci99 = interval(diffStats.mean, se, critical.t99);

  return {
    t,
    df,
    p,
    ciLow: ci95.lower,
    ciHigh: ci95.upper,
    ci95,
    ci99,
    meanDiff: diffStats.mean,
    sdDiff: diffStats.sampleStandardDeviation,
    n: diffStats.n,
  };
}

function rank(values: readonly number[]): number[] {
  const indexed = values.map((value, index) => ({ value, index }));
  indexed.sort((a, b) => a.value - b.value);
  const ranks = new Array<number>(values.length);
  let i = 0;
  while (i < indexed.length) {
    let j = i + 1;
    while (j < indexed.length && indexed[j]!.value === indexed[i]!.value) j += 1;
    const averageRank = (i + 1 + j) / 2;
    for (let k = i; k < j; k += 1) ranks[indexed[k]!.index] = averageRank;
    i = j;
  }
  return ranks;
}

export function calculateMannWhitneyU(sampleA: number[], sampleB: number[]) {
  if (sampleA.length === 0 || sampleB.length === 0) return null;
  const combined = [...sampleA, ...sampleB];
  const ranks = rank(combined);
  const nA = sampleA.length;
  const nB = sampleB.length;
  const rankSumA = ranks.slice(0, nA).reduce((acc, value) => acc + value, 0);
  const rankSumB = ranks.slice(nA).reduce((acc, value) => acc + value, 0);
  const uA = nA * nB + (nA * (nA + 1)) / 2 - rankSumA;
  const uB = nA * nB - uA;
  const meanRankA = rankSumA / nA;
  const meanRankB = rankSumB / nB;

  if (nA <= 4 || nB <= 4) {
    return { uA, uB, z: null, p: null, meanRankA, meanRankB };
  }

  const sortedRanks = [...ranks].sort((a, b) => a - b);
  let tieCorrection = 0;
  let runLength = 1;
  for (let i = 1; i <= sortedRanks.length; i += 1) {
    if (i < sortedRanks.length && sortedRanks[i] === sortedRanks[i - 1]) {
      runLength += 1;
    } else {
      tieCorrection += runLength > 1 ? runLength ** 3 - runLength : 0;
      runLength = 1;
    }
  }

  const totalN = nA + nB;
  const numerator = rankSumA + (rankSumA > (nA * (totalN + 1)) / 2 ? -0.5 : 0.5) - (nA * (totalN + 1)) / 2;
  const baseVariance = (nA * nB * (totalN + 1)) / 12;
  const correctionFactor = 1 - tieCorrection / (totalN * (totalN - 1) * (totalN + 1));
  const z = numerator / Math.sqrt(baseVariance * correctionFactor);
  const p = 2 * (1 - normalCdf(Math.abs(z)));

  return { uA, uB, z, p, meanRankA, meanRankB };
}

export interface TukeyResult {
  groupA: number;
  groupB: number;
  difference: number;
  significantAt05: boolean;
  significantAt01: boolean;
  label05: string;
  pValue: number;
}

function tukeyQApproximation(k: number, critical: number, alpha: 0.05 | 0.01): number {
  if (alpha === 0.05) {
    if (k === 3) return 2.106973 * critical - 0.817944;
    if (k === 4) return 2.59017 * critical - 1.443969;
    if (k === 5) return 2.972018 * critical - 1.96814;
  } else {
    if (k === 3) return 1.946821 * critical - 0.8996111;
    if (k === 4) return 2.303537 * critical - 1.534593;
    if (k === 5) return 2.587002 * critical - 2.064423;
  }
  throw new Error('Vassar-style Tukey approximation only supports k=3..5');
}

export interface AnovaResult {
  fValue: number;
  dfBetween: number;
  dfWithin: number;
  pValue: number;
  ssBetween: number;
  msBetween: number;
  ssWithin?: number;
  msWithin?: number;
  ssSubjects?: number;
  dfSubjects?: number;
  ssError?: number;
  msError?: number;
  groupMeans: number[];
  tukeyResults?: TukeyResult[];
}

export function calculateTukeyHSD(means: number[], sampleSizes: number[], msError: number, dfError: number): TukeyResult[] {
  const k = means.length;
  const harmonicMeanN = k / sampleSizes.reduce((acc, size) => acc + 1 / size, 0);
  const t = criticalT(dfError);
  const hsd05 = tukeyQApproximation(k, t.t95, 0.05) * Math.sqrt(msError / harmonicMeanN);
  const hsd01 = tukeyQApproximation(k, t.t99, 0.01) * Math.sqrt(msError / harmonicMeanN);
  const results: TukeyResult[] = [];

  for (let i = 0; i < k; i += 1) {
    for (let j = i + 1; j < k; j += 1) {
      const difference = means[i]! - means[j]!;
      const absoluteDifference = Math.abs(difference);
      const significantAt01 = absoluteDifference >= hsd01;
      const significantAt05 = absoluteDifference >= hsd05;
      results.push({
        groupA: i,
        groupB: j,
        difference,
        significantAt05,
        significantAt01,
        label05: significantAt01 ? 'P < 0.01' : significantAt05 ? 'P < 0.05' : 'nonsignificant',
        pValue: significantAt01 ? 0.0009 : significantAt05 ? 0.04 : 0.5,
      });
    }
  }

  return results;
}

export function calculateANOVA(samples: number[][]): AnovaResult | null {
  if (samples.length < 2 || samples.length > 5) return null;
  if (samples.some((sample) => sample.length < 2)) return null;

  const counts = samples.map((sample) => sample.length);
  const groupSums = samples.map((sample) => sum(sample));
  const groupMeans = samples.map((sample, index) => groupSums[index]! / sample.length);
  const groupSumSquares = samples.map((sample) => sample.reduce((acc, value) => acc + value * value, 0));

  const totalN = counts.reduce((acc, value) => acc + value, 0);
  const totalSum = groupSums.reduce((acc, value) => acc + value, 0);
  const totalSumSquares = groupSumSquares.reduce((acc, value) => acc + value, 0);
  const ssWithin = samples.reduce((acc, sample, index) => acc + groupSumSquares[index]! - (groupSums[index]! ** 2) / sample.length, 0);
  const ssTotal = totalSumSquares - (totalSum ** 2) / totalN;
  const ssBetween = ssTotal - ssWithin;
  const dfBetween = samples.length - 1;
  const dfWithin = totalN - samples.length;
  const msBetween = ssBetween / dfBetween;
  const msWithin = ssWithin / dfWithin;
  const fValue = msBetween / msWithin;
  const pValue = fUpperTailPValue(fValue, dfBetween, dfWithin);

  return {
    fValue,
    dfBetween,
    dfWithin,
    pValue,
    ssBetween,
    msBetween,
    ssWithin,
    msWithin,
    groupMeans,
    tukeyResults: pValue < 0.05 && samples.length > 2 ? calculateTukeyHSD(groupMeans, counts, msWithin, dfWithin) : undefined,
  };
}

export function calculateRepeatedMeasuresANOVA(samples: number[][]): AnovaResult | null {
  if (samples.length < 2 || samples.length > 5) return null;
  const subjectCount = samples[0]?.length ?? 0;
  if (subjectCount < 2 || samples.some((sample) => sample.length !== subjectCount)) return null;

  const flattened = samples.flat();
  const totalSum = sum(flattened);
  const totalN = flattened.length;
  const totalSumSquares = flattened.reduce((acc, value) => acc + value * value, 0);
  const totalSS = totalSumSquares - (totalSum ** 2) / totalN;
  const groupSums = samples.map((sample) => sum(sample));
  const groupMeans = groupSums.map((groupSum) => groupSum / subjectCount);
  const ssBetween = groupSums.reduce((acc, groupSum) => acc + (groupSum ** 2) / subjectCount, 0) - (totalSum ** 2) / totalN;

  const subjectSums = Array.from({ length: subjectCount }, (_, index) => samples.reduce((acc, sample) => acc + sample[index]!, 0));
  const ssSubjects = subjectSums.reduce((acc, subjectSum) => acc + (subjectSum ** 2) / samples.length, 0) - (totalSum ** 2) / totalN;
  const ssError = totalSS - ssBetween - ssSubjects;
  const dfBetween = samples.length - 1;
  const dfSubjects = subjectCount - 1;
  const dfError = (samples.length - 1) * (subjectCount - 1);
  const msBetween = ssBetween / dfBetween;
  const msError = ssError / dfError;
  const fValue = msBetween / msError;
  const pValue = fUpperTailPValue(fValue, dfBetween, dfError);

  return {
    fValue,
    dfBetween,
    dfWithin: dfError,
    pValue,
    ssBetween,
    msBetween,
    ssSubjects,
    dfSubjects,
    ssError,
    msError,
    groupMeans,
    tukeyResults: pValue < 0.05 && samples.length > 2 ? calculateTukeyHSD(groupMeans, samples.map((sample) => sample.length), msError, dfError) : undefined,
  };
}

export interface KruskalWallisResult {
  h: number;
  df: number;
  p: number;
  meanRanks: number[];
}

export function calculateKruskalWallis(samples: number[][]): KruskalWallisResult | null {
  if (samples.length < 3 || samples.length > 5) return null;
  if (samples.some((sample) => sample.length === 0)) return null;
  const flattened = samples.flat();
  const ranks = rank(flattened);
  let offset = 0;
  const rankSums = samples.map((sample) => {
    const chunk = ranks.slice(offset, offset + sample.length);
    offset += sample.length;
    return sum(chunk);
  });
  const totalN = flattened.length;
  const h = (12 / (totalN * (totalN + 1))) * rankSums.reduce((acc, rankSum, index) => acc + (rankSum ** 2) / samples[index]!.length, 0) - 3 * (totalN + 1);
  const df = samples.length - 1;
  const p = chiSquareUpperTailPValue(h, df);
  return {
    h,
    df,
    p,
    meanRanks: rankSums.map((rankSum, index) => rankSum / samples[index]!.length),
  };
}

export interface ChiSquareGoodnessResult {
  chiSquare: number;
  uncorrectedChiSquare: number;
  df: number;
  pValue: number;
  expected: number[];
  standardizedResiduals: number[];
  percentageDeviations: number[];
}

export function calculateChiSquareGoodnessOfFit(observed: number[], options: { expected?: number[]; proportions?: number[] }): ChiSquareGoodnessResult | null {
  if (observed.length < 2 || observed.length > 8) return null;
  const total = sum(observed);
  const expected = options.expected ? [...options.expected] : options.proportions?.map((proportion) => proportion * total);
  if (!expected || expected.length !== observed.length) return null;
  const df = observed.length - 1;
  const uncorrectedChiSquare = observed.reduce((acc, value, index) => acc + ((value - expected[index]!) ** 2) / expected[index]!, 0);
  const chiSquare = df === 1
    ? observed.reduce((acc, value, index) => {
        const difference = Math.max(0, Math.abs(value - expected[index]!) - 0.5);
        return acc + (difference ** 2) / expected[index]!;
      }, 0)
    : uncorrectedChiSquare;

  return {
    chiSquare,
    uncorrectedChiSquare,
    df,
    pValue: chiSquareUpperTailPValue(chiSquare, df),
    expected,
    standardizedResiduals: observed.map((value, index) => (value - expected[index]!) / Math.sqrt(expected[index]!)),
    percentageDeviations: observed.map((value, index) => ((value - expected[index]!) / expected[index]!) * 100),
  };
}

export interface ChiSquareAssociationResult {
  chiSquare: number;
  uncorrectedChiSquare: number;
  df: number;
  pValue: number;
  cramerV: number;
  expected: number[][];
  standardizedResiduals: number[][];
  percentageDeviations: number[][];
}

export function calculateChiSquareAssociation(table: number[][]): ChiSquareAssociationResult | null {
  const rows = table.length;
  const cols = table[0]?.length ?? 0;
  if (rows < 2 || rows > 5 || cols < 2 || cols > 5) return null;
  if (table.some((row) => row.length !== cols)) return null;

  const rowTotals = table.map((row) => sum(row));
  const colTotals = Array.from({ length: cols }, (_, colIndex) => table.reduce((acc, row) => acc + row[colIndex]!, 0));
  const total = sum(rowTotals);
  const expected = table.map((row, rowIndex) => row.map((_, colIndex) => (rowTotals[rowIndex]! * colTotals[colIndex]!) / total));
  const df = (rows - 1) * (cols - 1);
  const uncorrectedChiSquare = table.reduce(
    (rowAcc, row, rowIndex) => rowAcc + row.reduce((cellAcc, value, colIndex) => cellAcc + ((value - expected[rowIndex]![colIndex]!) ** 2) / expected[rowIndex]![colIndex]!, 0),
    0,
  );
  const chiSquare = df === 1
    ? table.reduce(
        (rowAcc, row, rowIndex) => rowAcc + row.reduce((cellAcc, value, colIndex) => {
          const difference = Math.max(0, Math.abs(value - expected[rowIndex]![colIndex]!) - 0.5);
          return cellAcc + (difference ** 2) / expected[rowIndex]![colIndex]!;
        }, 0),
        0,
      )
    : uncorrectedChiSquare;

  return {
    chiSquare,
    uncorrectedChiSquare,
    df,
    pValue: chiSquareUpperTailPValue(chiSquare, df),
    cramerV: Math.sqrt(chiSquare / (total * (Math.min(rows, cols) - 1))),
    expected,
    standardizedResiduals: table.map((row, rowIndex) => row.map((value, colIndex) => (value - expected[rowIndex]![colIndex]!) / Math.sqrt(expected[rowIndex]![colIndex]!))),
    percentageDeviations: table.map((row, rowIndex) => row.map((value, colIndex) => ((value - expected[rowIndex]![colIndex]!) / expected[rowIndex]![colIndex]!) * 100)),
  };
}

export interface PearsonResult {
  n: number;
  r: number;
  rSquared: number;
  slope: number;
  intercept: number;
  standardErrorOfEstimate: number;
  t: number;
  df: number;
  p: number;
  residuals: number[];
  xStats: DescriptiveStats;
  yStats: DescriptiveStats;
}

export function calculatePearsonCorrelation(x: number[], y: number[]): PearsonResult | null {
  if (x.length !== y.length || x.length < 3) return null;
  const xStats = descriptiveStats(x);
  const yStats = descriptiveStats(y);
  const n = x.length;
  const sumXY = x.reduce((acc, value, index) => acc + value * y[index]!, 0);
  const ssXY = sumXY - (xStats.sum * yStats.sum) / n;
  const r = ssXY / Math.sqrt(xStats.sumOfSquaresFromMean * yStats.sumOfSquaresFromMean);
  const slope = ssXY / xStats.sumOfSquaresFromMean;
  const intercept = yStats.mean - slope * xStats.mean;
  const residuals = x.map((value, index) => y[index]! - (intercept + slope * value));
  const standardErrorOfEstimate = Math.sqrt((yStats.sumOfSquaresFromMean * (1 - r * r)) / (n - 2));
  const df = n - 2;
  const t = r * Math.sqrt(df / (1 - r * r));
  const p = tTwoTailedPValue(Math.abs(t), df);

  return {
    n,
    r,
    rSquared: r * r,
    slope,
    intercept,
    standardErrorOfEstimate,
    t,
    df,
    p,
    residuals,
    xStats,
    yStats,
  };
}

export interface SpearmanResult {
  n: number;
  rs: number;
  t: number;
  df: number;
  p: number | null;
  xRanks: number[];
  yRanks: number[];
}

export function calculateSpearmanRankCorrelation(x: number[], y: number[]): SpearmanResult | null {
  if (x.length !== y.length || x.length < 3) return null;
  const xRanks = rank(x);
  const yRanks = rank(y);
  const pearson = calculatePearsonCorrelation(xRanks, yRanks);
  if (!pearson) return null;
  return {
    n: x.length,
    rs: pearson.r,
    t: pearson.t,
    df: pearson.df,
    p: x.length < 10 ? null : pearson.p,
    xRanks,
    yRanks,
  };
}

export function formatTukeyP(label: TukeyResult['label05']): string {
  return label;
}

export function calculateModel2Regression(x: number[], y: number[]) {
  if (x.length !== y.length || x.length < 2) return null;
  const xStats = descriptiveStats(x);
  const yStats = descriptiveStats(y);
  const pearson = calculatePearsonCorrelation(x, y);
  if (!pearson) return null;
  const sign = Math.sign(pearson.r) || 1;
  const slope = sign * (yStats.sampleStandardDeviation / xStats.sampleStandardDeviation);
  const intercept = mean(y) - slope * mean(x);
  return { slope, intercept };
}
