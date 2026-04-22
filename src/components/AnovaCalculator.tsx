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

  const parsed = createMemo(() => samples().map((s) => {
    const p = parseNumberInput(s.value);
    return { ...s, parsed: p, summary: calculateSampleSummary(p.numbers) };
  }));

  const results = createMemo(() => {
    if (parsed().some((s) => s.parsed.errors > 0)) return null;
    const groups = parsed().map((s) => s.parsed.numbers).filter((g) => g.length > 0);
    return paired() ? calculateRepeatedMeasuresANOVA(groups) : calculateANOVA(groups);
  });

  const addSample = () => setSamples([...samples(), { id: makeId(), value: '' }]);
  const removeSample = (id: string) => { if (samples().length > 2) setSamples(samples().filter((s) => s.id !== id)); };
  const updateSample = (id: string, value: string) => setSamples(samples().map((s) => (s.id === id ? { ...s, value } : s)));

  return (
    <div class="flex flex-col gap-6">
      <div class="flex gap-4">
        <button onClick={() => setPaired(false)} class="text-sm transition-colors" style={!paired() ? 'color:var(--nav-active)' : 'color:var(--nav-inactive)'}>Independent</button>
        <button onClick={() => setPaired(true)} class="text-sm transition-colors" style={paired() ? 'color:var(--nav-active)' : 'color:var(--nav-inactive)'}>Correlated</button>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12">
        <div class="flex flex-col gap-6">
          <div class="grid gap-8" style={`grid-template-columns: repeat(${Math.min(samples().length, 3)}, 1fr)`}>
            <For each={parsed()}>
              {(sample, index) => (
                <HighlightedTextareaCard
                  title={`Sample ${index() + 1}`}
                  value={sample.value}
                  onInput={(v) => updateSample(sample.id, v)}
                  parsed={sample.parsed}
                  summary={sample.summary ? `n=${sample.summary.n} · x̄=${format(sample.summary.mean)}` : '-'}
                  onRemove={() => removeSample(sample.id)}
                  canRemove={samples().length > 2}
                />
              )}
            </For>
          </div>
          <button onClick={addSample} class="text-sm text-left transition-colors" style="color:var(--muted)">+ add sample</button>
        </div>
        <div class="flex flex-col">
          {!results() ? (
            <span class="text-sm" style="color:var(--muted)">{paired() ? 'Enter equally-sized samples (n ≥ 2).' : 'Enter at least two valid samples.'}</span>
          ) : (
            <>
              <StatResult label="F" value={format(results()!.fValue)} />
              <StatResult label="df treatment" value={results()!.dfBetween} />
              <StatResult label="df error" value={results()!.dfWithin} />
              <StatResult label="P" value={results()!.pValue < 0.0001 ? '< 0.0001' : format(results()!.pValue)} />
              <StatResult label="SS between" value={format(results()!.ssBetween)} />
              <StatResult label={paired() ? 'MS error' : 'MS within'} value={format(paired() ? results()!.msError ?? null : results()!.msWithin ?? null)} />
              {results()!.tukeyResults && results()!.tukeyResults!.length > 0 && (
                <>
                  <span class="text-xs mt-4 mb-2" style="color:var(--muted)">Tukey HSD</span>
                  <For each={results()!.tukeyResults}>
                    {(c) => <StatResult label={`S${c.groupA + 1} vs S${c.groupB + 1}`} value={c.label05} />}
                  </For>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
