"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useReservationStore } from '@/store/reservationStore';
import { cancelReservation } from '@/lib/reservationsService';

interface ReservationLeaveGuardContextValue {
  promptLeave: (destination: string) => Promise<boolean>;
}

const ReservationLeaveGuardContext = createContext<ReservationLeaveGuardContextValue | null>(null);

function normalizePath(href: string) {
  try {
    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) {
      return null;
    }
    return url.pathname;
  } catch {
    return null;
  }
}

function isAllowedPath(pathname: string) {
  if (pathname === '/checkout/payment') return true;
  const parts = pathname.split('/').filter(Boolean);
  return parts.length === 3 && parts[0] === 'events' && parts[2] === 'sectors';
}

function shouldInterceptPath(pathname: string, currentPath: string) {
  if (pathname === currentPath) return false;
  return !isAllowedPath(pathname);
}

export function ReservationLeaveGuardProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { expiresAt, reservations, clearStore } = useReservationStore();
  const [pendingDestination, setPendingDestination] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const resolveRef = useRef<((value: boolean) => void) | null>(null);

  const hasActiveReservation = useMemo(
    () => !!expiresAt || reservations.length > 0,
    [expiresAt, reservations.length]
  );

  const promptLeave = useCallback(
    (destination: string) => {
      return new Promise<boolean>((resolve) => {
        const destinationPath = normalizePath(destination);
        if (!destinationPath || !pathname || !hasActiveReservation || !shouldInterceptPath(destinationPath, pathname)) {
          resolve(true);
          return;
        }

        setPendingDestination(destinationPath);
        setShowModal(true);
        resolveRef.current = resolve;
      });
    },
    [hasActiveReservation, pathname]
  );

  const cancelActiveReservations = useCallback(async () => {
    const reservationsToCancel = [...reservations];
    if (reservationsToCancel.length > 0) {
      await Promise.all(reservationsToCancel.map((reservation) => cancelReservation(reservation.id)));
    }
    clearStore();
  }, [reservations, clearStore]);

  const handleConfirmLeave = useCallback(async () => {
    const resolve = resolveRef.current;
    resolveRef.current = null;
    setShowModal(false);
    const destination = pendingDestination;
    setPendingDestination(null);
    try {
      await cancelActiveReservations();
      if (destination) {
        router.push(destination);
      }
      resolve?.(true);
    } catch {
      resolve?.(false);
    }
  }, [pendingDestination, cancelActiveReservations, router]);

  const handleCancelLeave = useCallback(() => {
    const resolve = resolveRef.current;
    resolveRef.current = null;
    setShowModal(false);
    setPendingDestination(null);
    resolve?.(false);
  }, []);

  useEffect(() => {
    if (!hasActiveReservation) return;
    if (pathname && !isAllowedPath(pathname)) {
      void cancelActiveReservations();
    }
  }, [pathname, hasActiveReservation, cancelActiveReservations]);

  useEffect(() => {
    if (!hasActiveReservation) return;

    const handleBeforeUnload = () => {
      clearStore();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasActiveReservation, clearStore]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!hasActiveReservation) return;
      if (!(event.target instanceof HTMLElement)) return;
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;

      const anchor = event.target.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;
      if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || anchor.target) return;

      const destinationPath = normalizePath(href);
      if (!destinationPath || !shouldInterceptPath(destinationPath, pathname)) return;

      event.preventDefault();
      event.stopPropagation();
      promptLeave(destinationPath);
    };

    window.addEventListener('click', handleClick, true);
    return () => window.removeEventListener('click', handleClick, true);
  }, [hasActiveReservation, pathname, promptLeave]);

  return (
    <ReservationLeaveGuardContext.Provider value={{ promptLeave }}>
      {children}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel max-w-xl w-full rounded-xxl p-8 border border-white/10 shadow-2xl">
            <div className="space-y-6">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary-fixed/10 text-primary-fixed mx-auto">
                <span className="material-symbols-outlined text-4xl">warning</span>
              </div>
              <div className="text-center">
                <h2 className="font-display text-headline-lg text-white mb-2">Vas a abandonar la reserva</h2>
                <p className="text-on-surface-variant leading-relaxed">
                  Si salís de esta pantalla ahora, el tiempo restante de reserva se cancelará y perderás tu selección.
                  Volvé a los sectores o completá el pago para mantener la reserva.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={handleCancelLeave}
                  className="w-full rounded-xl border border-white/10 bg-surface-container-high text-on-surface py-4 font-bold uppercase tracking-[0.18em] transition hover:bg-surface-container-hover"
                >
                  Quedarme
                </button>
                <button
                  type="button"
                  onClick={handleConfirmLeave}
                  className="w-full rounded-xl bg-primary-fixed text-black py-4 font-bold uppercase tracking-[0.18em] transition hover:bg-primary-container"
                >
                  Salir igual
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ReservationLeaveGuardContext.Provider>
  );
}

export function useReservationLeaveGuard() {
  const context = useContext(ReservationLeaveGuardContext);
  if (!context) {
    throw new Error('useReservationLeaveGuard must be used within a ReservationLeaveGuardProvider');
  }
  return context;
}
