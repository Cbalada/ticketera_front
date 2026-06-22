import { create } from 'zustand';
import type { Reservation, EventSector } from '@/types';

interface ReservationState {
  selectedSector: EventSector | null;
  selectedQuantity: number;
  selectedSectors: Record<number, number>; // sectorId -> quantity
  selectedEventId: string | number | null;
  reservation: Reservation | null;
  expiresAt: string | null;
  setSelectedSector: (sector: EventSector | null) => void;
  setSelectedQuantity: (quantity: number) => void;
  setSectorQuantity: (sectorId: number, quantity: number) => void;
  setSelectedEventId: (id: string | number | null) => void;
  clearSelectedSectors: () => void;
  setReservation: (reservation: Reservation | null) => void;
  clearStore: () => void;
}

export const useReservationStore = create<ReservationState>()((set) => ({
  selectedSector: null,
  selectedQuantity: 1,
  selectedSectors: {},
  selectedEventId: null,
  reservation: null,
  expiresAt: null,
  setSelectedSector: (sector) => set({ selectedSector: sector, selectedQuantity: 1 }),
  setSelectedQuantity: (quantity) => set({ selectedQuantity: quantity }),
  setSectorQuantity: (sectorId, quantity) => set((state) => ({ selectedSectors: { ...state.selectedSectors, [sectorId]: quantity } })),
  setSelectedEventId: (id) => set({ selectedEventId: id }),
  clearSelectedSectors: () => set({ selectedSectors: {} }),
  setReservation: (reservation) => set({ 
    reservation, 
    expiresAt: reservation?.expiresAt || null 
  }),
  clearStore: () => set({
    selectedSector: null,
    selectedQuantity: 1,
    selectedSectors: {},
    selectedEventId: null,
    reservation: null,
    expiresAt: null,
  })
}));
