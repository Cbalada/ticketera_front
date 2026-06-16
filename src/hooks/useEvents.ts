"use client";

import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { getEvents } from '@/lib/eventsService';
import { Event } from '@/types';

export const useEvents = (): UseQueryResult<Event[], Error> => {
  return useQuery<Event[], Error>({
    queryKey: ['events'],
    queryFn: getEvents,
    suspense: false,
  });
};
