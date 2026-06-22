"use client";

import { useEffect, useRef } from 'react';
import { useSocket } from '@/providers/SocketProvider';
import type {
  PurchaseCompletedPayload,
  ReservationCreatedPayload,
  StockPayload,
} from '@/types';

interface EventSubscriptionHandlers {
  onStockUpdated?: (payload: StockPayload) => void;
  onReservationCreated?: (payload: ReservationCreatedPayload) => void;
  onReservationExpired?: (payload: ReservationCreatedPayload) => void;
  onPurchaseCompleted?: (payload: PurchaseCompletedPayload) => void;
}

export function useEventSubscription(
  eventId: string | number | undefined,
  handlers: EventSubscriptionHandlers = {}
) {
  const socket = useSocket();
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    if (!socket || eventId == null) return;

    const numericEventId = Number(eventId);
    socket.emit('event.subscribe', { eventId: numericEventId });

    const onStockUpdated = (payload: StockPayload) =>
      handlersRef.current.onStockUpdated?.(payload);
    const onReservationCreated = (payload: ReservationCreatedPayload) =>
      handlersRef.current.onReservationCreated?.(payload);
    const onReservationExpired = (payload: ReservationCreatedPayload) =>
      handlersRef.current.onReservationExpired?.(payload);
    const onPurchaseCompleted = (payload: PurchaseCompletedPayload) =>
      handlersRef.current.onPurchaseCompleted?.(payload);

    socket.on('stock.updated', onStockUpdated);
    socket.on('reservation.created', onReservationCreated);
    socket.on('reservation.expired', onReservationExpired);
    socket.on('purchase.completed', onPurchaseCompleted);

    return () => {
      socket.off('stock.updated', onStockUpdated);
      socket.off('reservation.created', onReservationCreated);
      socket.off('reservation.expired', onReservationExpired);
      socket.off('purchase.completed', onPurchaseCompleted);
    };
  }, [socket, eventId]);
}
