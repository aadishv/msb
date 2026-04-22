import { createEffect, createMemo, createSignal, For } from 'solid-js';
import HighlightedTextareaCard from './HighlightedTextareaCard';
import { StatResult } from './StatResult';
import { calculateANOVA, calculateRepeatedMeasuresANOVA, calculateSampleSummary, format, parseNumberInput } from '~/lib/stats';
import { getStoredValue, setStoredValue } from '~/lib/storage';

interface SampleData { id: string; value: string; }
const makeId = () => Math.random().toString(36).slice(2, 10);

export default function AnovaCalculator() {
  const fallback = [
    { id: makeId(), value: '4.8\n5.1\n5.4\n5.0\n4.9\n5.3' },
    { id: makeId(), value: '6.2\n6.0\n6.5\n6.1\n6.4\n6.3' },
    { id: makeId(), value: '7.1\n7.5\n7.2\n7.4\n7.0\n7.3' },
  ] satisfies SampleData[];

  const [samples, setSamples] = createSignal<SampleData[]>(getStoredValue('stats.anova.samples', fallback));
  const [paired, setPaired] = createSignal(getStoredValue('stats.anova.paired', false));

  createEffect(() => setStoredValue('stats.anova.samples', samples()));
  createEffect(() => setStoredValue('stats.anova.paired', paired()));

  const parsed = createMemo(() => samples().map((sample) => {
    const parsedValue = parseNumberInput(sample.value);
    return { ...sample, parsed: parsedValue, summary: calculateSampleSummary(parsedValue.numbers) };
  }));

  const results = createMemo(() => {
    if (parsed().some((sample) => sample.parsed.errors > 0)) return null;
    const groups = parsed().map((sample) => sample.parsed.numbers).filter((group) => group.length > 0);
    return paired() ? calculateRepeatedMeasuresANOVA(groups) : calculateANOVA(groups);
  });

  const addSample = () => setSamples([...samples(), { id: makeId(), value: '' }]);
  const removeSample = (id: string) => { if (samples().length > 2) setSamples(samples().filter((s) => s.id !== id)); };
  const updateSample = (id: string, value: string) => setSamples(samples().map((s) => (s.id === id ? { ...s, value } : s)));

  return (
    <div class="max-w-5xl w-full flex flex-col gap-3">
      <div class="flex border border-[#E0E0E0] w-fit">
        <button onClick={() => setPaired(false)} class={`px-3 py-1 text-[11px] font-mono transition-colors ${!paired() ? 'bg-[#111] text-white' : 'text-[#888] hover:bg-[#F5F5F5]'}`}>Independent</button>
        <button onClick={() => setPaired(true)} class={`px-3 py-1 text-[11px] font-mono transition-colors border-l border-[#E0E0E0] ${paired() ? 'bg-[#111] text-white' : 'text-[#888] hover:bg-[#F5F5F5]'}`}>Correlated</button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 items-start">
        <div class="border border-[#E0E0E0]">
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#E0E0E0]">
            <For each={parsed()}>
              {(sample, index) => (
                <HighlightedTextareaCard
                  title={`Sample ${index() + 1}`}
                  value={sample.value}
                  onInput={(value) => updateSample(sample.id, value)}
                  parsed={sample.parsed}
                  summary={sample.summary ? `n=${sample.summary.n} · x̄=${format(sample.summary.mean)}` : '-'}
                  onRemove={() => removeSample(sample.id)}
                  canRemove={samples().length > 2}
                />
              )}
            </For>
          </div>
          <div class="p-3 border-t border-[#E0E0E0]">
            <button onClick={addSample} class="text-[11px] font-mono text-[#888] border border-[#E0E0E0] px-3 py-1 hover:bg-[#F5F5F5] transition-colors">+ Add sample</button>
          </div>
        </div>

        <div class="border border-[#E0E0E0] p-4">
          {!results() ? (
            <span class="text-[11px] text-[#AAA] font-mono">{paired() ? 'Enter equally-sized samples (n ≥ 2).' : 'Enter at least two valid samples.'}</span>
          ) : (
            <div>
              <StatResult label="F" value={format(results()!.fValue)} showBorder />
              <StatResult label="df treatment" value={results()!.dfBetween} showBorder />
              <StatResult label="df error" value={results()!.dfWithin} showBorder />
              <StatResult label="P" value={results()!.pValue < 0.0001 ? '< 0.0001' : format(results()!.pValue)} showBorder />
              <StatResult label="SS between" value={format(results()!.ssBetween)} showBorder />
              <StatResult label={paired() ? 'MS error' : 'MS within'} value={format(paired() ? results()!.msError ?? null : results()!.msWithin ?? null)} showBorder={!!results()!.tukeyResults?.length} />
              {results()!.tukeyResults && results()!.tukeyResults!.length > 0 && (
                <div class="mt-3 pt-2 border-t border-[#F0F0F0]">
                  <div class="text-[9px] font-mono text-[#BBB] uppercase tracking-wider mb-2">Tukey HSD</div>
                  <For each={results()!.tukeyResults}>
                    {(comparison) => <StatResult label={`S${comparison.groupA + 1} vs S${comparison.groupB + 1}`} value={comparison.label05} showBorder />}
                  </For>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
