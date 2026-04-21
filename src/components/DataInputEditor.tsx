import { createEffect, createMemo, createSignal } from 'solid-js';
import HighlightedTextareaCard from './HighlightedTextareaCard';
import { StatResult } from './StatResult';
import { calculateStats, format, parseNumberInput } from '~/lib/stats';
import { getStoredValue, setStoredValue } from '~/lib/storage';

export default function DataInputEditor() {
  const [value, setValue] = createSignal(getStoredValue('stats.general.data', '12.4\n11.8\n14.1\n10.9\n13.7\n15.2'));
  const [isPopulation, setIsPopulation] = createSignal(getStoredValue('stats.general.population', false));

  createEffect(() => setStoredValue('stats.general.data', value()));
  createEffect(() => setStoredValue('stats.general.population', isPopulation()));

  const parsed = createMemo(() => parseNumberInput(value()));
  const stats = createMemo(() => calculateStats(parsed().numbers, isPopulation()));

  return (
    <div class="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-[1fr_384px] gap-x-6 gap-y-4 items-stretch">
      <div class="col-start-1">
        <div class="flex p-1 bg-[#E6E4DD] rounded-xl border border-[#D1CFCA] w-fit">
          <button
            onClick={() => setIsPopulation(false)}
            class={`px-4 py-1.5 text-sm font-serif rounded-lg transition-all ${!isPopulation() ? 'bg-white text-[#2D2D2D] shadow-sm' : 'text-[#6B6255] hover:text-[#393939]'}`}
          >
            Sample
          </button>
          <button
            onClick={() => setIsPopulation(true)}
            class={`px-4 py-1.5 text-sm font-serif rounded-lg transition-all ${isPopulation() ? 'bg-white text-[#2D2D2D] shadow-sm' : 'text-[#6B6255] hover:text-[#393939]'}`}
          >
            Population
          </button>
        </div>
      </div>
      <div class="hidden lg:block" />

      <div class="bg-white rounded-2xl shadow-sm border border-[#E6E4DD] overflow-hidden">
        <HighlightedTextareaCard
          title="Dataset"
          value={value()}
          onInput={setValue}
          parsed={parsed()}
          summary={`n=${stats().count} · mean=${format(stats().mean)} · sd=${format(stats().stdDev)}`}
        />
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-[#E6E4DD] p-6 flex flex-col justify-center">
        <div class="space-y-3.5">
          <StatResult label="Count" value={stats().count} showBorder />
          <StatResult label={isPopulation() ? 'Population mean (μ)' : 'Sample mean (x̄)'} value={format(stats().mean)} showBorder />
          <StatResult label="ΣX" value={format(stats().sum)} showBorder />
          <StatResult label="ΣX²" value={format(stats().sumOfSquares)} showBorder />
          <StatResult label="SS" value={format(stats().ss)} showBorder />
          <StatResult label="Median" value={format(stats().median)} showBorder />
          <StatResult label="Mode" value={stats().mode} showBorder />
          <StatResult label="Q1" value={format(stats().q1)} showBorder />
          <StatResult label="Q3" value={format(stats().q3)} showBorder />
          <StatResult label="IQR" value={format(stats().iqr)} showBorder />
          <StatResult label={isPopulation() ? 'Population variance (σ²)' : 'Sample variance (s²)'} value={format(stats().variance)} showBorder />
          <StatResult label={isPopulation() ? 'Population SD (σ)' : 'Sample SD (s)'} value={format(stats().stdDev)} showBorder />
          <StatResult label="Standard error" value={isPopulation() ? '-' : format(stats().standardError)} showBorder />
          <StatResult label="Mean absolute deviation" value={format(stats().mad)} showBorder />
        </div>
      </div>
    </div>
  );
}
