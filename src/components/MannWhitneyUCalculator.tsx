import { createEffect, createMemo, createSignal } from 'solid-js';
import HighlightedTextareaCard from './HighlightedTextareaCard';
import { StatResult } from './StatResult';
import { calculateMannWhitneyU, format, parseNumberInput } from '~/lib/stats';
import { getStoredValue, setStoredValue } from '~/lib/storage';

export default function MannWhitneyUCalculator() {
  const [raw1, setRaw1] = createSignal(getStoredValue('stats.mannwhitney.sample1.raw', '21\n23\n24\n26\n27\n29'));
  const [raw2, setRaw2] = createSignal(getStoredValue('stats.mannwhitney.sample2.raw', '12\n14\n16\n18\n20\n22'));

  createEffect(() => setStoredValue('stats.mannwhitney.sample1.raw', raw1()));
  createEffect(() => setStoredValue('stats.mannwhitney.sample2.raw', raw2()));

  const parsed1 = createMemo(() => parseNumberInput(raw1()));
  const parsed2 = createMemo(() => parseNumberInput(raw2()));
  const results = createMemo(() => {
    if (parsed1().errors > 0 || parsed2().errors > 0) return null;
    return calculateMannWhitneyU(parsed1().numbers, parsed2().numbers);
  });

  return (
    <div class="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-[1fr_384px] gap-6 items-stretch">
      <div class="bg-white rounded-2xl shadow-sm border border-[#E6E4DD] overflow-hidden grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#E6E4DD]">
        <HighlightedTextareaCard title="Sample A" value={raw1()} onInput={setRaw1} parsed={parsed1()} summary={`n=${parsed1().numbers.length}`} />
        <HighlightedTextareaCard title="Sample B" value={raw2()} onInput={setRaw2} parsed={parsed2()} summary={`n=${parsed2().numbers.length}`} />
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-[#E6E4DD] p-6 flex flex-col justify-center">
        {!results() ? (
          <div class="text-center text-[#8A847A] font-serif py-12">Enter valid data in both samples.</div>
        ) : (
          <div class="space-y-4">
            <StatResult label="Uₐ" value={format(results()!.uA)} showBorder />
            <StatResult label="Uᵦ" value={format(results()!.uB)} showBorder />
            <StatResult label="Mean rank A" value={format(results()!.meanRankA)} showBorder />
            <StatResult label="Mean rank B" value={format(results()!.meanRankB)} showBorder />
            <StatResult label="z-score" value={results()!.z === null ? '-' : format(results()!.z)} showBorder />
            <StatResult label="Two-tailed P" value={results()!.p === null ? 'Use critical-value table' : results()!.p < 0.0001 ? '< 0.0001' : format(results()!.p)} />
          </div>
        )}
      </div>
    </div>
  );
}
