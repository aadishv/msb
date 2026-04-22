import { createEffect, createMemo, createSignal } from 'solid-js';
import HighlightedTextareaCard from './HighlightedTextareaCard';
import { StatResult } from './StatResult';
import { calculatePairedTTest, format, parseNumberInput } from '~/lib/stats';
import { getStoredValue, setStoredValue } from '~/lib/storage';

export default function PairedTTestCalculator() {
  const [raw1, setRaw1] = createSignal(getStoredValue('stats.paired.sample1.raw', '42.1\n40.8\n39.7\n44.2\n41.3\n43.5'));
  const [raw2, setRaw2] = createSignal(getStoredValue('stats.paired.sample2.raw', '40.1\n39.4\n38.8\n42.6\n40.2\n41.7'));

  createEffect(() => setStoredValue('stats.paired.sample1.raw', raw1()));
  createEffect(() => setStoredValue('stats.paired.sample2.raw', raw2()));

  const parsed1 = createMemo(() => parseNumberInput(raw1()));
  const parsed2 = createMemo(() => parseNumberInput(raw2()));
  const results = createMemo(() => {
    if (parsed1().errors > 0 || parsed2().errors > 0) return null;
    return calculatePairedTTest(parsed1().numbers, parsed2().numbers);
  });

  return (
    <div class="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 items-start">
      <div class="border border-[#E0E0E0] grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#E0E0E0]">
        <HighlightedTextareaCard title="Sample A" value={raw1()} onInput={setRaw1} parsed={parsed1()} summary={`n=${parsed1().numbers.length}`} />
        <HighlightedTextareaCard title="Sample B" value={raw2()} onInput={setRaw2} parsed={parsed2()} summary={`n=${parsed2().numbers.length}`} />
      </div>

      <div class="border border-[#E0E0E0] p-4">
        {!results() ? (
          <span class="text-[11px] text-[#AAA] font-mono">
            {parsed1().numbers.length !== parsed2().numbers.length && parsed1().numbers.length > 0 && parsed2().numbers.length > 0
              ? 'Samples must be equal size.'
              : 'Enter at least two valid paired values.'}
          </span>
        ) : (
          <div>
            <StatResult label="Mean diff" value={format(results()!.meanDiff)} showBorder />
            <StatResult label="SD of diffs" value={format(results()!.sdDiff)} showBorder />
            <StatResult label="t" value={format(results()!.t)} showBorder />
            <StatResult label="df" value={format(results()!.df)} showBorder />
            <StatResult label="P (two-tailed)" value={results()!.p < 0.0001 ? '< 0.0001' : format(results()!.p)} showBorder />
            <StatResult label="95% CI" value={`[${format(results()!.ci95.lower)}, ${format(results()!.ci95.upper)}]`} />
          </div>
        )}
      </div>
    </div>
  );
}
