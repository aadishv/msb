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
    <div class="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12">
      <div class="grid grid-cols-2 gap-8">
        <HighlightedTextareaCard title="Sample A" value={raw1()} onInput={setRaw1} parsed={parsed1()} summary={summary1() ? `n=${summary1()!.n} · x̄=${format(summary1()!.mean)}` : '-'} />
        <HighlightedTextareaCard title="Sample B" value={raw2()} onInput={setRaw2} parsed={parsed2()} summary={summary2() ? `n=${summary2()!.n} · x̄=${format(summary2()!.mean)}` : '-'} />
      </div>
      <div class="flex flex-col">
        {!results() ? (
          <span class="text-sm" style="color:var(--muted)">Enter valid data in both samples.</span>
        ) : (
          <>
            <StatResult label="Mean diff" value={format(results()!.differenceInMeans)} />
            <StatResult label="t" value={format(results()!.welch.t)} />
            <StatResult label="df" value={format(results()!.welch.df)} />
            <StatResult label="P" value={results()!.welch.p < 0.0001 ? '< 0.0001' : format(results()!.welch.p)} />
            <StatResult label="95% CI" value={`[${format(results()!.welch.ci95.lower)}, ${format(results()!.welch.ci95.upper)}]`} />
            <StatResult label="F variance ratio" value={`${format(results()!.varianceRatio.f)} (p ${results()!.varianceRatio.p < 0.0001 ? '< 0.0001' : format(results()!.varianceRatio.p)})`} />
          </>
        )}
      </div>
    </div>
  );
}
