import { create } from 'zustand';
import type { Reservation, EventSector } from '@/types';

interface ReservationState {
  selectedSector: EventSector | null;
  selectedQuantity: number;
  selectedSectors: Record<number, number>;
  selectedEventId: string | number | null;
  reservation: Reservation | null;
  reservations: Reservation[];
  expiresAt: string | null;
  setSelectedSector: (sector: EventSector | null) => void;
  setSelectedQuantity: (quantity: number) => void;
  setSectorQuantity: (sectorId: number, quantity: number) => void;
  setSelectedEventId: (id: string | number | null) => void;
  clearSelectedSectors: () => void;
  setReservation: (reservation: Reservation | null) => void;
  setReservations: (reservations: Reservation[]) => void;
  clearStore: () => void;
}

function earliestExpiresAt(reservations: Reservation[]): string | null {
  if (reservations.length === 0) return null;
  return reservations.reduce<string | null>((earliest, r) => {
    if (!earliest || new Date(r.expiresAt) < new Date(earliest)) return r.expiresAt;
    return earliest;
  }, null);
}

export const useReservationStore = create<ReservationState>()((set) => ({
  selectedSector: null,
  selectedQuantity: 1,
  selectedSectors: {},
  selectedEventId: null,
  reservation: null,
  reservations: [],
  expiresAt: null,
  setSelectedSector: (sector) => set({ selectedSector: sector, selectedQuantity: 1 }),
  setSelectedQuantity: (quantity) => set({ selectedQuantity: quantity }),
  setSectorQuantity: (sectorId, quantity) =>
    set((state) => ({ selectedSectors: { ...state.selectedSectors, [sectorId]: quantity } })),
  setSelectedEventId: (id) => set({ selectedEventId: id }),
  clearSelectedSectors: () => set({ selectedSectors: {} }),
  setReservation: (reservation) =>
    set({
      reservation,
      reservations: reservation ? [reservation] : [],
      expiresAt: reservation?.expiresAt || null,
    }),
  setReservations: (reservations) =>
    set({
      reservations,
      reservation: reservations[0] ?? null,
      expiresAt: earliestExpiresAt(reservations),
    }),
  clearStore: () =>
    set({
      selectedSector: null,
      selectedQuantity: 1,
      selectedSectors: {},
      selectedEventId: null,
      reservation: null,
      reservations: [],
      expiresAt: null,
    }),
}));
