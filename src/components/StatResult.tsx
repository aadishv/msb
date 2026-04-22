import { createSignal, Show, JSX } from 'solid-js';
import { Copy, Check } from 'lucide-solid';

interface StatResultProps {
  label: JSX.Element | string;
  value: string | number;
  showBorder?: boolean;
}

export const StatResult = (props: StatResultProps) => {
  const [copied, setCopied] = createSignal(false);

  const handleCopy = () => {
    const text = String(props.value).replace(/,/g, '');
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }).catch(err => {
        console.error('Failed to copy:', err);
      });
    }
  };

  return (
    <div class={`flex items-center justify-between group py-1 ${props.showBorder ? 'border-b border-[#F0F0F0]' : ''}`}>
      <span class="text-[11px] text-[#888]">{props.label}</span>
      <div class="flex items-center gap-1">
        <span class="font-mono text-[13px] text-[#111]">{props.value}</span>
        <button
          onClick={handleCopy}
          class="p-0.5 text-[#CCC] hover:text-[#555] transition-colors focus:outline-none opacity-0 group-hover:opacity-100"
          title="Copy"
        >
          <Show when={copied()} fallback={<Copy size={11} />}>
            <Check size={11} class="text-[#5A9]" />
          </Show>
        </button>
      </div>
    </div>
  );
};
