"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { useAuthStore } from '@/store/authStore';
import { getEvent } from '@/lib/eventsService';
import { Event } from '@/types';

export default function EventDetailsPage() {
  const router = useRouter();
  const params = useParams() as { id?: string | string[] } | undefined;
  const rawId = params?.id;
  const eventId = Array.isArray(rawId) ? rawId[0] : rawId;

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handlePurchaseClick = () => {
    if (!isAuthenticated) {
      setIsSidebarOpen(true);
    } else {
      router.push(`/events/${eventId}/sectors`);
    }
  };

  useEffect(() => {
    let mounted = true;
    if (!eventId) return;

    const controller = new AbortController();

    setLoading(true);
    setError(null);
    setEvent(null);

    getEvent(eventId, { signal: controller.signal })
      .then((res) => {
        if (!mounted) return;
        setEvent(res);
      })
      .catch((err: any) => {
        if (!mounted) return;
        console.error('Error fetching event', err);
        let msg = 'Error cargando evento.';
        if (err) {
          if (typeof err === 'string') msg = err;
          else if (Array.isArray(err?.message)) msg = err.message.join(', ');
          else if (err?.message) msg = err.message;
          else if (err?.error) msg = err.error;
          else try { msg = JSON.stringify(err); } catch {}
        }
        if (err?.statusCode === 404 || (typeof err === 'string' && err.includes('404'))) {
          msg = 'Evento no encontrado.';
        }
        setError(msg || 'Evento no encontrado.');
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [eventId]);

  // Loading skeleton
  if (loading) {
    return (
      <>
        <Navbar />
        <main className="pt-32 pb-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <section className="lg:col-span-8 space-y-8">
              <header className="space-y-2">
                <div className="inline-flex items-center space-x-2 text-primary-fixed">
                  <span className="material-symbols-outlined text-[18px]">electric_bolt</span>
                  <span className="font-display text-label-md uppercase tracking-widest">Actuación en Vivo</span>
                </div>
                <div className="h-10 bg-surface-container animate-pulse rounded-md w-1/3" />
              </header>
              <div className="relative group rounded-xl overflow-hidden shadow-2xl">
                <div className="w-full aspect-video bg-gray-700 animate-pulse rounded-xl" />
              </div>
              <div className="space-y-6 max-w-3xl">
                <div className="h-4 bg-surface-container animate-pulse rounded w-full" />
                <div className="h-4 bg-surface-container animate-pulse rounded w-5/6" />
              </div>
            </section>

            <aside className="lg:col-span-4 lg:sticky lg:top-32">
              <div className="glass-panel p-8 rounded-3xl space-y-8 border border-white/10 glow-primary/5">
                <div className="h-6 bg-surface-container animate-pulse rounded w-1/3" />
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2 p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                    <div className="h-6 bg-surface-container animate-pulse rounded mx-auto w-3/4" />
                  </div>
                  <div className="space-y-2 p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                    <div className="h-6 bg-surface-container animate-pulse rounded mx-auto w-3/4" />
                  </div>
                </div>
                <div className="h-12 bg-surface-container animate-pulse rounded" />
              </div>
            </aside>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <Navbar />
        <main className="pt-32 pb-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          <div className="max-w-3xl mx-auto text-center py-24">
            <h2 className="font-display text-headline-lg mb-4">No se pudo cargar el evento</h2>
            <p className="text-on-surface-variant mb-6">{error}</p>
            <div className="flex justify-center gap-4">
              <Link href="/events" className="px-6 py-3 rounded-lg border border-white/10">Volver a Shows</Link>
              <button onClick={() => router.refresh()} className="px-6 py-3 rounded-lg bg-primary-fixed text-on-primary">Reintentar</button>
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
        <main className="pt-32 pb-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          <div className="max-w-3xl mx-auto text-center py-24">
            <h2 className="font-display text-headline-lg mb-4">Evento no encontrado</h2>
            <p className="text-on-surface-variant mb-6">El evento que buscas no existe o fue eliminado.</p>
            <Link href="/events" className="px-6 py-3 rounded-lg border border-white/10">Volver a Shows</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Helper to format date/time in Spanish
  function formatDateSpanish(iso?: string) {
    if (!iso) return '-';
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'long' });
    } catch {
      return iso;
    }
  }

  function formatTime(iso?: string) {
    if (!iso) return '-';
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return iso;
    }
  }

  const eventDateFormatted = formatDateSpanish(event.date);
  const eventTimeFormatted = formatTime(event.date) + ' hs';

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Artist Details */}
          <section className="lg:col-span-8 space-y-8">
            <header className="space-y-2">
              <div className="inline-flex items-center space-x-2 text-primary-fixed">
                <span className="material-symbols-outlined text-[18px]">electric_bolt</span>
                <span className="font-display text-label-md uppercase tracking-widest">Actuación en Vivo</span>
              </div>
              <h1 className="font-display text-headline-lg-mobile md:text-display text-white">
                {event.title}
              </h1>
            </header>
            <div className="relative group rounded-xl overflow-hidden shadow-2xl">
              <img alt={event.title} className="w-full aspect-video object-cover transition-transform duration-700 group-hover:scale-105 rounded-xl" src={event.imageUrl} />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-60"></div>
            </div>
            <div className="space-y-6 max-w-3xl">
              <p className="font-body-lg text-on-surface-variant leading-relaxed">
                {event.description}
              </p>
            </div>
          </section>

          {/* Right Sidebar: Ticket Purchase */}
          <aside className="lg:col-span-4 lg:sticky lg:top-32">
            <div className="glass-panel p-8 rounded-3xl space-y-8 border border-white/10 glow-primary/5">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <h2 className="font-display text-headline-md text-white tracking-tight uppercase">Show</h2>
                <span className="flex items-center text-primary-fixed">
                  <span className="material-symbols-outlined mr-1" style={{ fontVariationSettings: '"FILL" 1' }}>confirmation_number</span>
                  <span className="font-label-md">Cupos Limitados</span>
                </span>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2 p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                  <p className="text-on-surface-variant font-label-md uppercase tracking-tighter text-[12px]">Fecha</p>
                  <p className="font-display text-headline-md text-white">{eventDateFormatted}</p>
                </div>
                <div className="space-y-2 p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                  <p className="text-on-surface-variant font-label-md uppercase tracking-tighter text-[12px]">Lugar</p>
                  <p className="font-display text-headline-md text-white">Apollo</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center px-4">
                  <div>
                    <p className="text-on-surface-variant text-label-md">puertas</p>
                    <p className="font-display text-headline-md text-white">19:00 hs</p>
                  </div>
                  <div className="h-8 w-px bg-white/10"></div>
                  <div className="text-right">
                    <p className="text-on-surface-variant text-label-md">show</p>
                    <p className="font-display text-headline-md text-white">{eventTimeFormatted}</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={handlePurchaseClick}
                className="w-full py-6 rounded-2xl bg-primary-fixed text-on-primary font-display font-extrabold text-headline-md uppercase tracking-tight transition-all duration-300 primary-glow active:scale-[0.98] cursor-pointer"
              >
                Compra
              </button>
              <div className="flex items-center justify-center space-x-2 text-on-surface-variant font-body-md py-2">
                <div className="w-2 h-2 rounded-full bg-primary-fixed animate-pulse"></div>
                <span>¡Se agotan! Solo quedan 42 entradas.</span>
              </div>
            </div>

            {/* Secondary Info Card */}
            <div className="mt-8 glass-panel p-6 rounded-2xl border border-white/5">
              <h3 className="text-white font-display text-label-md mb-4 uppercase tracking-wider">Ubicación del Teatro</h3>
              <div className="aspect-square rounded-xl overflow-hidden bg-surface-container-highest flex items-center justify-center relative">
                <img alt={`Mapa de ${event.title}`} className="absolute inset-0 w-full h-full object-cover grayscale opacity-60" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOFr86uKyAbhBaZI5MBwUMhTkl2AhxJFpkotJl4VSs_W15Ut6Qa64mBMyw2N8fw1ibMAXj10Su-CcPCHoMqrJW6thnNM2AnVHFxO44Hk2T8TUcUrvyqiMlpCLUSLwA3HLRO3YupU5HTzDohes-kH7RNrmxbQWiaC0VKfH8ZDJYoswoYB8Y1LtfkeQ2UIopCRe_UGnfzNKbwiZ4POeI3BwVYyMopPgPdu2nac0gRugLS9cvnVJqJ8ms9PENocDdZnSVdlVkCwFacXk" />
                <span className="material-symbols-outlined text-primary-fixed text-4xl z-10 drop-shadow-lg">location_on</span>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[60] transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Functional Sidebar */}
      <aside 
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-surface-container-lowest border-l border-outline-variant z-[70] transform transition-transform duration-300 ease-in-out overflow-y-auto ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-8 space-y-8">
          <div className="flex justify-end">
            <button 
              className="text-on-surface-variant hover:text-primary-fixed transition-colors"
              onClick={() => setIsSidebarOpen(false)}
            >
              <span className="material-symbols-outlined text-4xl">close</span>
            </button>
          </div>
          <div className="space-y-6">
            <h2 className="font-display text-headline-lg text-white tracking-tight">Ingresá a tu cuenta</h2>
            <div className="space-y-4 text-on-surface-variant font-body leading-relaxed">
              <p>Para poder comprar entradas para este show, es necesario que te registres de nuevo en el sitio web.</p>
              <p>Esto implica crear un nuevo usuario y contraseña. El proceso de registro es fácil y rápido. Hacé click en "Crear cuenta" y seguí los pasos.</p>
              <p>Si ya estás registrado en nuestro nuevo portal, simplemente hacé click en 'Ingresar a mi cuenta' y seguí disfrutando de la experiencia.</p>
            </div>
            <div className="pt-8 space-y-4">
              <Link href="/login" className="block w-full py-4 rounded-xl bg-primary-fixed text-on-primary font-bold uppercase tracking-widest hover:scale-[0.98] transition-all text-center">
                ingresa a mi cuenta
              </Link>
              <Link href="/register" className="block w-full py-4 rounded-xl border-2 border-primary-fixed text-primary-fixed font-bold uppercase tracking-widest hover:bg-primary-fixed/10 transition-all text-center">
                crear cuenta
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
