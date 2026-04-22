import { createEffect, createMemo, createSignal } from 'solid-js';
import { StatResult } from './StatResult';
import HighlightedTextareaCard from './HighlightedTextareaCard';
import { calculateIndependentTTest, calculateSampleSummary, format, parseNumberInput } from '~/lib/stats';
import { getStoredValue, setStoredValue } from '~/lib/storage';

export default function WelchTTestCalculator() {
  const [raw1, setRaw1] = createSignal(getStoredValue('stats.ttest.sample1.raw', '9.2\n10.1\n8.8\n11.5\n9.9\n10.8'));
  const [raw2, setRaw2] = createSignal(getStoredValue('stats.ttest.sample2.raw', '12.3\n11.8\n13.1\n12.7\n11.4\n12.9'));

  createEffect(() => setStoredValue('stats.ttest.sample1.raw', raw1()));
  createEffect(() => setStoredValue('stats.ttest.sample2.raw', raw2()));

  const parsed1 = createMemo(() => parseNumberInput(raw1()));
  const parsed2 = createMemo(() => parseNumberInput(raw2()));
  const summary1 = createMemo(() => calculateSampleSummary(parsed1().numbers));
  const summary2 = createMemo(() => calculateSampleSummary(parsed2().numbers));
  const results = createMemo(() => {
    if (parsed1().errors > 0 || parsed2().errors > 0) return null;
    return calculateIndependentTTest(parsed1().numbers, parsed2().numbers);
  });

  return (
    <div class="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 items-start">
      <div class="border border-[#E0E0E0] grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#E0E0E0]">
        <HighlightedTextareaCard title="Sample A" value={raw1()} onInput={setRaw1} parsed={parsed1()} summary={summary1() ? `n=${summary1()!.n} · x̄=${format(summary1()!.mean)} · s=${format(summary1()!.sd)}` : '-'} />
        <HighlightedTextareaCard title="Sample B" value={raw2()} onInput={setRaw2} parsed={parsed2()} summary={summary2() ? `n=${summary2()!.n} · x̄=${format(summary2()!.mean)} · s=${format(summary2()!.sd)}` : '-'} />
      </div>

      <div class="border border-[#E0E0E0] p-4">
        {!results() ? (
          <span class="text-[11px] text-[#AAA] font-mono">Enter valid data in both samples.</span>
        ) : (
          <div>
            <div class="text-[9px] font-mono text-[#BBB] uppercase tracking-wider mb-2">Equal variances</div>
            <StatResult label="Mean diff" value={format(results()!.differenceInMeans)} showBorder />
            <StatResult label="t" value={format(results()!.pooled.t)} showBorder />
            <StatResult label="df" value={format(results()!.pooled.df)} showBorder />
            <StatResult label="P (two-tailed)" value={results()!.pooled.p < 0.0001 ? '< 0.0001' : format(results()!.pooled.p)} showBorder />
            <StatResult label="95% CI" value={`[${format(results()!.pooled.ci95.lower)}, ${format(results()!.pooled.ci95.upper)}]`} showBorder />

            <div class="text-[9px] font-mono text-[#BBB] uppercase tracking-wider mt-4 mb-2">Welch (unequal variances)</div>
            <StatResult label="t" value={format(results()!.welch.t)} showBorder />
            <StatResult label="df" value={format(results()!.welch.df)} showBorder />
            <StatResult label="P (two-tailed)" value={results()!.welch.p < 0.0001 ? '< 0.0001' : format(results()!.welch.p)} showBorder />
            <StatResult label="95% CI" value={`[${format(results()!.welch.ci95.lower)}, ${format(results()!.welch.ci95.upper)}]`} showBorder />
            <StatResult label="F variance ratio" value={`${format(results()!.varianceRatio.f)} (p ${results()!.varianceRatio.p < 0.0001 ? '< 0.0001' : format(results()!.varianceRatio.p)})`} />
          </div>
        )}
      </div>
    </div>
  );
}
