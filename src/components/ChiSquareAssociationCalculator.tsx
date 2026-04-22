import { createEffect, createMemo, createSignal } from 'solid-js';
import { StatResult } from './StatResult';
import { calculateChiSquareAssociation, format } from '~/lib/stats';
import { getStoredValue, setStoredValue } from '~/lib/storage';

function parseTable(text: string): number[][] | null {
  const rows = text.trim().split(/\n+/).map((r) => r.trim()).filter(Boolean)
    .map((r) => r.split(/[\s,]+/).filter(Boolean).map(Number));
  if (rows.length === 0 || rows.some((r) => r.some((v) => !Number.isFinite(v)))) return null;
  const width = rows[0]?.length ?? 0;
  if (width < 2 || rows.some((r) => r.length !== width)) return null;
  return rows;
}

export default function ChiSquareAssociationCalculator() {
  const [tableText, setTableText] = createSignal(getStoredValue('stats.chi_assoc.table', '18,12,10\n11,17,14\n9,13,21'));
  createEffect(() => setStoredValue('stats.chi_assoc.table', tableText()));

  const table = createMemo(() => parseTable(tableText()));
  const result = createMemo(() => (table() ? calculateChiSquareAssociation(table()!) : null));

  return (
    <div class="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12">
      <div>
        <div class="text-xs mb-2" style="color:var(--muted)">Contingency table</div>
        <textarea
          style="width:100%;min-height:160px;padding:0;background:transparent;resize:none;border:none;outline:none;font-family:var(--font-mono);font-size:0.875rem;line-height:1.625;color:var(--fg)"
          value={tableText()}
          onInput={(e) => setTableText(e.currentTarget.value)}
          placeholder="one row per line, comma or space separated"
          spellcheck={false}
        />
      </div>
      <div class="flex flex-col">
        {!result() ? (
          <span class="text-sm" style="color:var(--muted)">Enter a 2–5 × 2–5 table.</span>
        ) : (
          <>
            <StatResult label="χ²" value={format(result()!.chiSquare)} />
            <StatResult label="χ² uncorrected" value={format(result()!.uncorrectedChiSquare)} />
            <StatResult label="df" value={result()!.df} />
            <StatResult label="P" value={result()!.pValue < 0.0001 ? '< 0.0001' : format(result()!.pValue)} />
            <StatResult label="Cramér's V" value={format(result()!.cramerV)} />
          </>
        )}
      </div>
    </div>
  );
}
