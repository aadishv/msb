import { createEffect, createMemo, createSignal } from 'solid-js';
import HighlightedTextareaCard from './HighlightedTextareaCard';
import { StatResult } from './StatResult';
import { calculateStats, format, parseNumberInput } from '~/lib/stats';
import { getStoredValue, setStoredValue } from '~/lib/storage';

const toggleBtn = (active: boolean) =>
  `text-sm transition-colors` + (active ? ';color:var(--nav-active)' : ';color:var(--nav-inactive)');

export default function DataInputEditor() {
  const [value, setValue] = createSignal(getStoredValue('stats.general.data', '12.4\n11.8\n14.1\n10.9\n13.7\n15.2'));
  const [isPopulation, setIsPopulation] = createSignal(getStoredValue('stats.general.population', false));

  createEffect(() => setStoredValue('stats.general.data', value()));
  createEffect(() => setStoredValue('stats.general.population', isPopulation()));

  const parsed = createMemo(() => parseNumberInput(value()));
  const stats = createMemo(() => calculateStats(parsed().numbers, isPopulation()));

  return (
    <div class="flex flex-col gap-6">
      <div class="flex gap-4">
        <button onClick={() => setIsPopulation(false)} class="text-sm transition-colors" style={!isPopulation() ? 'color:var(--nav-active)' : 'color:var(--nav-inactive)'}>Sample</button>
        <button onClick={() => setIsPopulation(true)} class="text-sm transition-colors" style={isPopulation() ? 'color:var(--nav-active)' : 'color:var(--nav-inactive)'}>Population</button>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12">
        <HighlightedTextareaCard title="Dataset" value={value()} onInput={setValue} parsed={parsed()} summary={`n=${stats().count} · mean=${format(stats().mean)} · sd=${format(stats().stdDev)}`} />
        <div class="flex flex-col">
          <StatResult label="Count" value={stats().count} />
          <StatResult label={isPopulation() ? 'μ' : 'x̄'} value={format(stats().mean)} />
          <StatResult label="ΣX" value={format(stats().sum)} />
          <StatResult label="ΣX²" value={format(stats().sumOfSquares)} />
          <StatResult label="SS" value={format(stats().ss)} />
          <StatResult label="Median" value={format(stats().median)} />
          <StatResult label="Mode" value={stats().mode} />
          <StatResult label="Q1" value={format(stats().q1)} />
          <StatResult label="Q3" value={format(stats().q3)} />
          <StatResult label="IQR" value={format(stats().iqr)} />
          <StatResult label={isPopulation() ? 'σ²' : 's²'} value={format(stats().variance)} />
          <StatResult label={isPopulation() ? 'σ' : 's'} value={format(stats().stdDev)} />
          <StatResult label="SE" value={isPopulation() ? '-' : format(stats().standardError)} />
          <StatResult label="MAD" value={format(stats().mad)} />
        </div>
      </div>
    </div>
  );
}
