"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createEvent, CreateEventDto } from '@/lib/eventsService';

export const useCreateEvent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateEventDto) => createEvent(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['events'] });
    },
  });
};
