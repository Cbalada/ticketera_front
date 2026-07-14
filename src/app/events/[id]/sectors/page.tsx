"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { useAuthStore } from '@/store/authStore';
import { useReservationStore } from '@/store/reservationStore';
import { useEvent } from '@/hooks/useEvent';
import { useEventStockSync } from '@/hooks/useEventStockSync';
import { useCheckoutCountdown } from '@/hooks/useCheckoutCountdown';
import { CheckoutCountdown } from '@/components/checkout/CheckoutCountdown';
import { ReservationExpiredModal } from '@/components/checkout/ReservationExpiredModal';
import { useReservationLeaveGuard } from '@/components/checkout/ReservationLeaveGuard';
import { createReservation } from '@/lib/reservationsService';
import { parseApiError } from '@/lib/apiError';
import type { EventSector, Sector } from '@/types';

function formatEventDateTime(iso?: string) {
  if (!iso) return '-';
  try {
    const d = new Date(iso);
    const weekday = d.toLocaleDateString('es-AR', { weekday: 'long' });
    const day = d.getDate();
    const month = d.toLocaleDateString('es-AR', { month: 'long' });
    const year = d.getFullYear();
    const time = d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false });
    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
    return `${capitalize(weekday)}, ${day} ${capitalize(month)} ${year} • ${time}`;
  } catch {
    return iso;
  }
}

function getSectorDisplayName(sector: Sector) {
  if (sector === 'VIP') return 'VIP Experience';
  if (sector === 'CAMPO') return 'Campo parado';
  if (sector === 'PLATEA_A') return 'Platea Lateral A';
  if (sector === 'PLATEA_B') return 'Platea Lateral B';
  return sector;
}

export default function SectorsPage() {
  const router = useRouter();
  const params = useParams() as { id?: string | string[] } | undefined;
  const rawId = params?.id;
  const eventId = Array.isArray(rawId) ? rawId[0] : rawId;
  const reservationLeaveGuard = useReservationLeaveGuard();

  const [expandedSector, setExpandedSector] = useState<number | null>(null);
  const [isReserving, setIsReserving] = useState(false);
  const [reserveError, setReserveError] = useState<string | null>(null);
  const [showExpiredModal, setShowExpiredModal] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { selectedSectors, setSectorQuantity, setSelectedEventId, clearSelectedSectors, setReservations, startCheckoutTimer, clearStore, expiresAt } =
    useReservationStore();

  const { data: event, isLoading, isError, error, refetch } = useEvent(eventId);
  const { remainingMs } = useCheckoutCountdown({
    onExpire: () => setShowExpiredModal(true),
  });

  useEventStockSync(eventId);

  useEffect(() => {
    if (!eventId) return;
    setSelectedEventId(eventId);
    clearSelectedSectors();
    startCheckoutTimer();
  }, [eventId, setSelectedEventId, clearSelectedSectors, startCheckoutTimer]);

  useEffect(() => {
    if (!event) return;
    event.sectors.forEach((sector) => {
      const qty = selectedSectors[sector.id] ?? 0;
      if (qty > sector.availableQuantity) {
        setSectorQuantity(sector.id, sector.availableQuantity);
      }
    });
  }, [event, selectedSectors, setSectorQuantity]);

  const getSectorByType = (type: Sector) => event?.sectors.find((s) => s.sector === type);

  const handleSectorClick = (sector: EventSector) => {
    setExpandedSector((prev) => (prev === sector.id ? null : sector.id));
  };

  const getSectorQuantity = (sectorId: number) => selectedSectors[sectorId] ?? 0;

  const handleQuantityChange = (sector: EventSector, delta: number) => {
    const currentQty = getSectorQuantity(sector.id);
    const newQty = currentQty + delta;
    if (newQty >= 0 && newQty <= sector.availableQuantity) {
      setSectorQuantity(sector.id, newQty);
    }
  };

  const { totalTickets, totalPrice } = useMemo(() => {
    if (!event) return { totalTickets: 0, totalPrice: 0 };

    return event.sectors.reduce(
      (acc, sector) => {
        const qty = selectedSectors[sector.id] ?? 0;
        return {
          totalTickets: acc.totalTickets + qty,
          totalPrice: acc.totalPrice + qty * parseInt(sector.price, 10),
        };
      },
      { totalTickets: 0, totalPrice: 0 }
    );
  }, [event, selectedSectors]);

  const orderedSectors = useMemo(() => {
    if (!event) return [] as EventSector[];
    const orderMap: Record<string, number> = {
      VIP: 0,
      PLATEA_A: 1,
      PLATEA_B: 2,
      CAMPO: 3,
    };
    return [...event.sectors].sort((a, b) => (orderMap[a.sector] ?? 99) - (orderMap[b.sector] ?? 99));
  }, [event]);

  const handleContinue = async () => {
    if (totalTickets === 0 || !eventId || !event) return;

    if (expiresAt && new Date(expiresAt) <= new Date()) {
      clearStore();
      router.push('/checkout/timeout');
      return;
    }

    if (!isAuthenticated) {
      router.push(`/login?redirect=/events/${eventId}/sectors`);
      return;
    }

    setIsReserving(true);
    setReserveError(null);

    try {
      const entries = event.sectors
        .map((sector) => ({ sector, qty: selectedSectors[sector.id] ?? 0 }))
        .filter(({ qty }) => qty > 0);

      const created = await Promise.all(
        entries.map(({ sector, qty }) =>
          createReservation({ eventSectorId: sector.id, quantity: qty })
        )
      );

      setSelectedEventId(eventId);
      setReservations(created);
      router.push('/checkout/payment');
    } catch (err) {
      setReserveError(parseApiError(err, 'No se pudo crear la reserva. Verificá la disponibilidad e intentá de nuevo.'));
    } finally {
      setIsReserving(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="max-w-container-max mx-auto px-margin-desktop py-12">
          <div className="mb-10 space-y-3">
            <div className="h-10 bg-surface-container animate-pulse rounded-md w-1/3" />
            <div className="h-5 bg-surface-container animate-pulse rounded-md w-1/4" />
          </div>
          <div className="grid grid-cols-12 gap-gutter">
            <div className="col-span-12 lg:col-span-8">
              <div className="glass-panel rounded-xl min-h-[600px] border border-white/5 bg-surface-container animate-pulse" />
            </div>
            <div className="col-span-12 lg:col-span-4">
              <div className="glass-panel rounded-xl p-8 border border-white/5 space-y-4">
                <div className="h-6 bg-surface-container-high animate-pulse rounded w-1/2" />
                <div className="h-20 bg-surface-container-high animate-pulse rounded" />
                <div className="h-20 bg-surface-container-high animate-pulse rounded" />
                <div className="h-14 bg-surface-container-high animate-pulse rounded mt-10" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (isError) {
    const errorMessage =
      error?.message ||
      (typeof error === 'object' && error !== null && 'error' in error
        ? String((error as { error?: string }).error)
        : 'Error cargando evento.');

    return (
      <>
        <Navbar />
        <main className="max-w-container-max mx-auto px-margin-desktop py-12">
          <div className="max-w-3xl mx-auto text-center py-24">
            <h2 className="font-display text-headline-lg mb-4 text-white">No se pudo cargar el evento</h2>
            <p className="text-on-surface-variant mb-6">{errorMessage}</p>
            <div className="flex justify-center gap-4">
              <Link href="/events" className="px-6 py-3 rounded-lg border border-white/10">
                Volver a Shows
              </Link>
              <button onClick={() => refetch()} className="px-6 py-3 rounded-lg bg-primary-fixed text-on-primary">
                Reintentar
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!event) {
    return (
      <>
        <Navbar />
        <main className="max-w-container-max mx-auto px-margin-desktop py-12">
          <div className="max-w-3xl mx-auto text-center py-24">
            <h2 className="font-display text-headline-lg mb-4 text-white">Evento no encontrado</h2>
            <p className="text-on-surface-variant mb-6">El evento que buscas no existe o fue eliminado.</p>
            <Link href="/events" className="px-6 py-3 rounded-lg border border-white/10">
              Volver a Shows
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const vipSector = getSectorByType('VIP');
  const campoSector = getSectorByType('CAMPO');
  const plateaASector = getSectorByType('PLATEA_A');
  const plateaBSector = getSectorByType('PLATEA_B');

  return (
    <>
      <Navbar />
      <main className="max-w-container-max mx-auto px-margin-desktop py-12">
        <button
          className="flex items-center gap-2 mb-8 text-on-surface-variant hover:text-primary-fixed transition-colors"
          onClick={async () => {
            const destination = `/events/${eventId}`;
            const allowed = await reservationLeaveGuard.promptLeave(destination);
            if (allowed) {
              router.push(destination);
            }
          }}
        >
          <span className="material-symbols-outlined">arrow_back</span>
          <span className="text-[11px] font-bold uppercase tracking-widest">VOLVER</span>
        </button>

        <div className="mb-10">
          <h1 className="font-display text-headline-lg text-white mb-2 uppercase tracking-tight">{event.title}</h1>
          <div className="flex items-center gap-3 text-on-surface-variant mb-4">
            <span className="material-symbols-outlined text-primary-fixed-dim">calendar_today</span>
            <p className="font-body-md text-body-md">{formatEventDateTime(event.date)}</p>
          </div>
          <CheckoutCountdown remainingMs={remainingMs} />
        </div>

        <div className="grid grid-cols-12 gap-gutter">
          {/* Left Column: Venue Map */}
          <div className="col-span-12 lg:col-span-8">
            <div className="glass-panel rounded-xl overflow-hidden venue-map-area relative min-h-[600px] border border-white/5 shadow-2xl bg-[radial-gradient(circle_at_center,_#1a1a1c_0%,_#0e0e10_100%)]">
              <div className="absolute top-6 left-6 z-10 flex items-center gap-3 bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10">
                <span className="w-2 h-2 rounded-full bg-primary-fixed pulse-dot"></span>
                <span className="text-label-md font-label-md uppercase tracking-widest text-primary-fixed">Disponibilidad en Vivo</span>
              </div>
              
              <div className="flex flex-col items-center justify-center h-full p-12 gap-8">
                <div className="w-full text-center mt-10">
                  <span className="text-label-md font-label-md text-on-surface-variant tracking-[0.3em] uppercase mb-8 block">Mapa del Recinto</span>
                </div>
                
                <div className="w-4/5 h-20 bg-surface-container-highest border-b-4 border-primary-fixed flex items-center justify-center rounded-t-lg">
                  <span className="font-display text-headline-md font-extrabold text-white tracking-[0.2em]">ESCENARIO</span>
                </div>
                
                {vipSector && (
                  <div 
                    className={`w-1/2 h-16 glass-panel flex items-center justify-center border-primary-fixed/20 group hover:border-primary-fixed/60 transition-colors cursor-pointer ${expandedSector === vipSector.id ? 'border-primary-fixed bg-primary-fixed/10' : ''}`}
                    onClick={() => handleSectorClick(vipSector)}
                  >
                    <span className="font-label-md text-label-md font-bold text-primary-fixed-dim">VIP AREA</span>
                  </div>
                )}
                
                <div className="w-full grid grid-cols-5 gap-4 items-stretch h-64">
                  {plateaASector && (
                    <div 
                      className={`col-span-1 glass-panel flex flex-col items-center justify-center border-white/10 hover:border-secondary transition-colors cursor-pointer ${expandedSector === plateaASector.id ? 'border-secondary bg-secondary/10' : ''}`}
                      onClick={() => handleSectorClick(plateaASector)}
                    >
                      <span className="rotate-[-90deg] font-label-md font-bold whitespace-nowrap">PLATEA A</span>
                    </div>
                  )}
                  
                  {campoSector && (
                    <div 
                      className={`col-span-3 glass-panel flex items-center justify-center border-primary-fixed/10 hover:border-primary-fixed/50 transition-colors cursor-pointer relative overflow-hidden ${expandedSector === campoSector.id ? 'border-primary-fixed bg-primary-fixed/10' : ''}`}
                      onClick={() => handleSectorClick(campoSector)}
                    >
                      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_#abd600_0%,_transparent_70%)]"></div>
                      <span className="font-display text-headline-md font-bold text-on-surface">CAMPO</span>
                    </div>
                  )}
                  
                  {plateaBSector && (
                    <div 
                      className={`col-span-1 glass-panel flex flex-col items-center justify-center border-white/10 hover:border-secondary transition-colors cursor-pointer ${expandedSector === plateaBSector.id ? 'border-secondary bg-secondary/10' : ''}`}
                      onClick={() => handleSectorClick(plateaBSector)}
                    >
                      <span className="rotate-[90deg] font-label-md font-bold whitespace-nowrap">PLATEA B</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Ticket Selection */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
            <div className="glass-panel rounded-xl p-8 flex flex-col h-full border border-white/5">
              <div className="mb-8">
                <h2 className="font-headline-md text-headline-md text-white mb-1">Ubicaciones</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">Elige tu lugar favorito</p>
              </div>
              
              <div className="flex flex-col gap-3 flex-grow">
                {orderedSectors.map((sector) => {
                  const isExpanded = expandedSector === sector.id;
                  const quantity = getSectorQuantity(sector.id);
                  const displayName = getSectorDisplayName(sector.sector);
                  const canDecrease = quantity > 0;
                  const canIncrease = quantity < sector.availableQuantity;
                  
                  return (
                    <div 
                      key={sector.id} 
                      className={`glass-panel rounded-lg transition-all duration-300 ${isExpanded ? 'border-primary-fixed/40 bg-surface-container-highest/40 ring-1 ring-primary-fixed/20' : 'border-white/10 hover:bg-surface-container-high/50 cursor-pointer group'}`}
                    >
                      <div className="p-4 flex justify-between items-center" onClick={() => handleSectorClick(sector)}>
                        <div className="flex flex-col">
                          <span className={`font-label-md text-label-md font-bold uppercase tracking-wider ${isExpanded ? 'text-primary-fixed' : 'text-on-surface-variant group-hover:text-on-surface'}`}>
                            {displayName}
                          </span>
                          <span className="font-headline-md text-headline-md text-white">$ {parseInt(sector.price, 10).toLocaleString('es-AR')}</span>
                        </div>
                        <span className={`material-symbols-outlined transition-transform duration-300 ${isExpanded ? 'text-primary-fixed rotate-180' : 'text-on-surface-variant group-hover:text-white'}`}>
                          {isExpanded ? 'expand_more' : 'chevron_right'}
                        </span>
                      </div>
                      
                      {isExpanded && (
                        <div className="px-4 pb-6 pt-2">
                          <div className="h-px bg-white/10 mb-4"></div>
                          <div className="flex justify-between items-center">
                            <span className="font-body-md text-body-md text-on-surface-variant">Cantidad de entradas</span>
                            <div className="flex items-center gap-6 bg-surface-container-low border border-white/10 rounded-full px-4 py-2">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleQuantityChange(sector, -1);
                                }}
                                disabled={!canDecrease}
                                className={`transition-colors active:scale-90 ${canDecrease ? 'text-on-surface-variant hover:text-white' : 'text-on-surface-variant/30 cursor-not-allowed'}`}
                              >
                                <span className="material-symbols-outlined text-[20px]">remove</span>
                              </button>
                              <span className="font-headline-md text-headline-md text-white w-4 text-center">{quantity}</span>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleQuantityChange(sector, 1);
                                }}
                                disabled={!canIncrease}
                                className={`transition-colors active:scale-90 ${canIncrease ? 'text-primary-fixed-dim hover:text-primary-fixed' : 'text-on-surface-variant/30 cursor-not-allowed'}`}
                              >
                                <span className="material-symbols-outlined text-[20px]">add</span>
                              </button>
                            </div>
                          </div>
                          <p className="mt-4 text-xs text-on-surface-variant/80">
                            Disponibles: {sector.availableQuantity}
                          </p>
                          {sector.sector === 'VIP' && (
                            <p className="mt-2 text-xs text-on-surface-variant/60 leading-relaxed italic">Incluye acceso prioritario y área preferencial frente al escenario.</p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Checkout Button Area */}
              <div className="mt-10 pt-6 border-t border-white/10">
                {reserveError && (
                  <p className="mb-4 text-sm text-red-400">{reserveError}</p>
                )}
                <div className="flex justify-between items-end mb-6 gap-4">
                  <span className="font-body-md text-body-md text-on-surface-variant">
                    Total ({totalTickets} entrada{totalTickets !== 1 ? 's' : ''})
                  </span>
                  <span className="font-headline-md text-headline-md md:text-headline-lg text-white whitespace-nowrap">
                    $ {totalPrice.toLocaleString('es-AR')}
                  </span>
                </div>
                <button 
                  disabled={totalTickets === 0 || isReserving}
                  onClick={handleContinue}
                  className={`w-full font-bold py-5 rounded-xl text-label-md uppercase tracking-[0.2em] transition-all ${totalTickets === 0 || isReserving ? 'bg-surface-container-high text-on-surface-variant cursor-not-allowed' : 'bg-primary-fixed hover:bg-primary-container text-on-primary-fixed active:scale-95 primary-glow'}`}
                >
                  {isReserving ? 'Reservando...' : 'Continuar Compra'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Extra Information Section */}
        <section className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-gutter">
          <div className="glass-panel p-6 rounded-xl border-white/5">
            <span className="material-symbols-outlined text-primary-fixed-dim mb-4 text-[32px]">security</span>
            <h3 className="font-headline-md text-headline-md text-white mb-2">Compra Segura</h3>
            <p className="font-body-md text-on-surface-variant">Tus transacciones están protegidas con tecnología de encriptación de última generación.</p>
          </div>
          <div className="glass-panel p-6 rounded-xl border-white/5">
            <span className="material-symbols-outlined text-primary-fixed-dim mb-4 text-[32px]">qr_code_2</span>
            <h3 className="font-headline-md text-headline-md text-white mb-2">E-Ticket</h3>
            <p className="font-body-md text-on-surface-variant">Recibe tus entradas directamente en tu correo electrónico o en nuestra app.</p>
          </div>
          <div className="glass-panel p-6 rounded-xl border-white/5">
            <span className="material-symbols-outlined text-primary-fixed-dim mb-4 text-[32px]">support_agent</span>
            <h3 className="font-headline-md text-headline-md text-white mb-2">Soporte 24/7</h3>
            <p className="font-body-md text-on-surface-variant">Nuestro equipo está disponible para ayudarte en cualquier etapa de tu compra.</p>
          </div>
        </section>
      </main>

      {showExpiredModal && (
        <ReservationExpiredModal
          onClose={() => {
            clearStore();
            router.push('/');
          }}
        />
      )}

      <Footer />
    </>
  );
}
