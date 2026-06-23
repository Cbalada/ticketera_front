"use client";

import { formatCountdown } from '@/hooks/useCheckoutCountdown';

interface CheckoutCountdownProps {
  remainingMs: number | null;
  className?: string;
}

export function CheckoutCountdown({ remainingMs, className = '' }: CheckoutCountdownProps) {
  if (remainingMs === null) return null;

  const isUrgent = remainingMs <= 60 * 1000;

  return (
    <div
      className={`flex items-center gap-3 bg-surface-container-low/80 border border-white/10 rounded-lg px-4 py-3 ${className}`}
    >
      <span className="material-symbols-outlined text-primary-fixed text-[20px]">timer</span>
      <div className="flex flex-col">
        <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
          Tiempo restante para completar la compra
        </span>
        <span className={`font-headline-md text-headline-md font-bold ${isUrgent ? 'text-red-400' : 'text-primary-fixed'}`}>
          {formatCountdown(remainingMs)}
        </span>
      </div>
    </div>
  );
}
