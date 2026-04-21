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
    <div class="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-[1fr_384px] gap-6 items-stretch">
      <div class="bg-white rounded-2xl shadow-sm border border-[#E6E4DD] overflow-hidden grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#E6E4DD]">
        <HighlightedTextareaCard title="X values" value={xText()} onInput={setXText} parsed={x()} summary={`n=${x().numbers.length}`} />
        <HighlightedTextareaCard title="Y values" value={yText()} onInput={setYText} parsed={y()} summary={`n=${y().numbers.length}`} />
      </div>
      <div class="bg-white rounded-2xl shadow-sm border border-[#E6E4DD] p-6 flex flex-col justify-center">
        {!pearson() ? (
          <div class="text-center text-[#8A847A] font-serif py-12">Enter paired valid values with n ≥ 3.</div>
        ) : (
          <div class="space-y-4">
            <StatResult label="Pearson r" value={format(pearson()!.r)} showBorder />
            <StatResult label="r²" value={format(pearson()!.rSquared)} showBorder />
            <StatResult label="Two-tailed P" value={pearson()!.p < 0.0001 ? '< 0.0001' : format(pearson()!.p)} showBorder />
            <StatResult label="OLS slope" value={format(pearson()!.slope)} showBorder />
            <StatResult label="OLS intercept" value={format(pearson()!.intercept)} showBorder />
            <StatResult label="Model 2 slope" value={model2() ? format(model2()!.slope) : '-'} showBorder />
            <StatResult label="Model 2 intercept" value={model2() ? format(model2()!.intercept) : '-'} />
          </div>
        )}
      </div>
    </div>
  );
}
