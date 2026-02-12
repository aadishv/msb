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
