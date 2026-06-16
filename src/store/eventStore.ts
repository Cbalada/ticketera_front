import { create } from 'zustand';
import type { Event } from '@/types';

interface EventFilters {
  search?: string;
  date?: string;
}

interface EventState {
  selectedEvent: Event | null;
  filters: EventFilters;
  setSelectedEvent: (event: Event | null) => void;
  setFilters: (filters: Partial<EventFilters>) => void;
  clearFilters: () => void;
}

export const useEventStore = create<EventState>()((set) => ({
  selectedEvent: null,
  filters: {},
  setSelectedEvent: (event) => set({ selectedEvent: event }),
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  clearFilters: () => set({ filters: {} }),
}));
