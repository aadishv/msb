import { createSignal, createMemo, For, Show, createEffect } from 'solid-js';
import { AlertCircle, CheckCircle2 } from 'lucide-solid';
import { calculateStats, format, parseNumberInput } from '~/lib/stats';
import { getStoredValue, setStoredValue } from '~/lib/storage';

const DataInputEditor = () => {
  const [value, setValue] = createSignal(getStoredValue('stats.general.data', '10.5, 20\n-5.2  42\n100'));
  const [isPopulation, setIsPopulation] = createSignal(getStoredValue('stats.general.population', true));
  let textareaRef: HTMLTextAreaElement | undefined;
  let backdropRef: HTMLDivElement | undefined;

  const handleScroll = () => {
    if (textareaRef && backdropRef) {
      backdropRef.scrollTop = textareaRef.scrollTop;
      backdropRef.scrollLeft = textareaRef.scrollLeft;
    }
  };

  createEffect(() => {
    setStoredValue('stats.general.data', value());
  });

  createEffect(() => {
    setStoredValue('stats.general.population', isPopulation());
  });

  const parsed = createMemo(() => parseNumberInput(value()));
  const stats = createMemo(() => calculateStats(parsed().numbers, isPopulation()));

  return (
    <div class="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-[1fr_384px] gap-x-6 gap-y-4 items-stretch">
      
      {/* Toggle Area */}
      <div class="col-start-1">
        <div class="flex p-1 bg-[#E6E4DD] rounded-xl border border-[#D1CFCA] w-fit">
          <button 
            onClick={() => setIsPopulation(true)}
            class={`px-4 py-1.5 text-sm font-serif rounded-lg transition-all ${isPopulation() ? 'bg-white text-[#2D2D2D] shadow-sm' : 'text-[#6B6255] hover:text-[#393939]'}`}
          >
            Population
          </button>
          <button 
            onClick={() => setIsPopulation(false)}
            class={`px-4 py-1.5 text-sm font-serif rounded-lg transition-all ${!isPopulation() ? 'bg-white text-[#2D2D2D] shadow-sm' : 'text-[#6B6255] hover:text-[#393939]'}`}
          >
            Sample
          </button>
        </div>
      </div>

      {/* Empty space in grid for desktop to keep toggle on left */}
      <div class="hidden lg:block"></div>

      {/* Left Side: Editor */}
      <div class="bg-white rounded-2xl shadow-sm border border-[#E6E4DD] overflow-hidden flex flex-col min-h-[600px]">
        <div class="p-6 relative flex-1 flex flex-col">
          <div class="relative w-full flex-1 font-mono text-base leading-relaxed">
            <div 
              ref={backdropRef}
              class="absolute inset-0 w-full h-full p-4 whitespace-pre-wrap break-words overflow-hidden pointer-events-none z-0 text-transparent"
              aria-hidden="true"
            >
              <For each={parsed().tokens}>
                {(token) => (
                  <span class={
                    token.type === 'valid' ? "bg-[#E3E1DC] rounded-sm shadow-[0_0_0_1px_#D1CFCA]" : 
                    token.type === 'error' ? "bg-[#F3DCD6] rounded-sm shadow-[0_0_0_1px_#E5BDB5]" : ""
                  }>
                    {token.content}
                  </span>
                )}
              </For>
              <Show when={value().endsWith('\n')}><br /></Show>
            </div>

            <textarea
              ref={textareaRef}
              value={value()}
              onInput={(e) => setValue(e.currentTarget.value)}
              onScroll={handleScroll}
              spellcheck={false}
              class="absolute inset-0 w-full h-full p-4 bg-transparent text-[#393939] caret-black resize-none border-none outline-none focus:ring-0 z-10 whitespace-pre-wrap break-words overflow-auto font-mono text-base leading-relaxed"
              placeholder="Enter data..."
            />
          </div>

          <div class="mt-4 pt-4 border-t border-[#F0EFEC] flex items-center justify-between text-sm">
            <div class="flex items-center space-x-2">
              <Show 
                when={parsed().errors > 0} 
                fallback={
                  <div class="flex items-center text-[#5A7258] bg-[#E9F0E9] px-2 py-1 rounded-md">
                    <CheckCircle2 size={16} class="mr-2" />
                    <span class="font-medium font-serif">All data valid</span>
                  </div>
                }
              >
                <div class="flex items-center text-[#A64635] bg-[#F9EBE9] px-2 py-1 rounded-md">
                  <AlertCircle size={16} class="mr-2" />
                  <span class="font-medium font-serif">{parsed().errors} parsing error{parsed().errors > 1 ? 's' : ''}</span>
                </div>
              </Show>
            </div>
            <div class="text-[#8A847A] font-serif">
               {value().length} chars
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Results */}
      <div class="bg-white rounded-2xl shadow-sm border border-[#E6E4DD] p-6 flex flex-col justify-center">
        <div class="space-y-3.5">
          <StatItem label={isPopulation() ? "Population size" : "Sample size"} value={stats().count} />
          <StatItem label={isPopulation() ? "Mean (μ)" : "Mean (x̄)"} value={format(stats().mean)} />
          <StatItem label="Median" value={format(stats().median)} />
          <StatItem label="Mode" value={stats().mode} />
          <StatItem label="Lowest value" value={format(stats().min)} />
          <StatItem label="Highest value" value={format(stats().max)} />
          <StatItem label="Range" value={format(stats().range)} />
          <StatItem label="Interquartile range" value={format(stats().iqr)} />
          <StatItem label="First quartile" value={format(stats().q1)} />
          <StatItem label="Third quartile" value={format(stats().q3)} />
          <StatItem label={isPopulation() ? "Variance (σ²)" : "Variance (s²)"} value={format(stats().variance)} />
          <StatItem label={isPopulation() ? "Std dev (σ)" : "Std dev (s)"} value={format(stats().stdDev)} />
          <StatItem label="Quartile deviation" value={format(stats().qd)} />
          <StatItem label="Mean absolute deviation" value={format(stats().mad)} />
        </div>
      </div>
    </div>
  );
};

const StatItem = (props: { label: string, value: string | number }) => (
  <div class="flex items-center justify-between border-b border-dotted border-[#E6E4DD] pb-1 last:border-0">
    <span class="font-serif text-[#6B6255] text-sm">{props.label}</span>
    <span class="font-sans font-medium text-[#2D2D2D] text-sm">{props.value}</span>
  </div>
);

export default DataInputEditor;
