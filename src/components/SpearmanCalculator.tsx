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
    <div class="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12">
      <div class="grid grid-cols-2 gap-8">
        <HighlightedTextareaCard title="X values" value={xText()} onInput={setXText} parsed={x()} summary={`n=${x().numbers.length}`} />
        <HighlightedTextareaCard title="Y values" value={yText()} onInput={setYText} parsed={y()} summary={`n=${y().numbers.length}`} />
      </div>
      <div class="flex flex-col">
        {!result() ? (
          <span class="text-sm" style="color:var(--muted)">Enter paired values with n ≥ 3.</span>
        ) : (
          <>
            <StatResult label="rₛ" value={format(result()!.rs)} />
            <StatResult label="n" value={result()!.n} />
            <StatResult label="df" value={format(result()!.df)} />
            <StatResult label="t" value={format(result()!.t)} />
            <StatResult label="P" value={result()!.p === null ? 'Use table (n < 10)' : result()!.p < 0.0001 ? '< 0.0001' : format(result()!.p)} />
          </>
        )}
      </div>
    </div>
  );
}
