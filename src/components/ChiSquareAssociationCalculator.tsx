import { createEffect, createMemo, createSignal } from 'solid-js';
import { StatResult } from './StatResult';
import { calculateChiSquareAssociation, format } from '~/lib/stats';
import { getStoredValue, setStoredValue } from '~/lib/storage';

function parseTable(text: string): number[][] | null {
  const rows = text.trim().split(/\n+/).map((row) => row.trim()).filter(Boolean)
    .map((row) => row.split(/[\s,]+/).filter(Boolean).map(Number));
  if (rows.length === 0 || rows.some((row) => row.some((v) => !Number.isFinite(v)))) return null;
  const width = rows[0]?.length ?? 0;
  if (width < 2 || rows.some((row) => row.length !== width)) return null;
  return rows;
}

export default function ChiSquareAssociationCalculator() {
  const [tableText, setTableText] = createSignal(getStoredValue('stats.chi_assoc.table', '18,12,10\n11,17,14\n9,13,21'));
  createEffect(() => setStoredValue('stats.chi_assoc.table', tableText()));

  const table = createMemo(() => parseTable(tableText()));
  const result = createMemo(() => (table() ? calculateChiSquareAssociation(table()!) : null));

  return (
    <div class="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 items-start">
      <textarea
        class="w-full min-h-[200px] p-2 border border-[#E0E0E0] resize-none font-mono text-sm outline-none focus:border-[#AAA] transition-colors"
        value={tableText()}
        onInput={(e) => setTableText(e.currentTarget.value)}
        placeholder="One row per line, comma or space separated"
      />

      <div class="border border-[#E0E0E0] p-4">
        {!result() ? (
          <span class="text-[11px] text-[#AAA] font-mono">Enter a 2–5 × 2–5 contingency table.</span>
        ) : (
          <div>
            <StatResult label="χ²" value={format(result()!.chiSquare)} showBorder />
            <StatResult label="χ² uncorrected" value={format(result()!.uncorrectedChiSquare)} showBorder />
            <StatResult label="df" value={result()!.df} showBorder />
            <StatResult label="P" value={result()!.pValue < 0.0001 ? '< 0.0001' : format(result()!.pValue)} showBorder />
            <StatResult label="Cramér's V" value={format(result()!.cramerV)} />
          </div>
        )}
      </div>
    </div>
  );
}
