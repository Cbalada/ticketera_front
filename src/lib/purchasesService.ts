import { fetchClient } from '@/lib/fetchClient';
import type { Purchase } from '@/types';

export interface CreatePurchaseDto {
  reservationId: number;
}

export const createPurchase = async (data: CreatePurchaseDto): Promise<Purchase> => {
  return fetchClient<Purchase>('/purchases', { data });
};
