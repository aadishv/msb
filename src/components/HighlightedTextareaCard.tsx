import { For, Show } from 'solid-js';
import type { ParsedNumberInput } from '~/lib/stats';

interface HighlightedTextareaCardProps {
  title: string;
  value: string;
  onInput: (value: string) => void;
  parsed: ParsedNumberInput;
  summary: string;
  placeholder?: string;
  onRemove?: () => void;
  canRemove?: boolean;
}

export default function HighlightedTextareaCard(props: HighlightedTextareaCardProps) {
  let textareaRef: HTMLTextAreaElement | undefined;
  let backdropRef: HTMLDivElement | undefined;

  const handleScroll = () => {
    if (textareaRef && backdropRef) {
      backdropRef.scrollTop = textareaRef.scrollTop;
      backdropRef.scrollLeft = textareaRef.scrollLeft;
    }
  };

  return (
    <div class="p-3 flex flex-col min-h-[200px]">
      <div class="flex items-center justify-between pb-2 mb-1">
        <span class="text-[10px] font-medium uppercase tracking-wider text-[#999]">{props.title}</span>
        <Show when={props.canRemove && props.onRemove}>
          <button
            onClick={props.onRemove}
            class="text-[10px] text-[#999] hover:text-[#c00] transition-colors"
          >
            Remove
          </button>
        </Show>
      </div>

      <div class="relative w-full flex-1 font-mono text-sm leading-relaxed">
        <div
          ref={backdropRef}
          class="absolute inset-0 w-full h-full p-1 whitespace-pre-wrap break-words overflow-hidden pointer-events-none z-0 text-transparent"
          aria-hidden="true"
        >
          <For each={props.parsed.tokens}>
            {(token) => (
              <span
                class={
                  token.type === 'valid'
                    ? 'bg-[#E8E8E8] rounded-sm'
                    : token.type === 'error'
                      ? 'bg-[#FFD9D9] rounded-sm'
                      : ''
                }
              >
                {token.content}
              </span>
            )}
          </For>
          <Show when={props.value.endsWith('\n')}><br /></Show>
        </div>

        <textarea
          ref={textareaRef}
          value={props.value}
          onInput={(event) => props.onInput(event.currentTarget.value)}
          onScroll={handleScroll}
          spellcheck={false}
          class="absolute inset-0 w-full h-full p-1 bg-transparent text-[#111] caret-black resize-none border-none outline-none focus:ring-0 z-10 whitespace-pre-wrap break-words overflow-auto font-mono text-sm leading-relaxed"
          placeholder={props.placeholder ?? 'Enter data...'}
        />
      </div>

      <div class="mt-3 pt-2 border-t border-[#F0F0F0] flex items-center justify-between gap-2 text-[10px]">
        <Show
          when={props.parsed.errors > 0}
          fallback={<span class="text-[#5A9] font-mono">{props.parsed.numbers.length > 0 ? 'valid' : ''}</span>}
        >
          <span class="text-[#c00] font-mono">{props.parsed.errors} error{props.parsed.errors > 1 ? 's' : ''}</span>
        </Show>
        <span class="text-[#AAA] font-mono">{props.summary}</span>
      </div>
    </div>
  );
}
