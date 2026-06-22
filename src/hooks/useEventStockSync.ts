"use client";

import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useEventSubscription } from '@/hooks/useEventSubscription';
import type { Event } from '@/types';

export function useEventStockSync(eventId: string | number | undefined) {
  const queryClient = useQueryClient();

  const onStockUpdated = useCallback(
    (payload: { sector: string; availableQuantity: number }) => {
      queryClient.setQueryData<Event>(['event', eventId], (old) => {
        if (!old) return old;
        return {
          ...old,
          sectors: old.sectors.map((s) =>
            s.sector === payload.sector
              ? { ...s, availableQuantity: payload.availableQuantity }
              : s
          ),
        };
      });
    },
    [queryClient, eventId]
  );

  useEventSubscription(eventId, { onStockUpdated });
}
