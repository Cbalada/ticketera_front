"use client";

import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';

export default function TimeoutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col items-center justify-center relative px-4 overflow-hidden bg-surface">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-fixed/5 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="relative z-10 glass-panel rounded-xxl p-12 md:p-16 max-w-2xl w-full text-center flex flex-col items-center shadow-2xl">
          <div className="relative mb-10">
            <div className="w-32 h-32 rounded-full bg-white/5 flex items-center justify-center relative overflow-hidden">
              <span className="material-symbols-outlined text-[80px] text-primary-fixed" style={{ textShadow: '0 0 15px rgba(195, 244, 0, 0.4)' }}>timer_off</span>
            </div>
            <div className="absolute inset-0 w-full h-full rounded-full border border-primary-fixed/20 animate-ping opacity-50"></div>
          </div>
          
          <h1 className="font-display text-4xl md:text-5xl text-white font-extrabold mb-6 leading-[1.1] tracking-tight">
            TU TIEMPO HA <span className="text-primary-fixed" style={{ textShadow: '0 0 15px rgba(195, 244, 0, 0.4)' }}>EXPIRADO</span>
          </h1>
          <p className="text-on-surface-variant text-lg font-medium leading-relaxed mb-12 max-w-md mx-auto">
            Lo sentimos, tu tiempo de compra ha expirado. Por seguridad y para dar oportunidad a otros fans, hemos liberado tus entradas.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 w-full justify-center">
            <Link 
              href="/"
              className="bg-primary-fixed text-black px-8 py-4 rounded-sm font-extrabold text-sm uppercase tracking-widest primary-glow transition-all flex items-center justify-center gap-3 hover:scale-105 active:scale-95"
            >
              <span className="material-symbols-outlined text-xl">home</span>
              VOLVER AL INICIO
            </Link>
          </div>
        </div>
        
        <div className="mt-12 flex items-center gap-3 text-on-surface-variant/60 text-xs font-bold uppercase tracking-widest">
          <span className="w-2 h-2 rounded-full bg-primary-fixed pulse-dot"></span>
          Hay nuevos eventos disponibles en este momento
        </div>
      </main>
      <Footer />
    </>
  );
}
