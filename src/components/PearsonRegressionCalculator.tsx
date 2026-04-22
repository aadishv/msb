import { createEffect, createMemo, createSignal } from 'solid-js';
import HighlightedTextareaCard from './HighlightedTextareaCard';
import { StatResult } from './StatResult';
import { calculateModel2Regression, calculatePearsonCorrelation, format, parseNumberInput } from '~/lib/stats';
import { getStoredValue, setStoredValue } from '~/lib/storage';

export default function PearsonRegressionCalculator() {
  const [xText, setXText] = createSignal(getStoredValue('stats.pearson.x', '2\n4\n6\n8\n10\n12'));
  const [yText, setYText] = createSignal(getStoredValue('stats.pearson.y', '3.1\n4.8\n6.2\n7.9\n9.7\n11.3'));
  createEffect(() => setStoredValue('stats.pearson.x', xText()));
  createEffect(() => setStoredValue('stats.pearson.y', yText()));

  const x = createMemo(() => parseNumberInput(xText()));
  const y = createMemo(() => parseNumberInput(yText()));
  const pearson = createMemo(() => {
    if (x().errors > 0 || y().errors > 0) return null;
    return calculatePearsonCorrelation(x().numbers, y().numbers);
  });
  const model2 = createMemo(() => {
    if (x().errors > 0 || y().errors > 0) return null;
    return calculateModel2Regression(x().numbers, y().numbers);
  });

  return (
    <div class="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12">
      <div class="grid grid-cols-2 gap-8">
        <HighlightedTextareaCard title="X values" value={xText()} onInput={setXText} parsed={x()} summary={`n=${x().numbers.length}`} />
        <HighlightedTextareaCard title="Y values" value={yText()} onInput={setYText} parsed={y()} summary={`n=${y().numbers.length}`} />
      </div>
      <div class="flex flex-col">
        {!pearson() ? (
          <span class="text-sm" style="color:var(--muted)">Enter paired values with n ≥ 3.</span>
        ) : (
          <>
            <StatResult label="r" value={format(pearson()!.r)} />
            <StatResult label="r²" value={format(pearson()!.rSquared)} />
            <StatResult label="P" value={pearson()!.p < 0.0001 ? '< 0.0001' : format(pearson()!.p)} />
            <StatResult label="SLRA slope" value={format(pearson()!.slope)} />
            <StatResult label="SLRA intercept" value={format(pearson()!.intercept)} />
            <StatResult label="Model 2 slope" value={model2() ? format(model2()!.slope) : '-'} />
            <StatResult label="Model 2 intercept" value={model2() ? format(model2()!.intercept) : '-'} />
          </>
        )}
      </div>
    </div>
  );
}
