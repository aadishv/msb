import { For, Show } from 'solid-js';
import { AlertCircle, CheckCircle2 } from 'lucide-solid';
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
    <div class="p-6 flex flex-col min-h-[320px]">
      <div class="flex items-center justify-between border-b border-[#F0EFEC] pb-2">
        <h3 class="font-serif text-[#2D2D2D] font-medium">{props.title}</h3>
        <Show when={props.canRemove && props.onRemove}>
          <button
            onClick={props.onRemove}
            class="px-2 py-1 text-xs rounded-md bg-[#F9EBE9] text-[#A64635] hover:bg-[#F3DCD6] transition-colors"
          >
            Remove
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
              <span
                class={
                  token.type === 'valid'
                    ? 'bg-[#E3E1DC] rounded-sm shadow-[0_0_0_1px_#D1CFCA]'
                    : token.type === 'error'
                      ? 'bg-[#F3DCD6] rounded-sm shadow-[0_0_0_1px_#E5BDB5]'
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
          class="absolute inset-0 w-full h-full p-3 bg-transparent text-[#393939] caret-black resize-none border-none outline-none focus:ring-0 z-10 whitespace-pre-wrap break-words overflow-auto font-mono text-sm leading-relaxed"
          placeholder={props.placeholder ?? 'Enter data...'}
        />
      </div>

      <div class="mt-4 pt-3 border-t border-[#F0EFEC] flex items-center justify-between gap-2 text-xs">
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
              <span class="font-medium font-serif">
                {props.parsed.errors} error{props.parsed.errors > 1 ? 's' : ''}
              </span>
            </div>
          </Show>
        </div>
        <div class="text-[#8A847A] font-serif text-right">{props.summary}</div>
      </div>
    </div>
  );
}
