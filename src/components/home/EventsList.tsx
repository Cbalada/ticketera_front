"use client";

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { useEvents } from '@/hooks/useEvents';
import { useSocket } from '@/providers/SocketProvider';
import { Event } from '@/types';

function formatDate(iso?: string) {
  if (!iso) return '-';
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export default function EventsList() {
  const qc = useQueryClient();
  const { data: events, isLoading } = useEvents();
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handler = () => qc.invalidateQueries({ queryKey: ['events'] });

    // Common event names for CRUD changes — backend may use different names,
    // listening to several likely ones to trigger refetch.
    socket.on('event:created', handler);
    socket.on('event:updated', handler);
    socket.on('event:deleted', handler);
    socket.on('events:changed', handler);

    return () => {
      socket.off('event:created', handler);
      socket.off('event:updated', handler);
      socket.off('event:deleted', handler);
      socket.off('events:changed', handler);
    };
  }, [socket, qc]);

  if (isLoading) {
    return <div>Cargando eventos...</div>;
  }

  if (!Array.isArray(events) || events.length === 0) {
    return <div>No hay eventos disponibles.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
      {events.map((event: Event, idx: number) => {
        // Render first as featured card, others as secondary for layout parity
        if (idx === 0) {
          return (
            <div key={event.id} className="md:col-span-8 relative rounded-xl overflow-hidden group h-[400px]">
              <Image
                src={event.imageUrl}
                alt={event.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8 w-full glass-panel border-0 bg-black/40">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-primary-fixed font-label-md bg-primary-fixed/20 px-3 py-1 rounded-full mb-3 inline-block">EVENTO</span>
                    <h3 className="font-display text-headline-lg uppercase mb-1">{event.title}</h3>
                    <p className="text-on-surface/80 flex items-center">
                      <span className="material-symbols-outlined text-sm mr-2">calendar_today</span>
                      {formatDate(event.date)}
                    </p>
                  </div>
                  <button className="bg-primary-fixed text-on-primary-fixed p-4 rounded-lg flex items-center justify-center transition-transform hover:scale-110 active:scale-95 shadow-lg">
                    <span className="material-symbols-outlined">confirmation_number</span>
                  </button>
                </div>
              </div>
            </div>
          );
        }

        return (
          <div key={event.id} className="md:col-span-4 relative rounded-xl overflow-hidden group h-[400px]">
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 w-full">
              <h4 className="font-display text-headline-md uppercase">{event.title}</h4>
              <p className="text-on-surface/80 text-sm">{formatDate(event.date)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
