'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Copies `text` to the clipboard. The Clipboard API can be refused (no
 * permission, insecure context, old browser), so the label only changes on
 * success; the visible mailto link next to it is the fallback.
 * aria-live="polite" makes screen readers announce "Copied" without
 * interrupting whatever they're reading.
 */
export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      return;
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-live="polite"
      className="inline-flex min-h-11 cursor-pointer items-center rounded-full border border-rule-strong bg-transparent px-4 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent"
    >
      {copied ? 'Copied' : 'Copy address'}
    </button>
  );
}
