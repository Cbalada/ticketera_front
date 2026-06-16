"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { useAuthStore } from '@/store/authStore';

export default function EventDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id;
  
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handlePurchaseClick = () => {
    if (!isAuthenticated) {
      setIsSidebarOpen(true);
    } else {
      router.push(`/events/${eventId}/sectors`);
    }
  };

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
                Neo Echoes
              </h1>
            </header>
            <div className="relative group rounded-xl overflow-hidden shadow-2xl">
              <img alt="Presentación de Neo Echoes" className="w-full aspect-video object-cover transition-transform duration-700 group-hover:scale-105 rounded-xl" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMJqY4RI7Zpv7bpdW8wPliEDX4x0La1UJPDIGCUeorwC4ydNE1sBxNKlrCnxLVJ55uD2HLMkKKZG34vjqL48Jqfx7NQbPZ-RPI9rET9pDXl0VpMTiJ8lGg_qrWa7xTvPIHOlCI3kaKg3lB5XnOCJ1YKlwHPSuD0UGzh4vdI2_BUClWU7LeGJrSmSSUwbRDHpGbzaPcutT0nOigfRSBi2-vA3tGbo4W7YFscdxke1HHdZH5Kj5jNuBpCexZVxJUOni3yccfIWEYVC4" />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-60"></div>
            </div>
            <div className="space-y-6 max-w-3xl">
              <p className="font-body-lg text-on-surface-variant leading-relaxed">
                Preparate para un viaje sónico inmersivo mientras <span className="text-white font-bold">Neo Echoes</span> se apodera del escenario del legendario Apollo Theater. Conocidos por su mezcla de alta energía de estética synth-wave y rock moderno, esta presentación promete ser un espectáculo visual y auditivo que desafía los límites de la música en vivo.
              </p>
              <p className="font-body-lg text-on-surface-variant leading-relaxed">
                Con temas exclusivos de su próximo álbum "Digital Pulse", la noche será una fusión atmosférica de visuales neón, líneas de bajo pesadas y melodías inquietantes. No te pierdas el evento que los críticos llaman "la experiencia definitiva en vivo del año".
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-1.5 rounded-full bg-secondary/10 text-secondary border border-secondary/20 font-label-md text-label-md">SYNTH-ROCK</span>
                <span className="px-4 py-1.5 rounded-full bg-secondary/10 text-secondary border border-secondary/20 font-label-md text-label-md">ELECTRO-PUNK</span>
                <span className="px-4 py-1.5 rounded-full bg-secondary/10 text-secondary border border-secondary/20 font-label-md text-label-md">VISUALES EN VIVO</span>
              </div>
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
                  <p className="font-display text-headline-md text-white">20 junio</p>
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
                    <p className="font-display text-headline-md text-white">21:00 hs</p>
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
                <img alt="Mapa de Apollo Theater" className="absolute inset-0 w-full h-full object-cover grayscale opacity-60" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOFr86uKyAbhBaZI5MBwUMhTkl2AhxJFpkotJl4VSs_W15Ut6Qa64mBMyw2N8fw1ibMAXj10Su-CcPCHoMqrJW6thnNM2AnVHFxO44Hk2T8TUcUrvyqiMlpCLUSLwA3HLRO3YupU5HTzDohes-kH7RNrmxbQWiaC0VKfH8ZDJYoswoYB8Y1LtfkeQ2UIopCRe_UGnfzNKbwiZ4POeI3BwVYyMopPgPdu2nac0gRugLS9cvnVJqJ8ms9PENocDdZnSVdlVkCwFacXk" />
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
