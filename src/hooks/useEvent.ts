"use client";

import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { getEvent } from '@/lib/eventsService';
import { Event } from '@/types';

export const useEvent = (id: string | number | undefined): UseQueryResult<Event, Error> => {
  return useQuery<Event, Error>({
    queryKey: ['event', id],
    queryFn: ({ signal }) => getEvent(id!, { signal }),
    enabled: !!id,
  });
};
