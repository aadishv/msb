import { createEffect, For, onMount, Show } from 'solid-js';
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
  let containerRef: HTMLDivElement | undefined;
  let textareaRef: HTMLTextAreaElement | undefined;
  let backdropRef: HTMLDivElement | undefined;

  const resizeTextarea = () => {
    if (!textareaRef || !containerRef || !backdropRef) return;
    textareaRef.style.height = '0px';
    const height = `${Math.max(160, textareaRef.scrollHeight)}px`;
    textareaRef.style.height = height;
    containerRef.style.height = height;
    backdropRef.style.height = height;
  };

  createEffect(() => {
    props.value;
    queueMicrotask(resizeTextarea);
  });

  onMount(resizeTextarea);

  return (
    <div class="flex flex-col">
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs" style="color: var(--muted)">{props.title}</span>
        <Show when={props.canRemove && props.onRemove}>
          <button onClick={props.onRemove} class="text-xs transition-colors" style="color: var(--muted)" onMouseOver={e => (e.currentTarget.style.color = 'var(--error-text)')} onMouseOut={e => (e.currentTarget.style.color = 'var(--muted)')}>remove</button>
        </Show>
      </div>

      <div ref={containerRef} class="relative font-mono text-sm leading-relaxed min-h-[160px]">
        <div
          ref={backdropRef}
          class="absolute inset-0 p-0 whitespace-pre-wrap break-words overflow-hidden pointer-events-none z-0 text-transparent"
          aria-hidden="true"
        >
          <For each={props.parsed.tokens}>
            {(token) => (
              <span style={token.type === 'valid' ? 'background:var(--input-highlight);border-radius:2px' : token.type === 'error' ? 'background:var(--input-error);border-radius:2px' : ''}>
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
          spellcheck={false}
          class="absolute inset-0 w-full p-0 bg-transparent resize-none border-none outline-none z-10 whitespace-pre-wrap break-words overflow-hidden font-mono text-sm leading-relaxed"
          style="color: var(--fg); caret-color: var(--caret)"
          placeholder={props.placeholder ?? 'Enter data...'}
        />
      </div>

      <div class="mt-3 flex items-center justify-between text-xs">
        <Show when={props.parsed.errors > 0} fallback={<span style="color: var(--valid-text)">{props.parsed.numbers.length > 0 ? 'valid' : ''}</span>}>
          <span style="color: var(--error-text)">{props.parsed.errors} error{props.parsed.errors > 1 ? 's' : ''}</span>
        </Show>
        <span style="color: var(--muted)">{props.summary}</span>
      </div>
    </div>
  );
}
