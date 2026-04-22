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

  const parsed = createMemo(() => samples().map((sample) => ({ ...sample, parsed: parseNumberInput(sample.value) })));
  const results = createMemo(() => {
    if (parsed().some((sample) => sample.parsed.errors > 0)) return null;
    return calculateKruskalWallis(parsed().map((sample) => sample.parsed.numbers).filter((group) => group.length > 0));
  });

  const addSample = () => setSamples([...samples(), { id: makeId(), value: '' }]);
  const removeSample = (id: string) => { if (samples().length > 3) setSamples(samples().filter((s) => s.id !== id)); };
  const updateSample = (id: string, value: string) => setSamples(samples().map((s) => (s.id === id ? { ...s, value } : s)));

  return (
    <div class="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 items-start">
      <div class="border border-[#E0E0E0]">
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#E0E0E0]">
          <For each={parsed()}>
            {(sample, index) => (
              <HighlightedTextareaCard
                title={`Sample ${index() + 1}`}
                value={sample.value}
                onInput={(value) => updateSample(sample.id, value)}
                parsed={sample.parsed}
                summary={`n=${sample.parsed.numbers.length}`}
                onRemove={() => removeSample(sample.id)}
                canRemove={samples().length > 3}
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
          <span class="text-[11px] text-[#AAA] font-mono">Enter 3–5 valid samples.</span>
        ) : (
          <div>
            <StatResult label="H" value={format(results()!.h)} showBorder />
            <StatResult label="df" value={results()!.df} showBorder />
            <StatResult label="P" value={results()!.p < 0.0001 ? '< 0.0001' : format(results()!.p)} showBorder />
            <div class="mt-3 pt-2 border-t border-[#F0F0F0]">
              <div class="text-[9px] font-mono text-[#BBB] uppercase tracking-wider mb-2">Mean ranks</div>
              <For each={results()!.meanRanks}>
                {(value, index) => <StatResult label={`Sample ${index() + 1}`} value={format(value)} showBorder />}
              </For>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
