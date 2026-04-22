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

  const taStyle = 'width:100%;min-height:120px;padding:0;background:transparent;resize:none;border:none;outline:none;font-family:var(--font-mono);font-size:0.875rem;line-height:1.625;color:var(--fg)';

  return (
    <div class="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12">
      <div class="flex flex-col gap-4">
        <div>
          <div class="text-xs mb-2" style="color:var(--muted)">Observed counts</div>
          <textarea style={taStyle} value={observedText()} onInput={(e) => setObservedText(e.currentTarget.value)} placeholder="one per line" spellcheck={false} />
        </div>
        <div class="flex gap-4">
          <button onClick={() => setExpectedMode('proportions')} class="text-sm transition-colors" style={expectedMode() === 'proportions' ? 'color:var(--nav-active)' : 'color:var(--nav-inactive)'}>Proportions</button>
          <button onClick={() => setExpectedMode('expected')} class="text-sm transition-colors" style={expectedMode() === 'expected' ? 'color:var(--nav-active)' : 'color:var(--nav-inactive)'}>Frequencies</button>
        </div>
        <div>
          <div class="text-xs mb-2" style="color:var(--muted)">{expectedMode() === 'expected' ? 'Expected counts' : 'Expected proportions'}</div>
          <textarea style={taStyle} value={expectedMode() === 'expected' ? expectedText() : proportionText()} onInput={(e) => expectedMode() === 'expected' ? setExpectedText(e.currentTarget.value) : setProportionText(e.currentTarget.value)} placeholder="one per line" spellcheck={false} />
        </div>
      </div>
      <div class="flex flex-col">
        {!result() ? (
          <span class="text-sm" style="color:var(--muted)">Enter observed and expected values.</span>
        ) : (
          <>
            <StatResult label="χ²" value={format(result()!.chiSquare)} />
            <StatResult label="χ² uncorrected" value={format(result()!.uncorrectedChiSquare)} />
            <StatResult label="df" value={result()!.df} />
            <StatResult label="P" value={result()!.pValue < 0.0001 ? '< 0.0001' : format(result()!.pValue)} />
            <StatResult label="Expected total" value={format(result()!.expected.reduce((a, v) => a + v, 0))} />
          </>
        )}
      </div>
    </div>
  );
}
