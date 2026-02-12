import { createSignal, createMemo, Show, createEffect, For, JSX } from 'solid-js';
import { AlertCircle, CheckCircle2, Copy, Check } from 'lucide-solid';
import { calculatePairedTTest, format, parseNumberInput, ParsedNumberInput } from '~/lib/stats';
import { getStoredValue, setStoredValue } from '~/lib/storage';

const PairedTTestCalculator = () => {
  const [raw1, setRaw1] = createSignal(getStoredValue('stats.paired.sample1.raw', '12, 15, 11, 18, 14'));
  const [raw2, setRaw2] = createSignal(getStoredValue('stats.paired.sample2.raw', '9, 13, 10, 12, 8'));

  createEffect(() => setStoredValue('stats.paired.sample1.raw', raw1()));
  createEffect(() => setStoredValue('stats.paired.sample2.raw', raw2()));

  const parsed1 = createMemo(() => parseNumberInput(raw1()));
  const parsed2 = createMemo(() => parseNumberInput(raw2()));

  const results = createMemo(() => {
    const sample1 = parsed1().numbers;
    const sample2 = parsed2().numbers;

    if (sample1.length === 0 || sample2.length === 0 || sample1.length !== sample2.length || sample1.length < 2) return null;
    if (parsed1().errors > 0 || parsed2().errors > 0) return null;

    return calculatePairedTTest(sample1, sample2);
  });

  return (
    <div class="max-w-6xl w-full flex flex-col gap-8">
      <div class="flex flex-col space-y-4">
        <div class="grid grid-cols-1 lg:grid-cols-[1fr_384px] gap-6 items-stretch">
          
          {/* Inputs */}
          <div class="space-y-6">
            <TwoSampleContainer>
              <RawSampleInput
                title="Sample A"
                value={raw1()}
                onInput={setRaw1}
                parsed={parsed1()}
              />
              <RawSampleInput
                title="Sample B"
                value={raw2()}
                onInput={setRaw2}
                parsed={parsed2()}
              />
            </TwoSampleContainer>
          </div>

          {/* Results Side */}
          <div class="bg-white rounded-2xl shadow-sm border border-[#E6E4DD] p-6 flex flex-col justify-center">
            <Show when={results()} fallback={
              <div class="text-center text-[#8A847A] font-serif py-12">
                <Show when={parsed1().numbers.length !== parsed2().numbers.length && parsed1().numbers.length > 0 && parsed2().numbers.length > 0}>
                  <p class="text-[#A64635] mb-2">Sample sizes must be equal for a paired test.</p>
                </Show>
                Enter valid data (equal sample sizes, n ≥ 2) to see results.
              </div>
            }>
              <div class="space-y-4">
                <ResultItem label="t-score" value={format(results()!.t)} />
                <ResultItem label="Degrees of Freedom" value={format(results()!.df)} />
                <div class="border-t border-dotted border-[#E6E4DD] my-2"></div>
                <ResultItem label="Two-tailed P value" value={results()!.p < 0.0001 ? '< 0.0001' : format(results()!.p)} />
                <div class="border-t border-dotted border-[#E6E4DD] my-2"></div>
                <ResultItem 
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

const RawSampleInput = (props: { title: string, value: string, onInput: (v: string) => void, parsed: ParsedNumberInput }) => {
  let textareaRef: HTMLTextAreaElement | undefined;
  let backdropRef: HTMLDivElement | undefined;

  const handleScroll = () => {
    if (textareaRef && backdropRef) {
      backdropRef.scrollTop = textareaRef.scrollTop;
      backdropRef.scrollLeft = textareaRef.scrollLeft;
    }
  };

  const summaryText = () => {
    if (props.parsed.errors > 0 || props.parsed.numbers.length === 0) {
      return '-';
    }
    return `n=${props.parsed.numbers.length}`;
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

const ResultItem = (props: { label: JSX.Element | string, value: string | number }) => {
  const [copied, setCopied] = createSignal(false);

  const handleCopy = () => {
    const text = String(props.value).replace(/,/g, '');
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(err => {
        console.error('Failed to copy:', err);
      });
    }
  };

  return (
    <div class="flex items-center group">
      <button 
        onClick={handleCopy}
        class="mr-2 p-1 rounded hover:bg-[#F0EFEC] transition-colors text-[#8A847A] hover:text-[#2D2D2D] focus:outline-none"
        title="Copy value"
      >
        <Show when={copied()} fallback={<Copy size={14} class="opacity-0 group-hover:opacity-100 transition-opacity" />}>
          <Check size={14} class="text-[#5A7258]" />
        </Show>
      </button>
      <div class="flex-1 flex items-center justify-between">
        <span class="font-serif text-[#6B6255] text-sm">{props.label}</span>
        <span class="font-sans font-medium text-[#2D2D2D] text-sm">{props.value}</span>
      </div>
    </div>
  );
};

export default PairedTTestCalculator;
