import { createEffect, createMemo, createSignal } from 'solid-js';
import HighlightedTextareaCard from './HighlightedTextareaCard';
import { StatResult } from './StatResult';
import { calculateSpearmanRankCorrelation, format, parseNumberInput } from '~/lib/stats';
import { getStoredValue, setStoredValue } from '~/lib/storage';

export default function SpearmanCalculator() {
  const [xText, setXText] = createSignal(getStoredValue('stats.spearman.x', '12\n18\n25\n31\n44\n52'));
  const [yText, setYText] = createSignal(getStoredValue('stats.spearman.y', '7\n10\n15\n13\n24\n29'));
  createEffect(() => setStoredValue('stats.spearman.x', xText()));
  createEffect(() => setStoredValue('stats.spearman.y', yText()));

  const x = createMemo(() => parseNumberInput(xText()));
  const y = createMemo(() => parseNumberInput(yText()));
  const result = createMemo(() => {
    if (x().errors > 0 || y().errors > 0) return null;
    return calculateSpearmanRankCorrelation(x().numbers, y().numbers);
  });

  return (
    <div class="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-[1fr_384px] gap-6 items-stretch">
      <div class="bg-white rounded-2xl shadow-sm border border-[#E6E4DD] overflow-hidden grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#E6E4DD]">
        <HighlightedTextareaCard title="X values" value={xText()} onInput={setXText} parsed={x()} summary={`n=${x().numbers.length}`} />
        <HighlightedTextareaCard title="Y values" value={yText()} onInput={setYText} parsed={y()} summary={`n=${y().numbers.length}`} />
      </div>
      <div class="bg-white rounded-2xl shadow-sm border border-[#E6E4DD] p-6 flex flex-col justify-center">
        {!result() ? (
          <div class="text-center text-[#8A847A] font-serif py-12">Enter paired valid values with n ≥ 3.</div>
        ) : (
          <div class="space-y-4">
            <StatResult label="Spearman rₛ" value={format(result()!.rs)} showBorder />
            <StatResult label="n" value={result()!.n} showBorder />
            <StatResult label="df" value={format(result()!.df)} showBorder />
            <StatResult label="t approximation" value={format(result()!.t)} showBorder />
            <StatResult label="Two-tailed P" value={result()!.p === null ? 'Use critical-value table (n < 10)' : result()!.p < 0.0001 ? '< 0.0001' : format(result()!.p)} />
          </div>
        )}
      </div>
    </div>
  );
}
