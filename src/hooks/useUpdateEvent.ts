"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateEvent, CreateEventDto } from '@/lib/eventsService';

// Mutation accepts an object with id and data so caller can provide id at call time
export const useUpdateEvent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateEventDto }) => updateEvent(id, data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['events'] });
      if (variables?.id) qc.invalidateQueries({ queryKey: ['event', variables.id] });
    },
  });
};
