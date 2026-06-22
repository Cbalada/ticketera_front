"use client";

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { useReservationStore } from '@/store/reservationStore';
import { usePurchaseStore } from '@/store/purchaseStore';
import { useEvent } from '@/hooks/useEvent';
import { useEventSubscription } from '@/hooks/useEventSubscription';
import { createPurchase } from '@/lib/purchasesService';
import { parseApiError } from '@/lib/apiError';
import type { EventSector, Reservation } from '@/types';

function formatCountdown(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function getSectorPrice(event: { sectors: EventSector[] } | undefined, reservation: Reservation) {
  const sector =
    reservation.eventSector ??
    event?.sectors.find((s) => s.id === reservation.eventSectorId);
  return sector ? parseInt(sector.price, 10) : 0;
}

export default function PaymentPage() {
  const router = useRouter();
  const {
    reservations,
    selectedEventId,
    expiresAt,
    clearStore,
  } = useReservationStore();
  const { setCurrentPurchase } = usePurchaseStore();

  const [showModal, setShowModal] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const [remainingMs, setRemainingMs] = useState<number | null>(null);

  const { data: event } = useEvent(selectedEventId ?? undefined);

  const reservationIds = useMemo(
    () => new Set(reservations.map((r) => r.id)),
    [reservations]
  );

  const handleReservationExpired = useCallback(
    (payload: { reservationId: number }) => {
      if (reservationIds.has(payload.reservationId)) {
        clearStore();
        router.push('/checkout/timeout');
      }
    },
    [reservationIds, clearStore, router]
  );

  useEventSubscription(selectedEventId ?? undefined, {
    onReservationExpired: handleReservationExpired,
  });

  useEffect(() => {
    if (reservations.length === 0) {
      router.replace(selectedEventId ? `/events/${selectedEventId}/sectors` : '/events');
    }
  }, [reservations.length, selectedEventId, router]);

  useEffect(() => {
    if (!expiresAt) {
      setRemainingMs(null);
      return;
    }

    const tick = () => {
      const ms = new Date(expiresAt).getTime() - Date.now();
      if (ms <= 0) {
        clearStore();
        router.push('/checkout/timeout');
        return;
      }
      setRemainingMs(ms);
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, clearStore, router]);

  const lineItems = useMemo(() => {
    return reservations.map((reservation) => {
      const price = getSectorPrice(event, reservation);
      const sector =
        reservation.eventSector ??
        event?.sectors.find((s) => s.id === reservation.eventSectorId);
      return {
        reservation,
        sectorName: sector?.sector ?? 'Sector',
        unitPrice: price,
        subtotal: price * reservation.quantity,
      };
    });
  }, [reservations, event]);

  const total = useMemo(
    () => lineItems.reduce((acc, item) => acc + item.subtotal, 0),
    [lineItems]
  );

  const totalQty = useMemo(
    () => reservations.reduce((acc, r) => acc + r.quantity, 0),
    [reservations]
  );

  const serviceCharge = total * 0.15;
  const finalTotal = total + serviceCharge;

  const handlePay = async () => {
    if (reservations.length === 0 || isPaying) return;

    setIsPaying(true);
    setPayError(null);

    try {
      const purchases = await Promise.all(
        reservations.map((r) => createPurchase({ reservationId: r.id }))
      );
      setCurrentPurchase(purchases[purchases.length - 1]);
      setShowModal(true);
    } catch (err) {
      setPayError(parseApiError(err, 'No se pudo completar el pago. Intentá de nuevo.'));
    } finally {
      setIsPaying(false);
    }
  };

  const handleSuccessClose = () => {
    setShowModal(false);
    clearStore();
    router.push('/profile');
  };

  if (reservations.length === 0) {
    return null;
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-32 pb-20 px-4 md:px-margin-desktop max-w-container-max mx-auto w-full relative">
        <div className="absolute top-0 right-0 -z-10 opacity-10 pointer-events-none">
          <div className="w-[600px] h-[600px] bg-primary-fixed rounded-full blur-[120px]"></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          <div className="lg:col-span-8">
            <button className="flex items-center gap-2 mb-8 text-on-surface-variant hover:text-primary-fixed transition-colors" onClick={() => router.back()}>
              <span className="material-symbols-outlined">arrow_back</span>
              <span className="text-[11px] font-bold uppercase tracking-widest">VOLVER</span>
            </button>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">Pago con Tarjeta</h1>
            {remainingMs !== null && (
              <p className="mb-8 text-on-surface-variant text-sm">
                Tiempo restante para completar la compra:{' '}
                <span className="text-primary-fixed font-bold">{formatCountdown(remainingMs)}</span>
              </p>
            )}
            
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Sector y número de butaca seleccionado</label>
                <div className="w-full bg-surface-container-low border border-white/5 rounded-xl px-4 py-3 text-on-surface flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary-fixed text-sm">event_seat</span>
                    <span className="font-medium">Resumen de selección</span>
                  </div>
                  <div className="flex flex-col">
                    {lineItems.map((item) => (
                      <div key={item.reservation.id} className="flex justify-between items-center text-sm">
                        <span className="font-medium">
                          {item.sectorName} • {item.reservation.quantity} x ${item.unitPrice.toLocaleString('es-AR')}
                        </span>
                        <span className="font-bold">${item.subtotal.toLocaleString('es-AR')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="glass-panel rounded-xl p-6 md:p-8 space-y-6 relative overflow-hidden">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-white">Datos de tarjeta</h3>
                  <span className="material-symbols-outlined text-primary-fixed">credit_card</span>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Número de tarjeta (Hashed)</label>
                  <div className="relative">
                    <input className="w-full bg-surface-container-highest/20 border border-white/5 rounded-lg px-4 py-3 text-on-surface-variant cursor-not-allowed" readOnly type="text" value="**** **** **** 1234" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-sm">lock</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Fecha de vencimiento</label>
                    <input className="w-full bg-surface-container-low border border-white/10 rounded-lg px-4 py-3 focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed text-on-surface placeholder-white/20 transition-all outline-none" placeholder="MM/YY" type="text" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Código de seguridad</label>
                    <input className="w-full bg-surface-container-low border border-white/10 rounded-lg px-4 py-3 focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed text-on-surface placeholder-white/20 transition-all outline-none" maxLength={4} placeholder="CVV" type="password" />
                  </div>
                </div>
              </div>

              {payError && (
                <p className="text-sm text-red-400">{payError}</p>
              )}
              
              <div className="flex pt-4">
                <button 
                  type="button"
                  onClick={handlePay}
                  disabled={isPaying || totalQty === 0}
                  className={`w-full md:w-auto px-12 py-4 rounded-sm font-extrabold text-sm uppercase tracking-widest primary-glow transition-all flex items-center justify-center gap-3 active:scale-95 ${isPaying || totalQty === 0 ? 'bg-surface-container-high text-on-surface-variant cursor-not-allowed' : 'bg-primary-fixed text-black'}`}
                >
                  {isPaying ? 'Procesando...' : 'Pagar'}
                  {!isPaying && (
                    <span className="material-symbols-outlined font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                  )}
                </button>
              </div>
            </form>
          </div>
          
          {/* Sidebar Summary */}
          <aside className="lg:col-span-4 mt-12 lg:mt-0">
            <div className="glass-panel rounded-xl p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6 border-b border-white/5 pb-4 text-white">Resumen de Compra</h2>
              <div className="mb-6 rounded-lg overflow-hidden aspect-[16/9]">
                <img
                  className="w-full h-full object-cover"
                  src={event?.imageUrl ?? 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPJ8PQMEgvw_r0nRcAXb7I3GBjcPZ661Wun8nzhhMa0IiNFCHPKpQmkKyUepTRumUgp6PNlJ0u8wZSbYpn8ihX8v_SrNsV_ZOENX-M5Kk8o3bhmqrQQgTablX2B1P0JRBCM97vunCPLDCFhtKNijbMopOI1DcpPbT6EOZyftsgGLSb2OnK7ZR_kHCtWHmcnG_e_yXgerQDrSER2lBMHqnpeaWRw1dlcyQKPITacGv09xKyt6bYXrbRkmHVJcUjnO-9durUSL4eLPg'}
                  alt={event?.title ?? 'Evento'}
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-white">{event?.title ?? 'Evento'}</h4>
                    <p className="text-on-surface-variant text-xs">
                      {event?.date
                        ? new Intl.DateTimeFormat('es-AR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          }).format(new Date(event.date))
                        : '—'}
                    </p>
                  </div>
                  <div className="bg-primary-fixed text-black px-2 py-0.5 rounded text-[10px] font-black pulse-dot">LIVE</div>
                </div>
                
                {lineItems.map((item) => (
                  <div key={item.reservation.id} className="flex justify-between text-on-surface-variant text-sm font-medium">
                    <span>{item.reservation.quantity}x Entrada {item.sectorName}</span>
                    <span>${item.subtotal.toLocaleString('es-AR')}</span>
                  </div>
                ))}
                <div className="flex justify-between text-on-surface-variant text-sm font-medium">
                  <span>Service Charge</span>
                  <span>${serviceCharge.toLocaleString('es-AR')}</span>
                </div>
                
                <div className="border-t border-white/5 pt-4 flex justify-between items-center">
                  <span className="font-bold text-white">Total</span>
                  <span className="text-2xl font-extrabold text-primary-fixed">${finalTotal.toLocaleString('es-AR')}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md transition-opacity duration-300">
          <div className="glass-panel max-w-md w-full rounded-xxl p-8 text-center relative overflow-hidden border-primary-fixed/20 animate-in fade-in zoom-in-95">
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary-fixed/10 rounded-full blur-[40px]"></div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-primary-fixed rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(195,244,0,0.4)]">
                <span className="material-symbols-outlined text-black text-4xl font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              </div>
              <h2 className="font-display text-3xl font-extrabold text-white mb-6">¡Pago realizado con éxito!</h2>
              <div className="space-y-4">
                <button 
                  onClick={handleSuccessClose}
                  className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold py-4 rounded-sm uppercase tracking-widest text-xs transition-all active:scale-95"
                >
                  Ver Mis Tickets
                </button>
                <button 
                  onClick={() => {
                    clearStore();
                    router.push('/');
                  }}
                  className="w-full text-on-surface-variant font-bold text-[10px] uppercase tracking-[0.2em] hover:text-primary-fixed transition-colors"
                >
                  Volver al Inicio
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
