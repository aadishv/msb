import { createEffect, createMemo, createSignal } from 'solid-js';
import { StatResult } from './StatResult';
import { calculateChiSquareGoodnessOfFit, format, parseNumberInput } from '~/lib/stats';
import { getStoredValue, setStoredValue } from '~/lib/storage';

export default function ChiSquareGoodnessCalculator() {
  const [observedText, setObservedText] = createSignal(getStoredValue('stats.chi_gof.observed', '18\n26\n31\n25'));
  const [expectedMode, setExpectedMode] = createSignal<'expected' | 'proportions'>(getStoredValue('stats.chi_gof.mode', 'proportions'));
  const [expectedText, setExpectedText] = createSignal(getStoredValue('stats.chi_gof.expected', '20\n30\n30\n20'));
  const [proportionText, setProportionText] = createSignal(getStoredValue('stats.chi_gof.proportions', '0.2\n0.3\n0.3\n0.2'));

  createEffect(() => setStoredValue('stats.chi_gof.observed', observedText()));
  createEffect(() => setStoredValue('stats.chi_gof.mode', expectedMode()));
  createEffect(() => setStoredValue('stats.chi_gof.expected', expectedText()));
  createEffect(() => setStoredValue('stats.chi_gof.proportions', proportionText()));

  const observed = createMemo(() => parseNumberInput(observedText()));
  const expected = createMemo(() => parseNumberInput(expectedText()));
  const proportions = createMemo(() => parseNumberInput(proportionText()));

  const result = createMemo(() => {
    if (observed().errors > 0) return null;
    if (expectedMode() === 'expected') {
      if (expected().errors > 0) return null;
      return calculateChiSquareGoodnessOfFit(observed().numbers, { expected: expected().numbers });
    }
    if (proportions().errors > 0) return null;
    return calculateChiSquareGoodnessOfFit(observed().numbers, { proportions: proportions().numbers });
  });

  const textareaClass = 'w-full min-h-[220px] p-4 bg-white rounded-2xl shadow-sm border border-[#E6E4DD] resize-none font-mono text-sm outline-none';

  return (
    <div class="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-[1fr_384px] gap-6 items-stretch">
      <div class="space-y-4">
        <textarea class={textareaClass} value={observedText()} onInput={(event) => setObservedText(event.currentTarget.value)} placeholder="Observed counts, one per line" />
        <div class="flex p-1 bg-[#E6E4DD] rounded-xl border border-[#D1CFCA] w-fit">
          <button onClick={() => setExpectedMode('proportions')} class={`px-4 py-1.5 text-sm font-serif rounded-lg transition-all ${expectedMode() === 'proportions' ? 'bg-white text-[#2D2D2D] shadow-sm' : 'text-[#6B6255]'}`}>Expected proportions</button>
          <button onClick={() => setExpectedMode('expected')} class={`px-4 py-1.5 text-sm font-serif rounded-lg transition-all ${expectedMode() === 'expected' ? 'bg-white text-[#2D2D2D] shadow-sm' : 'text-[#6B6255]'}`}>Expected frequencies</button>
        </div>
        <textarea class={textareaClass} value={expectedMode() === 'expected' ? expectedText() : proportionText()} onInput={(event) => expectedMode() === 'expected' ? setExpectedText(event.currentTarget.value) : setProportionText(event.currentTarget.value)} placeholder={expectedMode() === 'expected' ? 'Expected counts' : 'Expected proportions'} />
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-[#E6E4DD] p-6 flex flex-col justify-center">
        {!result() ? (
          <div class="text-center text-[#8A847A] font-serif py-12">Enter 2–8 valid observed values and matching expected values.</div>
        ) : (
          <div class="space-y-4">
            <StatResult label="Chi-square" value={format(result()!.chiSquare)} showBorder />
            <StatResult label="Uncorrected χ²" value={format(result()!.uncorrectedChiSquare)} showBorder />
            <StatResult label="df" value={result()!.df} showBorder />
            <StatResult label="P value" value={result()!.pValue < 0.0001 ? '< 0.0001' : format(result()!.pValue)} showBorder />
            <StatResult label="Expected total" value={format(result()!.expected.reduce((acc, value) => acc + value, 0))} />
          </div>
        )}
      </div>
    </div>
  );
}
