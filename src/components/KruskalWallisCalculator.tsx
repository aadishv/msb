import { createSignal, createMemo, Show, createEffect, For, Index } from 'solid-js';
import { AlertCircle, CheckCircle2, Plus, Trash2 } from 'lucide-solid';
import { format, parseNumberInput, calculateSampleSummary, ParsedNumberInput, calculateKruskalWallis } from '~/lib/stats';
import { getStoredValue, setStoredValue } from '~/lib/storage';
import { StatResult } from './StatResult';

interface SampleData {
  id: string;
  value: string;
}

const generateId = () => Math.random().toString(36).substring(2, 11);

const KruskalWallisCalculator = () => {
  const defaultSamples: SampleData[] = [
    { id: generateId(), value: '10, 12, 11, 13, 11' },
    { id: generateId(), value: '14, 15, 13, 16, 14' },
    { id: generateId(), value: '18, 17, 19, 17, 18' },
  ];

  const [samples, setSamples] = createSignal<SampleData[]>(getStoredValue('stats.kruskal.samples', defaultSamples));

  createEffect(() => {
    setStoredValue('stats.kruskal.samples', samples());
  });

  const addSample = () => {
    setSamples([...samples(), { id: generateId(), value: '' }]);
  };

  const removeSample = (id: string) => {
    if (samples().length <= 2) return;
    setSamples(samples().filter(s => s.id !== id));
  };

  const updateSampleValue = (id: string, value: string) => {
    setSamples(samples().map(s => s.id === id ? { ...s, value } : s));
  };

  const parsedSamples = createMemo(() => {
    return samples().map(s => ({
      ...s,
      parsed: parseNumberInput(s.value),
      summary: calculateSampleSummary(parseNumberInput(s.value).numbers)
    }));
  });

  const results = createMemo(() => {
    const data = parsedSamples()
      .map(s => s.parsed.numbers)
      .filter(n => n.length > 0);
    
    if (data.length < 2) return null;

    return calculateKruskalWallis(data);
  });

  return (
    <div class="max-w-6xl w-full flex flex-col gap-8">
      <div class="flex flex-col space-y-4">
        <div class="grid grid-cols-1 lg:grid-cols-[1fr_384px] gap-6 items-stretch">
          {/* Inputs */}
          <div class="space-y-6">
            <div class="bg-white rounded-2xl shadow-sm border border-[#E6E4DD] overflow-hidden">
              <div class="flex flex-wrap divide-[#E6E4DD] border-b border-[#E6E4DD]">
                <Index each={parsedSamples()}>
                  {(sample, index) => (
                    <div class="flex-1 min-w-[300px] border-r border-b last:border-r-0 border-[#E6E4DD]">
                      <RawSampleInput
                        title={`Sample ${index + 1}`}
                        value={sample().value}
                        onInput={(v) => updateSampleValue(sample().id, v)}
                        onRemove={() => removeSample(sample().id)}
                        canRemove={samples().length > 2}
                        parsed={sample().parsed}
                        summary={sample().summary}
                      />
                    </div>
                  )}
                </Index>
              </div>
              <div class="p-4 bg-[#F9F9F8] flex justify-center">
                <button 
                  onClick={addSample}
                  class="flex items-center space-x-2 px-4 py-2 bg-white border border-[#D1CFCA] rounded-xl text-sm font-serif text-[#2D2D2D] hover:bg-[#F5F4EF] transition-colors shadow-sm"
                >
                  <Plus size={16} />
                  <span>Add Sample</span>
                </button>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl shadow-sm border border-[#E6E4DD] p-6 flex flex-col justify-center">
            <Show when={results()} fallback={
              <div class="text-center text-[#8A847A] font-serif py-12">
                Enter data for at least two samples to see Kruskal-Wallis results.
              </div>
            }>
              {(res) => (
                <div class="space-y-4">
                  <StatResult label="H-statistic" value={format(res().h)} />
                  <div class="border-t border-dotted border-[#E6E4DD] my-2"></div>
                  <StatResult label="df" value={res().df} />
                  <div class="border-t border-dotted border-[#E6E4DD] my-2"></div>
                  <StatResult label="P value" value={res().p < 0.0001 ? '< 0.0001' : format(res().p)} />
                </div>
              )}
            </Show>
          </div>
        </div>
      </div>
    </div>
  );
};

const RawSampleInput = (props: { 
  title: string, 
  value: string, 
  onInput: (v: string) => void, 
  onRemove: () => void,
  canRemove: boolean,
  parsed: ParsedNumberInput, 
  summary: { mean: number; sd: number; n: number } | null 
}) => {
  let textareaRef: HTMLTextAreaElement | undefined;
  let backdropRef: HTMLDivElement | undefined;

  const handleScroll = () => {
    if (textareaRef && backdropRef) {
      backdropRef.scrollTop = textareaRef.scrollTop;
      backdropRef.scrollLeft = textareaRef.scrollLeft;
    }
  };

  const summaryText = () => {
    if (!props.summary || props.parsed.errors > 0 || props.summary.n === 0) {
      return '-';
    }
    return `n=${props.summary.n}`;
  };

  return (
    <div class="p-6 flex flex-col min-h-[280px]">
      <div class="flex items-center justify-between border-b border-[#F0EFEC] pb-2">
        <h3 class="font-serif text-[#2D2D2D] font-medium">{props.title}</h3>
        <Show when={props.canRemove}>
          <button 
            onClick={props.onRemove}
            class="p-1.5 text-[#8A847A] hover:text-[#A64635] hover:bg-[#F9EBE9] rounded-md transition-colors"
            title="Remove sample"
          >
            <Trash2 size={16} />
          </button>
        </Show>
      </div>
      <div class="relative w-full flex-1 font-mono text-sm leading-relaxed mt-4">
        <div 
          ref={backdropRef}
          class="absolute inset-0 w-full h-full p-3 whitespace-pre-wrap break-words overflow-hidden pointer-events-none z-0 text-transparent"
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
          class="absolute inset-0 w-full h-full p-3 bg-transparent text-[#393939] caret-black resize-none border-none outline-none focus:ring-0 z-10 whitespace-pre-wrap break-words overflow-auto font-mono text-sm leading-relaxed"
          placeholder="Enter data..."
        />
      </div>

      <div class="mt-4 pt-3 border-t border-[#F0EFEC] flex items-center justify-between text-xs">
        <div class="flex items-center space-x-2">
          <Show 
            when={props.parsed.errors > 0} 
            fallback={
              <div class="flex items-center text-[#5A7258] bg-[#E9F0E9] px-2 py-0.5 rounded-md">
                <CheckCircle2 size={12} class="mr-1.5" />
                <span class="font-medium font-serif">All data valid</span>
              </div>
            }
          >
            <div class="flex items-center text-[#A64635] bg-[#F9EBE9] px-2 py-0.5 rounded-md">
              <AlertCircle size={12} class="mr-1.5" />
              <span class="font-medium font-serif">{props.parsed.errors} error{props.parsed.errors > 1 ? 's' : ''}</span>
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

export default KruskalWallisCalculator;
