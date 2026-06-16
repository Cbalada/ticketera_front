"use client";

import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { useAuthStore } from '@/store/authStore';

export default function ProfilePage() {
  const { user, logout } = useAuthStore();

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
            
            {/* Mock Ticket */}
            <div className="glass-panel rounded-xl flex flex-col md:flex-row overflow-hidden border border-white/5 group">
              <div className="md:w-1/3 bg-surface-container-high relative overflow-hidden">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPJ8PQMEgvw_r0nRcAXb7I3GBjcPZ661Wun8nzhhMa0IiNFCHPKpQmkKyUepTRumUgp6PNlJ0u8wZSbYpn8ihX8v_SrNsV_ZOENX-M5Kk8o3bhmqrQQgTablX2B1P0JRBCM97vunCPLDCFhtKNijbMopOI1DcpPbT6EOZyftsgGLSb2OnK7ZR_kHCtWHmcnG_e_yXgerQDrSER2lBMHqnpeaWRw1dlcyQKPITacGv09xKyt6bYXrbRkmHVJcUjnO-9durUSL4eLPg" alt="Event" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              </div>
              <div className="p-6 md:w-2/3 flex flex-col justify-center">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-primary-fixed font-bold mb-1 block">Próximo Show</span>
                    <h4 className="text-xl font-bold text-white uppercase">Pulse Evolution Tour</h4>
                  </div>
                  <div className="bg-white/10 rounded px-2 py-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">qr_code_2</span>
                    <span className="text-xs font-bold">Ver QR</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-on-surface-variant">
                  <div>
                    <span className="block text-[10px] uppercase tracking-wider mb-1">Fecha</span>
                    <span className="text-white font-medium">20 Junio 2026</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase tracking-wider mb-1">Sector</span>
                    <span className="text-secondary font-medium">VIP - Fila 4</span>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
