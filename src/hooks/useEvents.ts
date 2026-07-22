"use client";

import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { getEvents } from '@/lib/eventsService';
import { Event } from '@/types';

export const useEvents = (): UseQueryResult<Event[], Error> => {
  return useQuery<Event[], Error, Event[], readonly ['events']>({
    queryKey: ['events'],
    queryFn: async (): Promise<Event[]> => getEvents(),
  });
};
