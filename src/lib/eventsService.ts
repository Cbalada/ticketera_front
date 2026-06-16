import { fetchClient } from '@/lib/fetchClient';
import { Event, Sector } from '@/types';

export interface CreateEventDto {
  title: string;
  description: string;
  imageUrl: string;
  date: string; // ISO
  sectors: {
    sector: Sector;
    price: number;
    capacity: number;
  }[];
}

export const getEvents = async (): Promise<Event[]> => {
  return fetchClient<Event[]>('/events');
};

export const createEvent = async (data: CreateEventDto): Promise<Event> => {
  return fetchClient<Event>('/events', { data });
};

export const updateEvent = async (id: number, data: CreateEventDto): Promise<Event> => {
  return fetchClient<Event>(`/events/${id}`, { data, method: 'PATCH' });
};

export const deleteEvent = async (id: number): Promise<void> => {
  return fetchClient(`/events/${id}`, { method: 'DELETE' });
};
