"use client";

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useReservationStore } from '@/store/reservationStore';

export function formatCountdown(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

interface UseCheckoutCountdownOptions {
  onExpire?: () => void;
}

export function useCheckoutCountdown(options: UseCheckoutCountdownOptions = {}) {
  const router = useRouter();
  const { expiresAt, clearStore } = useReservationStore();
  const [remainingMs, setRemainingMs] = useState<number | null>(null);
  const onExpireRef = useRef(options.onExpire);
  onExpireRef.current = options.onExpire;

  useEffect(() => {
    if (!expiresAt) {
      setRemainingMs(null);
      return;
    }

    const tick = () => {
      const ms = new Date(expiresAt).getTime() - Date.now();
      if (ms <= 0) {
        clearStore();
        onExpireRef.current?.();
        router.push('/checkout/timeout');
        return;
      }
      setRemainingMs(ms);
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, clearStore, router]);

  return { remainingMs, expiresAt };
}
