"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteEvent } from '@/lib/eventsService';

export const useDeleteEvent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteEvent(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['events'] });
    },
  });
};
