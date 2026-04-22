import { ParentProps } from 'solid-js';
import { A } from '@solidjs/router';

const groups = [
  {
    label: 'Descriptive',
    links: [{ href: '/basic-statistics', label: 'Basic statistics' }],
  },
  {
    label: 'Two samples',
    links: [
      { href: '/two-sample-t-test', label: 'Two-sample t-test' },
      { href: '/mann-whitney-u', label: 'Mann-Whitney U' },
      { href: '/paired-t-test', label: 'Paired t-test' },
    ],
  },
  {
    label: 'Multiple groups',
    links: [
      { href: '/anova', label: 'One-way ANOVA' },
      { href: '/kruskal-wallis', label: 'Kruskal-Wallis' },
    ],
  },
  {
    label: 'Categorical',
    links: [
      { href: '/chi-square-gof', label: 'Chi-square GOF' },
      { href: '/chi-square-association', label: 'Chi-square association' },
    ],
  },
  {
    label: 'Correlation',
    links: [
      { href: '/pmcc-regression', label: 'PMCC & regression' },
      { href: '/spearman', label: 'Spearman correlation' },
    ],
  },
] as const;

export default function Layout(props: ParentProps) {
  return (
    <div class="min-h-screen flex" style="background: var(--bg); color: var(--fg)">
      <nav class="w-48 shrink-0 p-8 pr-6 flex flex-col gap-5 sticky top-0 h-screen overflow-y-auto">
        <A
          href="/"
          class="text-sm text-left transition-colors"
          style="color: var(--muted)"
          activeClass=""
          inactiveClass=""
          end
          onClick={() => {}}
        >
          {(isActive: boolean) => (
            <span style={isActive ? 'color: var(--nav-active)' : 'color: var(--muted)'}>MSB</span>
          )}
        </A>
        {groups.map((group) => (
          <div class="flex flex-col gap-1">
            <span class="text-xs mb-1" style="color: var(--muted)">{group.label}</span>
            {group.links.map((link) => (
              <A
                href={link.href}
                class="text-left text-sm transition-colors"
                activeClass=""
                inactiveClass=""
              >
                {(isActive: boolean) => (
                  <span style={isActive ? 'color: var(--nav-active)' : 'color: var(--nav-inactive)'}>{link.label}</span>
                )}
              </A>
            ))}
          </div>
        ))}
      </nav>
      <main class="flex-1 p-8 pl-4 min-w-0">
        {props.children}
      </main>
    </div>
  );
}
