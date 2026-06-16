import { create } from 'zustand';
import type { Reservation, EventSector } from '@/types';

interface ReservationState {
  selectedSector: EventSector | null;
  selectedQuantity: number;
  reservation: Reservation | null;
  expiresAt: string | null;
  setSelectedSector: (sector: EventSector | null) => void;
  setSelectedQuantity: (quantity: number) => void;
  setReservation: (reservation: Reservation | null) => void;
  clearStore: () => void;
}

export const useReservationStore = create<ReservationState>()((set) => ({
  selectedSector: null,
  selectedQuantity: 1,
  reservation: null,
  expiresAt: null,
  setSelectedSector: (sector) => set({ selectedSector: sector, selectedQuantity: 1 }),
  setSelectedQuantity: (quantity) => set({ selectedQuantity: quantity }),
  setReservation: (reservation) => set({ 
    reservation, 
    expiresAt: reservation?.expiresAt || null 
  }),
  clearStore: () => set({
    selectedSector: null,
    selectedQuantity: 1,
    reservation: null,
    expiresAt: null,
  })
}));
