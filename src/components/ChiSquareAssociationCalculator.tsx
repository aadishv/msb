import { createEffect, createMemo, createSignal } from 'solid-js';
import { StatResult } from './StatResult';
import { calculateChiSquareAssociation, format } from '~/lib/stats';
import { getStoredValue, setStoredValue } from '~/lib/storage';

function parseTable(text: string): number[][] | null {
  const rows = text
    .trim()
    .split(/\n+/)
    .map((row) => row.trim())
    .filter(Boolean)
    .map((row) => row.split(/[\s,]+/).filter(Boolean).map(Number));
  if (rows.length === 0 || rows.some((row) => row.some((value) => !Number.isFinite(value)))) return null;
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
    <div class="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-[1fr_384px] gap-6 items-stretch">
      <textarea
        class="w-full min-h-[320px] p-4 bg-white rounded-2xl shadow-sm border border-[#E6E4DD] resize-none font-mono text-sm outline-none"
        value={tableText()}
        onInput={(event) => setTableText(event.currentTarget.value)}
        placeholder="Enter one row per line, comma or space separated"
      />

      <div class="bg-white rounded-2xl shadow-sm border border-[#E6E4DD] p-6 flex flex-col justify-center">
        {!result() ? (
          <div class="text-center text-[#8A847A] font-serif py-12">Enter a rectangular 2–5 by 2–5 contingency table.</div>
        ) : (
          <div class="space-y-4">
            <StatResult label="Chi-square" value={format(result()!.chiSquare)} showBorder />
            <StatResult label="Uncorrected χ²" value={format(result()!.uncorrectedChiSquare)} showBorder />
            <StatResult label="df" value={result()!.df} showBorder />
            <StatResult label="P value" value={result()!.pValue < 0.0001 ? '< 0.0001' : format(result()!.pValue)} showBorder />
            <StatResult label="Cramer's V" value={format(result()!.cramerV)} />
          </div>
        )}
      </div>
    </div>
  );
}
