import { fetchClient } from '@/lib/fetchClient';
import type { Reservation } from '@/types';

export interface CreateReservationDto {
  eventSectorId: number;
  quantity: number;
}

export const createReservation = async (data: CreateReservationDto): Promise<Reservation> => {
  return fetchClient<Reservation>('/reservations', { data });
};

export const getMyReservations = async (): Promise<Reservation[]> => {
  return fetchClient<Reservation[]>('/reservations/my-reservations');
};
