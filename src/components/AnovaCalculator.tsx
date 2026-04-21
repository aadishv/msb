import { createEffect, createMemo, createSignal, For } from 'solid-js';
import HighlightedTextareaCard from './HighlightedTextareaCard';
import { StatResult } from './StatResult';
import {
  calculateANOVA,
  calculateRepeatedMeasuresANOVA,
  calculateSampleSummary,
  format,
  parseNumberInput,
} from '~/lib/stats';
import { getStoredValue, setStoredValue } from '~/lib/storage';

interface SampleData {
  id: string;
  value: string;
}

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
  const removeSample = (id: string) => {
    if (samples().length <= 2) return;
    setSamples(samples().filter((sample) => sample.id !== id));
  };
  const updateSample = (id: string, value: string) => {
    setSamples(samples().map((sample) => (sample.id === id ? { ...sample, value } : sample)));
  };

  return (
    <div class="max-w-6xl w-full flex flex-col gap-4">
      <div class="flex p-1 bg-[#E6E4DD] rounded-xl border border-[#D1CFCA] w-fit">
        <button onClick={() => setPaired(false)} class={`px-4 py-1.5 text-sm font-serif rounded-lg transition-all ${!paired() ? 'bg-white text-[#2D2D2D] shadow-sm' : 'text-[#6B6255]'}`}>Independent samples</button>
        <button onClick={() => setPaired(true)} class={`px-4 py-1.5 text-sm font-serif rounded-lg transition-all ${paired() ? 'bg-white text-[#2D2D2D] shadow-sm' : 'text-[#6B6255]'}`}>Correlated samples</button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-[1fr_384px] gap-6 items-stretch">
        <div class="bg-white rounded-2xl shadow-sm border border-[#E6E4DD] overflow-hidden">
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#E6E4DD]">
            <For each={parsed()}>
              {(sample, index) => (
                <HighlightedTextareaCard
                  title={`Sample ${index() + 1}`}
                  value={sample.value}
                  onInput={(value) => updateSample(sample.id, value)}
                  parsed={sample.parsed}
                  summary={sample.summary ? `n=${sample.summary.n} · mean=${format(sample.summary.mean)} · sd=${format(sample.summary.sd)}` : '-'}
                  onRemove={() => removeSample(sample.id)}
                  canRemove={samples().length > 2}
                />
              )}
            </For>
          </div>
          <div class="p-4 bg-[#F9F9F8] flex justify-center border-t border-[#E6E4DD]">
            <button onClick={addSample} class="px-4 py-2 bg-white border border-[#D1CFCA] rounded-xl text-sm font-serif text-[#2D2D2D] hover:bg-[#F5F4EF] transition-colors shadow-sm">Add sample</button>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-[#E6E4DD] p-6 flex flex-col justify-center">
          {!results() ? (
            <div class="text-center text-[#8A847A] font-serif py-12">
              {paired() ? 'Enter valid equally-sized samples (n ≥ 2).' : 'Enter at least two valid samples with n ≥ 2.'}
            </div>
          ) : (
            <div class="space-y-4">
              <StatResult label="F-statistic" value={format(results()!.fValue)} showBorder />
              <StatResult label="Treatment df" value={results()!.dfBetween} showBorder />
              <StatResult label="Error df" value={results()!.dfWithin} showBorder />
              <StatResult label="P value" value={results()!.pValue < 0.0001 ? '< 0.0001' : format(results()!.pValue)} showBorder />
              <StatResult label="SS between" value={format(results()!.ssBetween)} showBorder />
              <StatResult label={paired() ? 'MS error' : 'MS within'} value={format(paired() ? results()!.msError ?? null : results()!.msWithin ?? null)} />

              {results()!.tukeyResults && results()!.tukeyResults!.length > 0 && (
                <div class="pt-4 border-t border-[#E6E4DD] space-y-3">
                  <div class="text-[10px] font-bold text-[#8A847A] uppercase tracking-[0.1em] font-sans">Tukey HSD</div>
                  <For each={results()!.tukeyResults}>
                    {(comparison) => (
                      <StatResult
                        label={`S${comparison.groupA + 1} vs S${comparison.groupB + 1}`}
                        value={comparison.label05}
                        showBorder
                      />
                    )}
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
