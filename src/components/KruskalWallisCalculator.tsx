import { createEffect, createMemo, createSignal, For } from 'solid-js';
import HighlightedTextareaCard from './HighlightedTextareaCard';
import { StatResult } from './StatResult';
import { calculateKruskalWallis, format, parseNumberInput } from '~/lib/stats';
import { getStoredValue, setStoredValue } from '~/lib/storage';

interface SampleData { id: string; value: string; }
const makeId = () => Math.random().toString(36).slice(2, 10);

export default function KruskalWallisCalculator() {
  const fallback = [
    { id: makeId(), value: '11\n13\n15\n17\n19' },
    { id: makeId(), value: '22\n24\n26\n28\n30' },
    { id: makeId(), value: '33\n35\n37\n39\n41' },
  ] satisfies SampleData[];

  const [samples, setSamples] = createSignal<SampleData[]>(getStoredValue('stats.kruskal.samples', fallback));
  createEffect(() => setStoredValue('stats.kruskal.samples', samples()));

  const parsed = createMemo(() => samples().map((s) => ({ ...s, parsed: parseNumberInput(s.value) })));
  const results = createMemo(() => {
    if (parsed().some((s) => s.parsed.errors > 0)) return null;
    return calculateKruskalWallis(parsed().map((s) => s.parsed.numbers).filter((g) => g.length > 0));
  });

  const addSample = () => setSamples([...samples(), { id: makeId(), value: '' }]);
  const removeSample = (id: string) => { if (samples().length > 3) setSamples(samples().filter((s) => s.id !== id)); };
  const updateSample = (id: string, value: string) => setSamples(samples().map((s) => (s.id === id ? { ...s, value } : s)));

  return (
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
                summary={`n=${sample.parsed.numbers.length}`}
                onRemove={() => removeSample(sample.id)}
                canRemove={samples().length > 3}
              />
            )}
          </For>
        </div>
        <button onClick={addSample} class="text-sm text-left transition-colors" style="color:var(--muted)">+ add sample</button>
      </div>
      <div class="flex flex-col">
        {!results() ? (
          <span class="text-sm" style="color:var(--muted)">Enter 3–5 valid samples.</span>
        ) : (
          <>
            <StatResult label="H" value={format(results()!.h)} />
            <StatResult label="df" value={results()!.df} />
            <StatResult label="P" value={results()!.p < 0.0001 ? '< 0.0001' : format(results()!.p)} />
            <span class="text-xs mt-4 mb-2" style="color:var(--muted)">Mean ranks</span>
            <For each={results()!.meanRanks}>
              {(value, index) => <StatResult label={`Sample ${index() + 1}`} value={format(value)} />}
            </For>
          </>
        )}
      </div>
    </div>
  );
}
