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
        <div class="space-y-3">
          <div class="text-[11px] tracking-[0.24em] uppercase text-[#8A847A] font-sans">Unofficial MSB calculator</div>
          <h1 class="text-4xl md:text-6xl text-[#2D2D2D] leading-none">Field guide to the usual biostats tests.</h1>
        </div>

        <div class="grid grid-cols-3 border-b border-[#D8D4CF] pb-2 text-[#6B6255] tracking-wider text-xs font-sans">
          <div>Test case</div>
          <div class="text-center">Parametric</div>
          <div class="text-center">Nonparametric</div>
        </div>
        <div class="divide-y divide-[#D8D4CF] text-sm md:text-base">
          <div class="grid grid-cols-3 py-4 items-center gap-4">
            <div class="text-[#2D2D2D]">
              <div class="font-medium">Standard case</div>
              <div class="text-xs text-[#6B6255] font-sans">2 unmatched samples</div>
            </div>
            <div class="text-center"><a href="#independent-t-test" class="text-[#2D2D2D] hover:underline decoration-[#D8D4CF]">Two-sample t-test</a></div>
            <div class="text-center"><a href="#mann-whitney-u" class="text-[#2D2D2D] hover:underline decoration-[#D8D4CF]">Mann-Whitney</a></div>
          </div>
          <div class="grid grid-cols-3 py-4 items-center gap-4">
            <div class="text-[#2D2D2D]">
              <div class="font-medium">Matched samples</div>
              <div class="text-xs text-[#6B6255] font-sans">2 groups</div>
            </div>
            <div class="text-center"><a href="#paired-t-test" class="text-[#2D2D2D] hover:underline decoration-[#D8D4CF]">Paired t-test</a></div>
            <div class="text-center text-[#8A847A]">Wilcoxon</div>
          </div>
          <div class="grid grid-cols-3 py-4 items-center gap-4">
            <div class="text-[#2D2D2D]">
              <div class="font-medium">More than 2 groups</div>
              <div class="text-xs text-[#6B6255] font-sans">Matched or unmatched</div>
            </div>
            <div class="text-center"><a href="#anova" class="text-[#2D2D2D] hover:underline decoration-[#D8D4CF]">ANOVA</a></div>
            <div class="text-center"><a href="#kruskal-wallis" class="text-[#2D2D2D] hover:underline decoration-[#D8D4CF]">Kruskal-Wallis</a></div>
          </div>
          <div class="grid grid-cols-3 py-4 items-center gap-4">
            <div class="text-[#2D2D2D]">
              <div class="font-medium">Frequency data</div>
              <div class="text-xs text-[#6B6255] font-sans">Counts and contingency tables</div>
            </div>
            <div class="text-center"><a href="#chi-square-gof" class="text-[#2D2D2D] hover:underline decoration-[#D8D4CF]">Chi-square goodness of fit</a></div>
            <div class="text-center"><a href="#chi-square-association" class="text-[#2D2D2D] hover:underline decoration-[#D8D4CF]">Chi-square association</a></div>
          </div>
          <div class="grid grid-cols-3 py-4 items-center gap-4">
            <div class="text-[#2D2D2D]">
              <div class="font-medium">Association / trend</div>
              <div class="text-xs text-[#6B6255] font-sans">Paired x-y data</div>
            </div>
            <div class="text-center"><a href="#pearson" class="text-[#2D2D2D] hover:underline decoration-[#D8D4CF]">PMCC / regression</a></div>
            <div class="text-center"><a href="#spearman" class="text-[#2D2D2D] hover:underline decoration-[#D8D4CF]">Spearman</a></div>
          </div>
        </div>

        <nav class="flex flex-col gap-2 pt-2">
          <span class="text-[#6B6255] tracking-wider text-[10px] font-sans uppercase">Other tools</span>
          <div class="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <a href="#general-stats" class="text-[#2D2D2D] hover:underline decoration-[#D8D4CF]">Basic sample statistics</a>
            <a href="#pearson" class="text-[#2D2D2D] hover:underline decoration-[#D8D4CF]">Simple linear regression</a>
            <a href="#pearson" class="text-[#2D2D2D] hover:underline decoration-[#D8D4CF]">Model 2 regression</a>
            <a href="#independent-t-test" class="text-[#2D2D2D] hover:underline decoration-[#D8D4CF]">Confidence interval for mean difference</a>
          </div>
        </nav>
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
