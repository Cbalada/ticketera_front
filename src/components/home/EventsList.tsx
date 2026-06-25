"use client";

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
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

  if (isLoading) return <div>Cargando eventos...</div>;

  if (!Array.isArray(events) || events.length === 0) return <div>No hay eventos disponibles.</div>;

  function formatDateTime(iso?: string) {
    if (!iso) return { date: '-', time: '-' };
    try {
      const d = new Date(iso);
      return {
        date: d.toLocaleDateString(),
        time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
    } catch {
      return { date: iso, time: '' };
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {events.map((event: Event) => {
        const dt = formatDateTime(event.date);
        return (
          <Link key={event.id} href={`/events/${event.id}`} className="block rounded-xl overflow-hidden group bg-surface-container">
            <div className="relative w-full aspect-[3/2] bg-gray-800">
              <Image
                src={event.imageUrl || '/images/event-placeholder.svg'}
                alt={event.title || 'Evento'}
                fill
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-4">
              <h3 className="font-display text-headline-md mb-1 line-clamp-2">{event.title}</h3>
              <div className="text-on-surface-variant text-sm flex items-center gap-3">
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                  <span>{dt.date}</span>
                </span>
               <span className="flex items-center gap-2">
                <span>Show {dt.time} hs</span>
              </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
