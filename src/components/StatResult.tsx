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
        setTimeout(() => setCopied(false), 2000);
      }).catch(err => {
        console.error('Failed to copy:', err);
      });
    }
  };

  return (
    <div class={`flex items-center justify-between group ${props.showBorder ? 'border-b border-dotted border-[#E6E4DD] pb-1 last:border-0' : ''}`}>
      <span class="font-serif text-[#6B6255] text-sm">{props.label}</span>
      <div class="flex items-center">
        <span class="font-sans font-medium text-[#2D2D2D] text-sm">{props.value}</span>
        <button 
          onClick={handleCopy}
          class="ml-2 p-1 rounded hover:bg-[#F0EFEC] transition-colors text-[#8A847A] hover:text-[#2D2D2D] focus:outline-none"
          title="Copy value"
        >
          <Show when={copied()} fallback={<Copy size={14} class="opacity-0 group-hover:opacity-100 transition-opacity" />}>
            <Check size={14} class="text-[#5A7258]" />
          </Show>
        </button>
      </div>
    </div>
  );
};
