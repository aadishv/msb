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

  const taClass = 'w-full min-h-[140px] p-2 border border-[#E0E0E0] resize-none font-mono text-sm outline-none focus:border-[#AAA] transition-colors';

  return (
    <div class="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 items-start">
      <div class="flex flex-col gap-3">
        <textarea class={taClass} value={observedText()} onInput={(e) => setObservedText(e.currentTarget.value)} placeholder="Observed counts, one per line" />
        <div class="flex border border-[#E0E0E0] w-fit">
          <button onClick={() => setExpectedMode('proportions')} class={`px-3 py-1 text-[11px] font-mono transition-colors ${expectedMode() === 'proportions' ? 'bg-[#111] text-white' : 'text-[#888] hover:bg-[#F5F5F5]'}`}>Proportions</button>
          <button onClick={() => setExpectedMode('expected')} class={`px-3 py-1 text-[11px] font-mono transition-colors border-l border-[#E0E0E0] ${expectedMode() === 'expected' ? 'bg-[#111] text-white' : 'text-[#888] hover:bg-[#F5F5F5]'}`}>Frequencies</button>
        </div>
        <textarea class={taClass} value={expectedMode() === 'expected' ? expectedText() : proportionText()} onInput={(e) => expectedMode() === 'expected' ? setExpectedText(e.currentTarget.value) : setProportionText(e.currentTarget.value)} placeholder={expectedMode() === 'expected' ? 'Expected counts' : 'Expected proportions'} />
      </div>

      <div class="border border-[#E0E0E0] p-4">
        {!result() ? (
          <span class="text-[11px] text-[#AAA] font-mono">Enter observed and expected values.</span>
        ) : (
          <div>
            <StatResult label="χ²" value={format(result()!.chiSquare)} showBorder />
            <StatResult label="χ² uncorrected" value={format(result()!.uncorrectedChiSquare)} showBorder />
            <StatResult label="df" value={result()!.df} showBorder />
            <StatResult label="P" value={result()!.pValue < 0.0001 ? '< 0.0001' : format(result()!.pValue)} showBorder />
            <StatResult label="Expected total" value={format(result()!.expected.reduce((a, v) => a + v, 0))} />
          </div>
        )}
      </div>
    </div>
  );
}
