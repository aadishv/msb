import { Title } from "@solidjs/meta";
import DataInputEditor from "~/components/DataInputEditor";
import WelchTTestCalculator from "~/components/WelchTTestCalculator";
import MannWhitneyUCalculator from "~/components/MannWhitneyUCalculator";
import PairedTTestCalculator from "~/components/PairedTTestCalculator";
import AnovaCalculator from "~/components/AnovaCalculator";

export default function Home() {
  return (
    <main class="min-h-screen bg-[#F5F4EF] text-[#393939] font-sans p-6 md:p-12 flex flex-col items-center">
      <div class="w-full max-w-6xl my-12 font-serif">
        <div class="grid grid-cols-3 border-b border-[#D8D4CF] pb-2 text-[#6B6255] tracking-wider text-xs">
          <div>Test Case</div>
          <div class="text-center">Parametric</div>
          <div class="text-center">Nonparametric</div>
        </div>
        <div class="divide-y divide-[#D8D4CF]">
          <div class="grid grid-cols-3 py-4 items-center">
            <div class="text-[#2D2D2D]">
              <div class="font-medium">Standard case</div>
              <div class="text-xs text-[#6B6255]">2 unmatched samples</div>
            </div>
            <div class="text-center">
              <a href="#welch-t-test" class="text-[#2D2D2D] hover:underline decoration-[#D8D4CF]">Two-sample t-test</a>
            </div>
            <div class="text-center">
              <a href="#mann-whitney-u" class="text-[#2D2D2D] hover:underline decoration-[#D8D4CF]">Mann-Whitney</a>
            </div>
          </div>
          <div class="grid grid-cols-3 py-4 items-center">
            <div class="text-[#2D2D2D]">
              <div class="font-medium">Matched samples</div>
              <div class="text-xs text-[#6B6255]">2 groups</div>
            </div>
            <div class="text-center">
              <a href="#paired-t-test" class="text-[#2D2D2D] hover:underline decoration-[#D8D4CF]">Paired t-test</a>
            </div>
            <div class="text-center text-[#6B6255]">Wilcoxon</div>
          </div>
          <div class="grid grid-cols-3 py-4 items-center">
            <div class="text-[#2D2D2D]">
              <div class="font-medium">More than 2 groups</div>
              <div class="text-xs text-[#6B6255]">Matched or unmatched</div>
            </div>
            <div class="text-center">
              <a href="#anova" class="text-[#2D2D2D] hover:underline decoration-[#D8D4CF]">ANOVA</a>
            </div>
            <div class="text-center text-[#6B6255]">Kruskal-Wallis</div>
          </div>
        </div>

        <nav class="mt-8 flex flex-col gap-2">
          <span class="text-[#6B6255] tracking-wider text-[10px] font-sans">Other tests</span>
          <div class="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <a href="#general-stats" class="text-[#2D2D2D] hover:underline decoration-[#D8D4CF]">
              General statistics
            </a>
            <a href="#welch-t-test" class="text-[#2D2D2D] hover:underline decoration-[#D8D4CF]">
              Confidence intervals for mean difference (→ Welch's t-test)
            </a>
          </div>
        </nav>
      </div>

      <section id="general-stats" class="w-full flex flex-col items-center space-y-4 scroll-mt-24">
        <div class="max-w-6xl w-full space-y-2 text-left">
          <h2 class="text-2xl md:text-3xl font-serif text-[#2D2D2D] font-medium">
            General Statistics
          </h2>
          <p class="text-[#6B6255] text-base md:text-lg font-serif">
            Enter your dataset to calculate descriptive statistics.
          </p>
        </div>
        <DataInputEditor />
      </section>

      <section id="welch-t-test" class="w-full flex flex-col items-center space-y-4 mt-16 scroll-mt-24">
        <div class="max-w-6xl w-full space-y-2 text-left">
          <h2 class="text-2xl md:text-3xl font-serif text-[#2D2D2D] font-medium">
            Welch's t-test
          </h2>
          <p class="text-[#6B6255] text-base md:text-lg font-serif">
            Compare the means of two samples with unequal variances.
          </p>
        </div>
        <WelchTTestCalculator />
      </section>

      <section id="mann-whitney-u" class="w-full flex flex-col items-center space-y-4 mt-16 scroll-mt-24">
        <div class="max-w-6xl w-full space-y-2 text-left">
          <h2 class="text-2xl md:text-3xl font-serif text-[#2D2D2D] font-medium">
            Mann-Whitney U-test
          </h2>
          <p class="text-[#6B6255] text-base md:text-lg font-serif">
            Non-parametric test to compare two independent samples.
          </p>
        </div>
        <MannWhitneyUCalculator />
      </section>

      <section id="paired-t-test" class="w-full flex flex-col items-center space-y-4 mt-16 scroll-mt-24">
        <div class="max-w-6xl w-full space-y-2 text-left">
          <h2 class="text-2xl md:text-3xl font-serif text-[#2D2D2D] font-medium">
            Paired t-test
          </h2>
          <p class="text-[#6B6255] text-base md:text-lg font-serif">
            Compare the means of two related groups.
          </p>
        </div>
        <PairedTTestCalculator />
      </section>

      <section id="anova" class="w-full flex flex-col items-center space-y-4 mt-16 mb-24 scroll-mt-24">
        <div class="max-w-6xl w-full space-y-2 text-left">
          <h2 class="text-2xl md:text-3xl font-serif text-[#2D2D2D] font-medium">
            One-way ANOVA
          </h2>
          <p class="text-[#6B6255] text-base md:text-lg font-serif">
            Compare the means of three or more independent samples.
          </p>
        </div>
        <AnovaCalculator />
      </section>
    </main>
  );
}
