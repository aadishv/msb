import { createSignal, Show, For } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import DataInputEditor from '~/components/DataInputEditor';
import WelchTTestCalculator from '~/components/WelchTTestCalculator';
import MannWhitneyUCalculator from '~/components/MannWhitneyUCalculator';
import PairedTTestCalculator from '~/components/PairedTTestCalculator';
import AnovaCalculator from '~/components/AnovaCalculator';
import KruskalWallisCalculator from '~/components/KruskalWallisCalculator';
import ChiSquareGoodnessCalculator from '~/components/ChiSquareGoodnessCalculator';
import ChiSquareAssociationCalculator from '~/components/ChiSquareAssociationCalculator';
import SpearmanCalculator from '~/components/SpearmanCalculator';
import PearsonRegressionCalculator from '~/components/PearsonRegressionCalculator';

const sections = [
  { id: 'general-stats', label: 'Basic statistics', component: DataInputEditor, group: 'Descriptive' },
  { id: 'independent-t-test', label: 'Two-sample t-test', component: WelchTTestCalculator, group: 'Two samples' },
  { id: 'mann-whitney-u', label: 'Mann-Whitney U', component: MannWhitneyUCalculator, group: 'Two samples' },
  { id: 'paired-t-test', label: 'Paired t-test', component: PairedTTestCalculator, group: 'Two samples' },
  { id: 'anova', label: 'One-way ANOVA', component: AnovaCalculator, group: 'Multiple groups' },
  { id: 'kruskal-wallis', label: 'Kruskal-Wallis', component: KruskalWallisCalculator, group: 'Multiple groups' },
  { id: 'chi-square-gof', label: 'Chi-square GOF', component: ChiSquareGoodnessCalculator, group: 'Categorical' },
  { id: 'chi-square-association', label: 'Chi-square association', component: ChiSquareAssociationCalculator, group: 'Categorical' },
  { id: 'pearson', label: 'PMCC & regression', component: PearsonRegressionCalculator, group: 'Correlation' },
  { id: 'spearman', label: 'Spearman correlation', component: SpearmanCalculator, group: 'Correlation' },
] as const;

type SectionId = (typeof sections)[number]['id'];
const groups = ['Descriptive', 'Two samples', 'Multiple groups', 'Categorical', 'Correlation'] as const;

export default function Home() {
  const [active, setActive] = createSignal<SectionId>('general-stats');
  const [menuOpen, setMenuOpen] = createSignal(false);

  const activeSection = () => sections.find(s => s.id === active())!;

  return (
    <div class="h-screen flex flex-col bg-white text-[#111] overflow-hidden">
      <header class="flex items-center justify-between px-4 h-9 border-b border-[#E8E8E8] shrink-0">
        <span class="text-[10px] tracking-[0.2em] uppercase text-[#BBB] font-mono select-none">MSB</span>
        <button
          class="lg:hidden text-[11px] text-[#555] border border-[#E0E0E0] px-2 py-0.5 font-mono"
          onClick={() => setMenuOpen(v => !v)}
        >
          {menuOpen() ? 'close' : activeSection().label}
        </button>
      </header>

      <div class="flex flex-1 min-h-0">
        <nav class={`lg:flex flex-col w-44 shrink-0 border-r border-[#E8E8E8] overflow-y-auto ${menuOpen() ? 'flex absolute inset-0 top-9 z-50 bg-white' : 'hidden'} lg:relative lg:z-auto`}>
          <For each={groups}>
            {(group) => (
              <div class="py-2">
                <div class="px-3 pb-1 text-[9px] font-bold tracking-[0.2em] uppercase text-[#CCC] font-mono">{group}</div>
                <For each={sections.filter(s => s.group === group)}>
                  {(section) => (
                    <button
                      onClick={() => { setActive(section.id); setMenuOpen(false); }}
                      class={`w-full text-left px-3 py-1.5 text-[12px] font-mono transition-colors ${active() === section.id ? 'bg-[#111] text-white' : 'text-[#555] hover:bg-[#F5F5F5] hover:text-[#111]'}`}
                    >
                      {section.label}
                    </button>
                  )}
                </For>
              </div>
            )}
          </For>
        </nav>

        <main class="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <div class="px-5 py-3 border-b border-[#F0F0F0] shrink-0">
            <span class="text-[11px] font-mono text-[#888]">{activeSection().label}</span>
          </div>
          <div class="flex-1 p-5">
            <For each={sections}>
              {(section) => (
                <Show when={active() === section.id}>
                  <Dynamic component={section.component} />
                </Show>
              )}
            </For>
          </div>
        </main>
      </div>
    </div>
  );
}
