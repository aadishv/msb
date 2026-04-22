import { A } from '@solidjs/router';

const sections = [
  {
    group: 'Descriptive',
    items: [
      { href: '/basic-statistics', label: 'Basic statistics', blurb: 'Mean, variance, SD, quartiles, IQR, MAD, and other descriptive summaries for a single sample or population.' },
    ],
  },
  {
    group: 'Two samples',
    items: [
      { href: '/two-sample-t-test', label: 'Two-sample t-test', blurb: "Compares means of two independent groups using Welch's t-test, plus a 95% CI for the mean difference and F variance ratio." },
      { href: '/mann-whitney-u', label: 'Mann-Whitney U', blurb: 'Nonparametric alternative to the two-sample t-test. Compares rank distributions without assuming normality.' },
      { href: '/paired-t-test', label: 'Paired t-test', blurb: 'Tests whether the mean of paired differences is zero. Use when two measurements come from the same subject.' },
    ],
  },
  {
    group: 'Multiple groups',
    items: [
      { href: '/anova', label: 'One-way ANOVA', blurb: 'Tests for differences among three or more group means. Includes Tukey HSD post-hoc for independent samples, and repeated-measures mode.' },
      { href: '/kruskal-wallis', label: 'Kruskal-Wallis', blurb: 'Nonparametric alternative to one-way ANOVA. Ranks all observations together and tests whether groups differ.' },
    ],
  },
  {
    group: 'Categorical',
    items: [
      { href: '/chi-square-gof', label: 'Chi-square GOF', blurb: 'Tests whether observed frequency counts match a theoretical distribution given as expected counts or proportions.' },
      { href: '/chi-square-association', label: 'Chi-square association', blurb: "Tests independence in a contingency table. Also reports Cramér's V as a measure of association strength." },
    ],
  },
  {
    group: 'Correlation',
    items: [
      { href: '/pmcc-regression', label: 'PMCC & regression', blurb: 'Pearson r, r², p-value, SLRA regression line, and Model 2 (geometric mean) regression for paired x–y data.' },
      { href: '/spearman', label: 'Spearman correlation', blurb: 'Rank-order correlation for paired data. Uses Vassar-style exact critical values for small samples (n < 10).' },
    ],
  },
];

export default function HomePage() {
  return (
    <div class="max-w-xl flex flex-col gap-8">
      {sections.map((section) => (
        <div>
          <div class="text-xs mb-3" style="color: var(--muted)">{section.group}</div>
          <ul class="flex flex-col gap-3">
            {section.items.map((item) => (
              <li class="flex flex-col gap-0.5">
                <A href={item.href} class="text-sm transition-colors hover:underline underline-offset-2" style="color: var(--nav-active)">{item.label}</A>
                <span class="text-sm" style="color: var(--muted)">{item.blurb}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
