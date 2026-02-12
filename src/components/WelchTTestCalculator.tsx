import { createSignal, createMemo, Show, createEffect, For, JSX } from 'solid-js';
import { AlertCircle, CheckCircle2 } from 'lucide-solid';
import { calculateWelchTTest, format, parseNumberInput, calculateSampleSummary, ParsedNumberInput } from '~/lib/stats';
import { getStoredValue, setStoredValue } from '~/lib/storage';
import { StatResult } from './StatResult';

const WelchTTestCalculator = () => {
  const [mode, setMode] = createSignal<'summary' | 'raw'>(getStoredValue('stats.welch.mode', 'summary'));
  
  // Summary Stats State
  const [m1, setM1] = createSignal(getStoredValue('stats.welch.sample1.mean', '25'));
  const [s1, setS1] = createSignal(getStoredValue('stats.welch.sample1.sd', '5'));
  const [n1, setN1] = createSignal(getStoredValue('stats.welch.sample1.n', '30'));
  
  const [m2, setM2] = createSignal(getStoredValue('stats.welch.sample2.mean', '22'));
  const [s2, setS2] = createSignal(getStoredValue('stats.welch.sample2.sd', '6'));
  const [n2, setN2] = createSignal(getStoredValue('stats.welch.sample2.n', '28'));

  const [raw1, setRaw1] = createSignal(getStoredValue('stats.welch.sample1.raw', '12, 15, 11, 18, 14'));
  const [raw2, setRaw2] = createSignal(getStoredValue('stats.welch.sample2.raw', '9, 13, 10, 12, 8'));

  createEffect(() => setStoredValue('stats.welch.mode', mode()));
  createEffect(() => setStoredValue('stats.welch.sample1.mean', m1()));
  createEffect(() => setStoredValue('stats.welch.sample1.sd', s1()));
  createEffect(() => setStoredValue('stats.welch.sample1.n', n1()));
  createEffect(() => setStoredValue('stats.welch.sample2.mean', m2()));
  createEffect(() => setStoredValue('stats.welch.sample2.sd', s2()));
  createEffect(() => setStoredValue('stats.welch.sample2.n', n2()));
  createEffect(() => setStoredValue('stats.welch.sample1.raw', raw1()));
  createEffect(() => setStoredValue('stats.welch.sample2.raw', raw2()));

  const parsed1 = createMemo(() => parseNumberInput(raw1()));
  const parsed2 = createMemo(() => parseNumberInput(raw2()));
  const summary1 = createMemo(() => calculateSampleSummary(parsed1().numbers));
  const summary2 = createMemo(() => calculateSampleSummary(parsed2().numbers));

  const results = createMemo(() => {
    if (mode() === 'summary') {
      const nm1 = Number(m1());
      const ns1 = Number(s1());
      const nn1 = Number(n1());
      const nm2 = Number(m2());
      const ns2 = Number(s2());
      const nn2 = Number(n2());

      if ([nm1, ns1, nn1, nm2, ns2, nn2].some(value => Number.isNaN(value)) || nn1 <= 1 || nn2 <= 1 || ns1 <= 0 || ns2 <= 0) {
        return null;
      }

      return calculateWelchTTest(nm1, ns1, nn1, nm2, ns2, nn2);
    }

    const sample1 = summary1();
    const sample2 = summary2();

    if (!sample1 || !sample2) return null;
    if (parsed1().errors > 0 || parsed2().errors > 0) return null;
    if (!isFinite(sample1.sd) || !isFinite(sample2.sd) || sample1.n <= 1 || sample2.n <= 1) return null;

    return calculateWelchTTest(sample1.mean, sample1.sd, sample1.n, sample2.mean, sample2.sd, sample2.n);
  });

  return (
    <div class="max-w-6xl w-full flex flex-col gap-8">
      
      <div class="flex flex-col space-y-4">
        <div class="flex p-1 bg-[#E6E4DD] rounded-xl border border-[#D1CFCA] w-fit">
          <button 
            onClick={() => setMode('summary')}
            class={`px-4 py-1.5 text-sm font-serif rounded-lg transition-all ${mode() === 'summary' ? 'bg-white text-[#2D2D2D] shadow-sm' : 'text-[#6B6255] hover:text-[#393939]'}`}
          >
            Summary Statistics
          </button>
          <button 
            onClick={() => setMode('raw')}
            class={`px-4 py-1.5 text-sm font-serif rounded-lg transition-all ${mode() === 'raw' ? 'bg-white text-[#2D2D2D] shadow-sm' : 'text-[#6B6255] hover:text-[#393939]'}`}
          >
            Raw Data
          </button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-[1fr_384px] gap-6 items-stretch">
          
          {/* Inputs */}
          <div class="space-y-6">
            <Show when={mode() === 'summary'}>
              <TwoSampleContainer>
                <SampleInputCard 
                  title="Sample 1" 
                  mean={m1()} setMean={setM1} 
                  sd={s1()} setSd={setS1} 
                  n={n1()} setN={setN1} 
                />
                <SampleInputCard 
                  title="Sample 2" 
                  mean={m2()} setMean={setM2} 
                  sd={s2()} setSd={setS2} 
                  n={n2()} setN={setN2} 
                />
              </TwoSampleContainer>
            </Show>
            <Show when={mode() === 'raw'}>
              <TwoSampleContainer>
                <RawSampleInput
                  title="Sample 1"
                  value={raw1()}
                  onInput={setRaw1}
                  parsed={parsed1()}
                  summary={summary1()}
                />
                <RawSampleInput
                  title="Sample 2"
                  value={raw2()}
                  onInput={setRaw2}
                  parsed={parsed2()}
                  summary={summary2()}
                />
              </TwoSampleContainer>
            </Show>
          </div>

          {/* Results Side */}
          <div class="bg-white rounded-2xl shadow-sm border border-[#E6E4DD] p-6 flex flex-col justify-center">
            <Show when={results()} fallback={
              <div class="text-center text-[#8A847A] font-serif py-12">
                {mode() === 'summary'
                  ? 'Enter valid positive numbers (n > 1) to see results.'
                  : 'Enter at least two valid values per sample to see results.'}
              </div>
            }>
              <div class="space-y-4">
                <StatResult label="t-score" value={format(results()!.t)} />
                <StatResult label="Degrees of Freedom" value={format(results()!.df)} />
                <div class="border-t border-dotted border-[#E6E4DD] my-2"></div>
                <StatResult label="Two-tailed P value" value={results()!.p < 0.0001 ? '< 0.0001' : format(results()!.p)} />
                <div class="border-t border-dotted border-[#E6E4DD] my-2"></div>
                <StatResult 
                  label="95% Confidence Interval" 
                  value={`[${format(results()!.ciLow)}, ${format(results()!.ciHigh)}]`} 
                />
              </div>
            </Show>
          </div>

        </div>
      </div>
    </div>
  );
};

const TwoSampleContainer = (props: { children: JSX.Element }) => (
  <div class="grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl shadow-sm border border-[#E6E4DD] divide-y md:divide-y-0 md:divide-x divide-[#E6E4DD] overflow-hidden">
    {props.children}
  </div>
);

const SampleInputCard = (props: { title: string, mean: string, setMean: (v: string) => void, sd: string, setSd: (v: string) => void, n: string, setN: (v: string) => void }) => (
  <div class="p-6 space-y-4">
    <h3 class="font-serif text-[#2D2D2D] font-medium border-b border-[#F0EFEC] pb-2">{props.title}</h3>
    <div class="space-y-3">
      <InputField label="Mean (x̄)" value={props.mean} onInput={props.setMean} />
      <InputField label="Std Dev (s)" value={props.sd} onInput={props.setSd} />
      <InputField label="Sample Size (n)" value={props.n} onInput={props.setN} />
    </div>
  </div>
);

const RawSampleInput = (props: { title: string, value: string, onInput: (v: string) => void, parsed: ParsedNumberInput, summary: { mean: number; sd: number; n: number } | null }) => {
  let textareaRef: HTMLTextAreaElement | undefined;
  let backdropRef: HTMLDivElement | undefined;

  const handleScroll = () => {
    if (textareaRef && backdropRef) {
      backdropRef.scrollTop = textareaRef.scrollTop;
      backdropRef.scrollLeft = textareaRef.scrollLeft;
    }
  };

  const summaryText = () => {
    if (!props.summary || props.parsed.errors > 0 || !isFinite(props.summary.sd) || props.summary.n <= 1) {
      return '-';
    }
    return `n=${props.summary.n} · mean=${format(props.summary.mean)} · sd=${format(props.summary.sd)}`;
  };

  return (
    <div class="p-6 flex flex-col min-h-[360px]">
      <h3 class="font-serif text-[#2D2D2D] font-medium border-b border-[#F0EFEC] pb-2">{props.title}</h3>
      <div class="relative w-full flex-1 font-mono text-base leading-relaxed mt-4">
        <div 
          ref={backdropRef}
          class="absolute inset-0 w-full h-full p-4 whitespace-pre-wrap break-words overflow-hidden pointer-events-none z-0 text-transparent"
          aria-hidden="true"
        >
          <For each={props.parsed.tokens}>
            {(token) => (
              <span class={
                token.type === 'valid' ? "bg-[#E3E1DC] rounded-sm shadow-[0_0_0_1px_#D1CFCA]" : 
                token.type === 'error' ? "bg-[#F3DCD6] rounded-sm shadow-[0_0_0_1px_#E5BDB5]" : ""
              }>
                {token.content}
              </span>
            )}
          </For>
          <Show when={props.value.endsWith('\n')}><br /></Show>
        </div>

        <textarea
          ref={textareaRef}
          value={props.value}
          onInput={(e) => props.onInput(e.currentTarget.value)}
          onScroll={handleScroll}
          spellcheck={false}
          class="absolute inset-0 w-full h-full p-4 bg-transparent text-[#393939] caret-black resize-none border-none outline-none focus:ring-0 z-10 whitespace-pre-wrap break-words overflow-auto font-mono text-base leading-relaxed"
          placeholder="Enter data..."
        />
      </div>

      <div class="mt-4 pt-4 border-t border-[#F0EFEC] flex items-center justify-between text-sm">
        <div class="flex items-center space-x-2">
          <Show 
            when={props.parsed.errors > 0} 
            fallback={
              <div class="flex items-center text-[#5A7258] bg-[#E9F0E9] px-2 py-1 rounded-md">
                <CheckCircle2 size={16} class="mr-2" />
                <span class="font-medium font-serif">All data valid</span>
              </div>
            }
          >
            <div class="flex items-center text-[#A64635] bg-[#F9EBE9] px-2 py-1 rounded-md">
              <AlertCircle size={16} class="mr-2" />
              <span class="font-medium font-serif">{props.parsed.errors} parsing error{props.parsed.errors > 1 ? 's' : ''}</span>
            </div>
          </Show>
        </div>
        <div class="text-[#8A847A] font-serif">
          {summaryText()}
        </div>
      </div>
    </div>
  );
};

const InputField = (props: { label: string, value: string, onInput: (v: string) => void }) => (
  <div class="flex flex-col space-y-1">
    <label class="text-xs font-bold text-[#8A847A] tracking-wider font-sans">{props.label}</label>
    <input 
      type="text" 
      value={props.value}
      onInput={(e) => props.onInput(e.currentTarget.value)}
      class="w-full bg-[#F9F9F8] border border-[#E6E4DD] rounded-lg px-3 py-2 font-mono text-[#2D2D2D] focus:outline-none focus:ring-1 focus:ring-[#D1CFCA] transition-all"
    />
  </div>
);

export default WelchTTestCalculator;
