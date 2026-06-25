"use client";

import { useQuery } from '@tanstack/react-query';
import { getUserPurchases } from '@/lib/purchasesService';
import type { Purchase } from '@/types';

export function usePurchases() {
  return useQuery<Purchase[], Error>({
    queryKey: ['purchases'],
    queryFn: getUserPurchases,
  });
}
