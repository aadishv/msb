import jStat from 'jstat';

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
    const isNum = !isNaN(parsed) && isFinite(parsed);

    if (isNum) {
      numbers.push(parsed);
      return { type: 'valid' as const, content: token, value: parsed };
    }

    errors += 1;
    return { type: 'error' as const, content: token };
  });

  return { tokens, numbers, errors };
}

export function calculateSampleSummary(numbers: number[]) {
  const n = numbers.length;
  if (n === 0) return null;
  const mean = numbers.reduce((acc, value) => acc + value, 0) / n;
  if (n === 1) return { mean, sd: NaN, n };
  const variance = numbers.reduce((acc, value) => acc + Math.pow(value - mean, 2), 0) / (n - 1);
  return { mean, sd: Math.sqrt(variance), n };
}

export function format(n: number | null) {
  if (n === null || isNaN(n)) return '-';
  return n.toLocaleString(undefined, { maximumFractionDigits: 4 });
}

export function formatTukeyP(p: number): string {
  if (p >= 0.05) return 'insignificant';
  if (p < 0.001) return '< 0.001';
  if (p < 0.01) return '< 0.01';
  return '< 0.05';
}

export function calculateWelchTTest(
  m1: number, s1: number, n1: number,
  m2: number, s2: number, n2: number
) {
  const v1 = s1 * s1;
  const v2 = s2 * s2;
  const diff = m1 - m2;
  const se = Math.sqrt(v1 / n1 + v2 / n2);

  const t = diff / se;

  const df = Math.pow(v1 / n1 + v2 / n2, 2) / 
             (Math.pow(v1 / n1, 2) / (n1 - 1) + Math.pow(v2 / n2, 2) / (n2 - 1));

  const cdf = isFinite(t) && isFinite(df) && df > 0
    ? jStat.studentt.cdf(Math.abs(t), df)
    : NaN;
  const p = isNaN(cdf) ? NaN : Math.max(0, Math.min(1, 2 * (1 - cdf)));

  const tCritical = isFinite(df) && df > 0
    ? jStat.studentt.inv(0.975, df)
    : NaN;

  const marginOfError = tCritical * se;
  const ciLow = diff - marginOfError;
  const ciHigh = diff + marginOfError;

  return { t, df, p, ciLow, ciHigh };
}

export function calculateMannWhitneyU(sampleA: number[], sampleB: number[]) {
  const nA = sampleA.length;
  const nB = sampleB.length;
  if (nA === 0 || nB === 0) return null;

  const combined = [
    ...sampleA.map(v => ({ value: v, group: 'A' as const })),
    ...sampleB.map(v => ({ value: v, group: 'B' as const }))
  ].sort((a, b) => a.value - b.value);

  const ranks = new Array(combined.length);
  let i = 0;
  while (i < combined.length) {
    let j = i;
    while (j < combined.length && combined[j].value === combined[i].value) {
      j++;
    }
    const rank = (i + 1 + j) / 2;
    for (let k = i; k < j; k++) {
      ranks[k] = rank;
    }
    i = j;
  }

  let sumRanksA = 0;
  for (let k = 0; k < combined.length; k++) {
    if (combined[k].group === 'A') {
      sumRanksA += ranks[k];
    }
  }

  const uA_calc = sumRanksA - (nA * (nA + 1)) / 2;
  const uB_calc = nA * nB - uA_calc;
  const uSmallest = Math.min(uA_calc, uB_calc);

  const meanU = (nA * nB) / 2;
  const N = nA + nB;

  // Tie correction
  const tieCounts = new Map<number, number>();
  combined.forEach(item => {
    tieCounts.set(item.value, (tieCounts.get(item.value) || 0) + 1);
  });

  let tieSum = 0;
  for (const count of tieCounts.values()) {
    if (count > 1) {
      tieSum += Math.pow(count, 3) - count;
    }
  }

  const sigmaU = Math.sqrt((nA * nB * (N + 1)) / 12);
  let sigmaCorr = sigmaU;
  if (tieSum > 0 && N > 1) {
    sigmaCorr = Math.sqrt(
      (nA * nB / (N * (N - 1))) * ((Math.pow(N, 3) - N) / 12 - tieSum / 12)
    );
  }

  const z = sigmaCorr === 0 ? 0 : (Math.abs(uSmallest - meanU) - 0.5) / sigmaCorr;
  const p = 2 * (1 - jStat.normal.cdf(Math.abs(z), 0, 1));

  return { uA: uSmallest, uB: Math.max(uA_calc, uB_calc), z, p };
}

export function calculatePairedTTest(sampleA: number[], sampleB: number[]) {
  const n = sampleA.length;
  if (n === 0 || n !== sampleB.length) return null;

  const differences = sampleA.map((val, i) => val - sampleB[i]);
  const sumDiff = differences.reduce((acc, val) => acc + val, 0);
  const meanDiff = sumDiff / n;

  const sumSquaredDiff = differences.reduce((acc, val) => acc + Math.pow(val - meanDiff, 2), 0);
  const varianceDiff = sumSquaredDiff / (n - 1);
  const sdDiff = Math.sqrt(varianceDiff);

  const se = sdDiff / Math.sqrt(n);
  const t = se === 0 ? 0 : meanDiff / se;
  const df = n - 1;

  const cdf = isFinite(t) && isFinite(df) && df > 0
    ? jStat.studentt.cdf(Math.abs(t), df)
    : NaN;
  const p = isNaN(cdf) ? NaN : Math.max(0, Math.min(1, 2 * (1 - cdf)));

  const tCritical = isFinite(df) && df > 0
    ? jStat.studentt.inv(0.975, df)
    : NaN;

  const marginOfError = tCritical * se;
  const ciLow = meanDiff - marginOfError;
  const ciHigh = meanDiff + marginOfError;

  return { t, df, p, ciLow, ciHigh, meanDiff, sdDiff, n };
}

export function calculateStats(numbers: number[], isPopulation: boolean) {
  if (numbers.length === 0) {
    return { count: 0, mean: 0, median: 0, mode: '-', min: 0, max: 0, range: 0, q1: 0, q3: 0, iqr: 0, variance: 0, stdDev: 0, qd: 0, mad: 0 };
  }

  const n = numbers.length;
  const sorted = [...numbers].sort((a, b) => a - b);
  const sum = sorted.reduce((a, b) => a + b, 0);
  const mean = sum / n;
  
  const mid = Math.floor(n / 2);
  const median = n % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

  const counts = new Map<number, number>();
  let maxCount = 0;
  numbers.forEach(num => {
    const rounded = Math.round(num * 1e8) / 1e8;
    const c = (counts.get(rounded) || 0) + 1;
    counts.set(rounded, c);
    if (c > maxCount) maxCount = c;
  });
  let mode: string | number = '-';
  if (maxCount > 1) {
    const modes = Array.from(counts.entries())
      .filter(([_, count]) => count === maxCount)
      .map(([val]) => val)
      .sort((a, b) => a - b);
    mode = modes.length === numbers.length ? 'No' : modes.join(', ');
  } else {
    mode = 'No';
  }

  const min = sorted[0];
  const max = sorted[n - 1];
  const range = max - min;

  const getQuartile = (arr: number[], q: number) => {
    const pos = (arr.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (arr[base + 1] !== undefined) {
      return arr[base] + rest * (arr[base + 1] - arr[base]);
    } else {
      return arr[base];
    }
  };

  const q1 = getQuartile(sorted, 0.25);
  const q3 = getQuartile(sorted, 0.75);
  const iqr = q3 - q1;
  const qd = iqr / 2;

  const squaredDiffs = numbers.map(x => Math.pow(x - mean, 2));
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / (isPopulation ? n : Math.max(1, n - 1));
  const stdDev = Math.sqrt(variance);

  const mad = numbers.reduce((a, b) => a + Math.abs(b - mean), 0) / n;

  return {
    count: n,
    mean,
    median,
    mode,
    min,
    max,
    range,
    q1,
    q3,
    iqr,
    variance,
    stdDev,
    qd,
    mad
  };
}

export function calculateANOVA(samples: number[][]): AnovaResult | null {
  const k = samples.length;
  if (k < 2) return null;

  const groupCounts = samples.map(s => s.length);
  const totalN = groupCounts.reduce((a, b) => a + b, 0);
  
  // Need at least one value in each group and totalN > k
  if (groupCounts.some(n => n === 0) || totalN <= k) return null;

  const allNumbers = samples.flat();
  const grandMean = allNumbers.reduce((a, b) => a + b, 0) / totalN;

  const groupMeans = samples.map(s => s.reduce((a, b) => a + b, 0) / s.length);

  // Between-group sum of squares (SSTR)
  let ssBetween = 0;
  for (let i = 0; i < k; i++) {
    ssBetween += groupCounts[i] * Math.pow(groupMeans[i] - grandMean, 2);
  }

  // Within-group sum of squares (SSE)
  let ssWithin = 0;
  for (let i = 0; i < k; i++) {
    for (let j = 0; j < samples[i].length; j++) {
      ssWithin += Math.pow(samples[i][j] - groupMeans[i], 2);
    }
  }

  const dfBetween = k - 1;
  const dfWithin = totalN - k;

  const msBetween = ssBetween / dfBetween;
  const msWithin = ssWithin / dfWithin;

  const fValue = msWithin === 0 ? (msBetween === 0 ? 0 : Infinity) : msBetween / msWithin;

  const pValue = 1 - jStat.centralF.cdf(fValue, dfBetween, dfWithin);

  const result: AnovaResult = {
    fValue,
    dfBetween,
    dfWithin,
    pValue,
    ssBetween,
    ssWithin,
    msBetween,
    msWithin
  };

  if (pValue < 0.05) {
    result.tukeyResults = calculateTukeyHSD(groupMeans, groupCounts, msWithin, dfWithin);
  }

  return result;
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
  tukeyResults?: TukeyResult[];
}

export interface TukeyResult {
  groupA: number;
  groupB: number;
  difference: number;
  pValue: number;
}

export function calculateTukeyHSD(
  means: number[],
  ns: number[],
  msError: number,
  dfError: number
): TukeyResult[] {
  const k = means.length;
  const results: TukeyResult[] = [];

  for (let i = 0; i < k; i++) {
    for (let j = i + 1; j < k; j++) {
      const diff = Math.abs(means[i] - means[j]);
      // Tukey-Kramer adjustment for unequal sample sizes: SE = sqrt(MS_error / 2 * (1/ni + 1/nj))
      const se = Math.sqrt((msError / 2) * (1 / ns[i] + 1 / ns[j]));
      const q = diff / se;
      
      // jStat.qtest(q, n, k) uses n-k as degrees of freedom. 
      // To use dfError, we pass n = dfError + k.
      const pValue = jStat.qtest(q, dfError + k, k);
      results.push({
        groupA: i,
        groupB: j,
        difference: means[i] - means[j],
        pValue
      });
    }
  }
  return results;
}

export function calculateRepeatedMeasuresANOVA(samples: number[][]): AnovaResult | null {
  const k = samples.length;
  if (k < 2) return null;

  const n = samples[0].length;
  if (n < 2) return null;

  if (samples.some(s => s.length !== n)) return null;

  const totalN = k * n;
  const allNumbers = samples.flat();
  const grandMean = allNumbers.reduce((a, b) => a + b, 0) / totalN;

  const ssTotal = allNumbers.reduce((acc, val) => acc + Math.pow(val - grandMean, 2), 0);

  const groupMeans = samples.map(s => s.reduce((a, b) => a + b, 0) / n);
  const ssBetween = n * groupMeans.reduce((acc, mean) => acc + Math.pow(mean - grandMean, 2), 0);

  const subjectMeans = [];
  for (let i = 0; i < n; i++) {
    let sum = 0;
    for (let j = 0; j < k; j++) {
      sum += samples[j][i];
    }
    subjectMeans.push(sum / k);
  }
  const ssSubjects = k * subjectMeans.reduce((acc, mean) => acc + Math.pow(mean - grandMean, 2), 0);

  const ssError = ssTotal - ssBetween - ssSubjects;

  const dfBetween = k - 1;
  const dfSubjects = n - 1;
  const dfError = (k - 1) * (n - 1);

  const msBetween = ssBetween / dfBetween;
  const msError = ssError / dfError;

  const fValue = msError === 0 ? (msBetween === 0 ? 0 : Infinity) : msBetween / msError;
  const pValue = 1 - jStat.centralF.cdf(fValue, dfBetween, dfError);

  const result: AnovaResult = {
    fValue,
    dfBetween,
    dfSubjects,
    dfWithin: dfError, // Use dfWithin consistently for display if possible
    pValue,
    ssBetween,
    ssSubjects,
    ssError,
    msBetween,
    msError
  };

  if (pValue < 0.05) {
    const groupCounts = samples.map(s => s.length);
    result.tukeyResults = calculateTukeyHSD(groupMeans, groupCounts, msError, dfError);
  }

  return result;
}
