import { createEffect, createMemo, createSignal, For } from 'solid-js';
import HighlightedTextareaCard from './HighlightedTextareaCard';
import { StatResult } from './StatResult';
import { calculateKruskalWallis, format, parseNumberInput } from '~/lib/stats';
import { getStoredValue, setStoredValue } from '~/lib/storage';

interface SampleData {
  id: string;
  value: string;
}

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
  const removeSample = (id: string) => {
    if (samples().length <= 3) return;
    setSamples(samples().filter((sample) => sample.id !== id));
  };
  const updateSample = (id: string, value: string) => {
    setSamples(samples().map((sample) => (sample.id === id ? { ...sample, value } : sample)));
  };

  return (
    <div class="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-[1fr_384px] gap-6 items-stretch">
      <div class="bg-white rounded-2xl shadow-sm border border-[#E6E4DD] overflow-hidden">
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#E6E4DD]">
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
        <div class="p-4 bg-[#F9F9F8] flex justify-center border-t border-[#E6E4DD]">
          <button onClick={addSample} class="px-4 py-2 bg-white border border-[#D1CFCA] rounded-xl text-sm font-serif text-[#2D2D2D] hover:bg-[#F5F4EF] transition-colors shadow-sm">Add sample</button>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-[#E6E4DD] p-6 flex flex-col justify-center">
        {!results() ? (
          <div class="text-center text-[#8A847A] font-serif py-12">Enter 3–5 valid samples to see results.</div>
        ) : (
          <div class="space-y-4">
            <StatResult label="H-statistic" value={format(results()!.h)} showBorder />
            <StatResult label="df" value={results()!.df} showBorder />
            <StatResult label="P value" value={results()!.p < 0.0001 ? '< 0.0001' : format(results()!.p)} showBorder />
            <div class="pt-4 border-t border-[#E6E4DD] space-y-3">
              <div class="text-[10px] font-bold text-[#8A847A] uppercase tracking-[0.1em] font-sans">Mean ranks</div>
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
