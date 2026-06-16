"use client";

import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';

export default function AdminDashboardPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 pb-24 px-6 md:px-margin-desktop max-w-container-max mx-auto">
        <div className="mb-12">
          <h1 className="text-3xl font-display font-extrabold text-white">Panel de Administración</h1>
          <p className="text-on-surface-variant mt-2">Métricas y gestión de ventas de la plataforma.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass-panel p-6 rounded-xl border border-white/5 border-l-4 border-l-primary-fixed">
            <span className="text-on-surface-variant text-xs uppercase tracking-widest font-bold block mb-2">Ventas Totales</span>
            <div className="text-3xl font-display font-extrabold text-white">$ 14.5M</div>
            <div className="text-xs text-primary-fixed mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              +12% este mes
            </div>
          </div>
          <div className="glass-panel p-6 rounded-xl border border-white/5 border-l-4 border-l-secondary">
            <span className="text-on-surface-variant text-xs uppercase tracking-widest font-bold block mb-2">Tickets Vendidos</span>
            <div className="text-3xl font-display font-extrabold text-white">4,250</div>
          </div>
          <div className="glass-panel p-6 rounded-xl border border-white/5 border-l-4 border-l-tertiary-fixed">
            <span className="text-on-surface-variant text-xs uppercase tracking-widest font-bold block mb-2">Eventos Activos</span>
            <div className="text-3xl font-display font-extrabold text-white">12</div>
          </div>
        </div>

        <h3 className="text-xl font-display font-bold text-white mb-6">Top Eventos (Ventas)</h3>
        <div className="glass-panel rounded-xl overflow-hidden border border-white/5">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="p-4 text-xs uppercase tracking-widest text-on-surface-variant font-bold">Evento</th>
                <th className="p-4 text-xs uppercase tracking-widest text-on-surface-variant font-bold">Recaudación</th>
                <th className="p-4 text-xs uppercase tracking-widest text-on-surface-variant font-bold">Tickets</th>
                <th className="p-4 text-xs uppercase tracking-widest text-on-surface-variant font-bold">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr className="hover:bg-white/5 transition-colors">
                <td className="p-4 font-bold text-white">Pulse Evolution Tour</td>
                <td className="p-4 text-primary-fixed font-medium">$ 8.2M</td>
                <td className="p-4 text-on-surface-variant">2,100 / 3,000</td>
                <td className="p-4">
                  <span className="bg-primary-fixed/20 text-primary-fixed px-2 py-1 rounded text-[10px] font-bold uppercase">A la venta</span>
                </td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="p-4 font-bold text-white">Neo Echoes</td>
                <td className="p-4 text-primary-fixed font-medium">$ 4.5M</td>
                <td className="p-4 text-on-surface-variant">958 / 1,000</td>
                <td className="p-4">
                  <span className="bg-error/20 text-error px-2 py-1 rounded text-[10px] font-bold uppercase">Casi Agotado</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
      <Footer />
    </>
  );
}
