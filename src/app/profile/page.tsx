"use client";

import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { useAuthStore } from '@/store/authStore';
import { usePurchases } from '@/hooks/usePurchases';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const { data: purchases, isLoading, isError, isSuccess } = usePurchases();

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 pb-24 px-6 md:px-margin-desktop max-w-container-max mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-display font-extrabold text-white">Mi Perfil</h1>
          <button 
            onClick={logout}
            className="text-error font-bold uppercase text-xs tracking-wider border border-error/20 px-4 py-2 rounded-lg hover:bg-error/10 transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-panel p-8 rounded-xl border border-white/5 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-primary-fixed/20 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-4xl text-primary-fixed">person</span>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">{user?.name || 'Fan Destacado'}</h2>
              <p className="text-on-surface-variant mb-6">{user?.email || 'fan@ticketplus.com'}</p>
              <div className="w-full bg-surface-container-low rounded-lg p-4 text-left">
                <span className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">Nivel</span>
                <p className="text-primary-fixed font-bold text-lg mt-1">Pulse Member</p>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-8 space-y-6">
            <h3 className="text-xl font-display font-bold text-white mb-6">Mis Entradas</h3>
            
            {/* Purchases list (real data) */}
            {/** Loading state */}
            {isLoading && (
              <>
                <div className="glass-panel rounded-xl flex flex-col md:flex-row overflow-hidden border border-white/5 group animate-pulse">
                  <div className="md:w-1/3 bg-surface-container-high relative overflow-hidden h-40"></div>
                  <div className="p-6 md:w-2/3 flex flex-col justify-center">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-[10px] uppercase tracking-widest text-primary-fixed font-bold mb-1 block">Próximo Show</span>
                        <h4 className="text-xl font-bold text-white uppercase">&nbsp;</h4>
                      </div>
                      <div className="bg-white/10 rounded px-2 py-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">qr_code_2</span>
                        <span className="text-xs font-bold">&nbsp;</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-on-surface-variant">
                      <div>
                        <span className="block text-[10px] uppercase tracking-wider mb-1">Fecha</span>
                        <span className="text-white font-medium">&nbsp;</span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase tracking-wider mb-1">Sector</span>
                        <span className="text-secondary font-medium">&nbsp;</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/** Error state */}
            {isError && (
              <div className="glass-panel rounded-xl p-6 border border-white/5 text-on-surface-variant">
                No se pudo cargar el historial de compras.
              </div>
            )}

            {/** Empty state */}
            {isSuccess && purchases && purchases.length === 0 && (
              <div className="glass-panel rounded-xl p-6 border border-white/5 text-on-surface-variant flex flex-col items-center">
                <p className="mb-4">Todavía no realizaste ninguna compra.</p>
                <Link href="/events" className="text-primary-fixed font-bold uppercase text-xs tracking-wider border border-primary-fixed/20 px-4 py-2 rounded-lg hover:bg-primary-fixed/10 transition-colors">
                  Explorar eventos
                </Link>
              </div>
            )}

            {/** Render purchases */}
            {isSuccess && purchases && purchases.length > 0 && (
              <div className="space-y-4">
                {purchases.map((purchase) => {
                  const reservation = purchase.reservation as any;
                  const event = reservation?.eventSector?.event as any;
                  const sector = reservation?.eventSector?.sector as string | undefined;
                  const dateStr = event?.date ? new Date(event.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

                  return (
                    <div key={purchase.id} className="glass-panel rounded-xl flex flex-col md:flex-row overflow-hidden border border-white/5 group">
                      <div className="md:w-1/3 bg-surface-container-high relative overflow-hidden">
                        <img src={event?.imageUrl || '/images/default-event.jpg'} alt={event?.title || 'Event'} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                      </div>
                      <div className="p-6 md:w-2/3 flex flex-col justify-center">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <span className="text-[10px] uppercase tracking-widest text-primary-fixed font-bold mb-1 block">Próximo Show</span>
                            <h4 className="text-xl font-bold text-white uppercase">{event?.title || 'Evento'}</h4>
                          </div>
                          <div className="bg-white/10 rounded px-2 py-1 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">qr_code_2</span>
                            <span className="text-xs font-bold">Ver QR</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-on-surface-variant">
                          <div>
                            <span className="block text-[10px] uppercase tracking-wider mb-1">Fecha</span>
                            <span className="text-white font-medium">{dateStr}</span>
                          </div>
                          <div>
                            <span className="block text-[10px] uppercase tracking-wider mb-1">Sector</span>
                            <span className="text-secondary font-medium">{sector || '—'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
