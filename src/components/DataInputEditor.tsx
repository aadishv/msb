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
    <div class="max-w-5xl w-full flex flex-col gap-3">
      <div class="flex border border-[#E0E0E0] w-fit">
        <button onClick={() => setIsPopulation(false)} class={`px-3 py-1 text-[11px] font-mono transition-colors ${!isPopulation() ? 'bg-[#111] text-white' : 'text-[#888] hover:bg-[#F5F5F5]'}`}>Sample</button>
        <button onClick={() => setIsPopulation(true)} class={`px-3 py-1 text-[11px] font-mono transition-colors border-l border-[#E0E0E0] ${isPopulation() ? 'bg-[#111] text-white' : 'text-[#888] hover:bg-[#F5F5F5]'}`}>Population</button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 items-start">
        <div class="border border-[#E0E0E0]">
          <HighlightedTextareaCard
            title="Dataset"
            value={value()}
            onInput={setValue}
            parsed={parsed()}
            summary={`n=${stats().count} · mean=${format(stats().mean)} · sd=${format(stats().stdDev)}`}
          />
        </div>

        <div class="border border-[#E0E0E0] p-4">
          <StatResult label="Count" value={stats().count} showBorder />
          <StatResult label={isPopulation() ? 'μ' : 'x̄'} value={format(stats().mean)} showBorder />
          <StatResult label="ΣX" value={format(stats().sum)} showBorder />
          <StatResult label="ΣX²" value={format(stats().sumOfSquares)} showBorder />
          <StatResult label="SS" value={format(stats().ss)} showBorder />
          <StatResult label="Median" value={format(stats().median)} showBorder />
          <StatResult label="Mode" value={stats().mode} showBorder />
          <StatResult label="Q1" value={format(stats().q1)} showBorder />
          <StatResult label="Q3" value={format(stats().q3)} showBorder />
          <StatResult label="IQR" value={format(stats().iqr)} showBorder />
          <StatResult label={isPopulation() ? 'σ²' : 's²'} value={format(stats().variance)} showBorder />
          <StatResult label={isPopulation() ? 'σ' : 's'} value={format(stats().stdDev)} showBorder />
          <StatResult label="SE" value={isPopulation() ? '-' : format(stats().standardError)} showBorder />
          <StatResult label="MAD" value={format(stats().mad)} />
        </div>
      </div>
    </div>
  );
}
