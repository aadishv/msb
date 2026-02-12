import { Title } from "@solidjs/meta";
import DataInputEditor from "~/components/DataInputEditor";
import WelchTTestCalculator from "~/components/WelchTTestCalculator";

export default function Home() {
  return (
    <main class="min-h-screen bg-[#F5F4EF] text-[#393939] font-sans p-6 md:p-12 flex flex-col items-center">
      <Title>Statistical Calculator</Title>

      <div class="max-w-6xl w-full mb-10 flex flex-col space-y-6">
        <div class="space-y-2 text-left">
          <h1 class="text-3xl md:text-4xl font-serif text-[#2D2D2D] font-medium tracking-tight">
            Statistical Calculator
          </h1>
          <p class="text-[#6B6255] text-lg font-serif">
            A growing suite of statistical tools for analysis and comparison.
          </p>
        </div>

        <nav class="flex flex-wrap gap-4 text-sm font-serif">
          <a href="#general-stats" class="text-[#6B6255] hover:text-[#2D2D2D] transition-colors">
            General Statistics
          </a>
          <a href="#welch-t-test" class="text-[#6B6255] hover:text-[#2D2D2D] transition-colors">
            Welch's t-test
          </a>
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
            Compare the means of two populations with unequal variances.
          </p>
        </div>
        <WelchTTestCalculator />
      </section>
    </main>
  );
}
