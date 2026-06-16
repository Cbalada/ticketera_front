import { create } from 'zustand';
import type { Purchase } from '@/types';

interface PurchaseState {
  currentPurchase: Purchase | null;
  purchaseHistory: Purchase[];
  setCurrentPurchase: (purchase: Purchase | null) => void;
  setPurchaseHistory: (history: Purchase[]) => void;
  clearCurrentPurchase: () => void;
}

export const usePurchaseStore = create<PurchaseState>()((set) => ({
  currentPurchase: null,
  purchaseHistory: [],
  setCurrentPurchase: (purchase) => set({ currentPurchase: purchase }),
  setPurchaseHistory: (history) => set({ purchaseHistory: history }),
  clearCurrentPurchase: () => set({ currentPurchase: null }),
}));
