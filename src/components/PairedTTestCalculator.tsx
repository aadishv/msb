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
    <div class="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12">
      <div class="grid grid-cols-2 gap-8">
        <HighlightedTextareaCard title="Sample A" value={raw1()} onInput={setRaw1} parsed={parsed1()} summary={`n=${parsed1().numbers.length}`} />
        <HighlightedTextareaCard title="Sample B" value={raw2()} onInput={setRaw2} parsed={parsed2()} summary={`n=${parsed2().numbers.length}`} />
      </div>
      <div class="flex flex-col">
        {!results() ? (
          <span class="text-sm" style="color:var(--muted)">
            {parsed1().numbers.length !== parsed2().numbers.length && parsed1().numbers.length > 0 && parsed2().numbers.length > 0
              ? 'Samples must be equal size.'
              : 'Enter at least two valid paired values.'}
          </span>
        ) : (
          <>
            <StatResult label="Mean diff" value={format(results()!.meanDiff)} />
            <StatResult label="SD of diffs" value={format(results()!.sdDiff)} />
            <StatResult label="t" value={format(results()!.t)} />
            <StatResult label="df" value={format(results()!.df)} />
            <StatResult label="P" value={results()!.p < 0.0001 ? '< 0.0001' : format(results()!.p)} />
            <StatResult label="95% CI" value={`[${format(results()!.ci95.lower)}, ${format(results()!.ci95.upper)}]`} />
          </>
        )}
      </div>
    </div>
  );
}
