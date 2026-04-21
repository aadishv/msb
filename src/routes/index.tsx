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
  {
    id: 'general-stats',
    title: 'Basic sample statistics',
    description: 'Mean, variance, standard deviation, quartiles, and descriptive summaries for a single dataset.',
    component: DataInputEditor,
  },
  {
    id: 'independent-t-test',
    title: 'Two-sample t-test',
    description: 'Independent-samples t-test with both equal-variance and Welch outputs, plus confidence intervals.',
    component: WelchTTestCalculator,
  },
  {
    id: 'mann-whitney-u',
    title: 'Mann-Whitney U',
    description: 'Nonparametric comparison for two independent samples.',
    component: MannWhitneyUCalculator,
  },
  {
    id: 'paired-t-test',
    title: 'Paired t-test',
    description: 'Matched-sample t-test with mean difference and confidence interval.',
    component: PairedTTestCalculator,
  },
  {
    id: 'anova',
    title: 'One-way ANOVA',
    description: 'Independent or correlated one-way ANOVA with Tukey HSD for independent samples.',
    component: AnovaCalculator,
  },
  {
    id: 'kruskal-wallis',
    title: 'Kruskal-Wallis',
    description: 'Nonparametric comparison for 3 to 5 independent groups.',
    component: KruskalWallisCalculator,
  },
  {
    id: 'chi-square-gof',
    title: 'Chi-square goodness of fit',
    description: 'One-dimensional chi-square test from observed counts and expected counts or proportions.',
    component: ChiSquareGoodnessCalculator,
  },
  {
    id: 'chi-square-association',
    title: 'Chi-square association',
    description: 'Contingency-table chi-square with Cramer’s V.',
    component: ChiSquareAssociationCalculator,
  },
  {
    id: 'spearman',
    title: 'Spearman rank correlation',
    description: 'Rank-order correlation for paired data, with Vassar-style small-sample behavior.',
    component: SpearmanCalculator,
  },
  {
    id: 'pearson',
    title: 'PMCC and regression',
    description: 'Pearson correlation, simple linear regression, and model 2 regression derived from summary stats.',
    component: PearsonRegressionCalculator,
  },
] as const;

export default function Home() {
  return (
    <main class="min-h-screen bg-[#F5F4EF] text-[#393939] font-sans p-6 md:p-12 flex flex-col items-center">
      <div class="w-full max-w-6xl my-12 font-serif space-y-8">
        <div class="space-y-4">
          <div class="text-[11px] tracking-[0.24em] uppercase text-[#8A847A] font-sans">Unofficial MSB calculator</div>
          <h1 class="text-4xl md:text-6xl text-[#2D2D2D] leading-none">Field guide to the usual biostats tests.</h1>
          <p class="max-w-3xl text-[#6B6255] text-base md:text-lg leading-relaxed">
            The old logic is gone. These calculators now use the reverse-engineered Vassar-style implementations we validated against the live site and SciPy, while keeping the polished interface you already had.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 text-sm">
          {sections.map((section) => (
            <a href={`#${section.id}`} class="bg-white border border-[#E6E4DD] rounded-2xl px-4 py-4 shadow-sm hover:border-[#CFC8BE] hover:-translate-y-[1px] transition-all">
              <div class="font-medium text-[#2D2D2D]">{section.title}</div>
              <div class="text-[#6B6255] text-xs mt-1 leading-relaxed">{section.description}</div>
            </a>
          ))}
        </div>
      </div>

      {sections.map((section, index) => {
        const Component = section.component;
        return (
          <section id={section.id} class={`w-full flex flex-col items-center space-y-4 ${index === 0 ? '' : 'mt-20'} ${index === sections.length - 1 ? 'mb-24' : ''} scroll-mt-24`}>
            <div class="max-w-6xl w-full space-y-2 text-left">
              <h2 class="text-2xl md:text-3xl font-serif text-[#2D2D2D] font-medium">{section.title}</h2>
              <p class="text-[#6B6255] text-base md:text-lg font-serif">{section.description}</p>
            </div>
            <Component />
          </section>
        );
      })}
    </main>
  );
}
