import { create } from 'zustand';
import { CHECKOUT_TTL_MS } from '@/lib/checkoutConstants';
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
  startCheckoutTimer: () => void;
  clearStore: () => void;
}

function pickEarliestExpiresAt(...candidates: (string | null | undefined)[]): string | null {
  const valid = candidates.filter((c): c is string => !!c);
  if (valid.length === 0) return null;
  return valid.reduce((earliest, current) =>
    new Date(current) < new Date(earliest) ? current : earliest
  );
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
    set((state) => ({
      reservations,
      reservation: reservations[0] ?? null,
      expiresAt: pickEarliestExpiresAt(state.expiresAt, earliestExpiresAt(reservations)),
    })),
  startCheckoutTimer: () =>
    set((state) => {
      if (state.expiresAt && new Date(state.expiresAt) > new Date()) {
        return state;
      }
      return {
        expiresAt: new Date(Date.now() + CHECKOUT_TTL_MS).toISOString(),
      };
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
