import { createSignal, JSX } from 'solid-js';

interface StatResultProps {
  label: JSX.Element | string;
  value: string | number;
  showBorder?: boolean;
}

export const StatResult = (props: StatResultProps) => {
  const [copied, setCopied] = createSignal(false);

  const handleCopy = () => {
    const text = String(props.value).replace(/,/g, '');
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div class="flex items-baseline justify-between py-1 group cursor-default" onClick={handleCopy}>
      <span class="text-sm" style="color: var(--muted)">{props.label}</span>
      <span class="text-sm font-mono ml-8 transition-colors" style={copied() ? 'color: var(--valid-text)' : 'color: var(--fg)'}>
        {copied() ? 'copied' : props.value}
      </span>
    </div>
  );
};
