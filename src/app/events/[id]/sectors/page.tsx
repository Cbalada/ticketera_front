"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { useReservationStore } from '@/store/reservationStore';
import type { EventSector, Sector } from '@/types';

// Mock data for UI layout
const MOCK_SECTORS: EventSector[] = [
  { id: 1, eventId: 1, sector: 'VIP', price: '95000', capacity: 100, availableQuantity: 42 },
  { id: 2, eventId: 1, sector: 'CAMPO', price: '45000', capacity: 500, availableQuantity: 200 },
  { id: 3, eventId: 1, sector: 'PLATEA_A', price: '65000', capacity: 200, availableQuantity: 50 },
  { id: 4, eventId: 1, sector: 'PLATEA_B', price: '65000', capacity: 200, availableQuantity: 50 },
];

export default function SectorsPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id;
  
  const [expandedSector, setExpandedSector] = useState<number | null>(null);
  const { selectedSector, selectedQuantity, setSelectedSector, setSelectedQuantity } = useReservationStore();

  const handleSectorClick = (sector: EventSector) => {
    if (expandedSector === sector.id) {
      setExpandedSector(null);
      setSelectedSector(null);
    } else {
      setExpandedSector(sector.id);
      setSelectedSector(sector);
    }
  };

  const handleQuantityChange = (delta: number) => {
    if (!selectedSector) return;
    const newQty = selectedQuantity + delta;
    if (newQty >= 1 && newQty <= Math.min(10, selectedSector.availableQuantity)) {
      setSelectedQuantity(newQty);
    }
  };

  const handleContinue = () => {
    if (selectedSector && selectedQuantity > 0) {
      // In a real app we'd call the API to create the reservation here
      router.push('/checkout');
    }
  };

  return (
    <>
      <Navbar />
      <main className="max-w-container-max mx-auto px-margin-desktop py-12">
        <div className="mb-10">
          <h1 className="font-display text-headline-lg text-white mb-2 uppercase tracking-tight">Electronic Echoes</h1>
          <div className="flex items-center gap-3 text-on-surface-variant">
            <span className="material-symbols-outlined text-primary-fixed-dim">calendar_today</span>
            <p className="font-body-md text-body-md">Sábado, 20 Junio 2026 • 21:00</p>
          </div>
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
                <div className="w-full text-center">
                  <span className="text-label-md font-label-md text-on-surface-variant tracking-[0.3em] uppercase mb-8 block">Mapa del Recinto</span>
                </div>
                
                <div className="w-4/5 h-20 bg-surface-container-highest border-b-4 border-primary-fixed flex items-center justify-center rounded-t-lg">
                  <span className="font-display text-headline-md font-extrabold text-white tracking-[0.2em]">ESCENARIO</span>
                </div>
                
                <div 
                  className={`w-1/2 h-16 glass-panel flex items-center justify-center border-primary-fixed/20 group hover:border-primary-fixed/60 transition-colors cursor-pointer ${expandedSector === 1 ? 'border-primary-fixed bg-primary-fixed/10' : ''}`}
                  onClick={() => handleSectorClick(MOCK_SECTORS[0])}
                >
                  <span className="font-label-md text-label-md font-bold text-primary-fixed-dim">VIP AREA</span>
                </div>
                
                <div className="w-full grid grid-cols-5 gap-4 items-stretch h-64">
                  <div 
                    className={`col-span-1 glass-panel flex flex-col items-center justify-center border-white/10 hover:border-secondary transition-colors cursor-pointer ${expandedSector === 3 ? 'border-secondary bg-secondary/10' : ''}`}
                    onClick={() => handleSectorClick(MOCK_SECTORS[2])}
                  >
                    <span className="rotate-[-90deg] font-label-md font-bold whitespace-nowrap">PLATEA A</span>
                  </div>
                  
                  <div 
                    className={`col-span-3 glass-panel flex items-center justify-center border-primary-fixed/10 hover:border-primary-fixed/50 transition-colors cursor-pointer relative overflow-hidden ${expandedSector === 2 ? 'border-primary-fixed bg-primary-fixed/10' : ''}`}
                    onClick={() => handleSectorClick(MOCK_SECTORS[1])}
                  >
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_#abd600_0%,_transparent_70%)]"></div>
                    <span className="font-display text-headline-md font-bold text-on-surface">CAMPO</span>
                  </div>
                  
                  <div 
                    className={`col-span-1 glass-panel flex flex-col items-center justify-center border-white/10 hover:border-secondary transition-colors cursor-pointer ${expandedSector === 4 ? 'border-secondary bg-secondary/10' : ''}`}
                    onClick={() => handleSectorClick(MOCK_SECTORS[3])}
                  >
                    <span className="rotate-[90deg] font-label-md font-bold whitespace-nowrap">PLATEA B</span>
                  </div>
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
                {MOCK_SECTORS.map((sector) => {
                  const isExpanded = expandedSector === sector.id;
                  const displayName = sector.sector === 'VIP' ? 'VIP Experience' : sector.sector === 'CAMPO' ? 'Campo parado' : sector.sector === 'PLATEA_A' ? 'Platea Lateral A' : 'Platea Lateral B';
                  
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
                          <span className="font-headline-md text-headline-md text-white">$ {parseInt(sector.price).toLocaleString('es-AR')}</span>
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
                                onClick={() => handleQuantityChange(-1)}
                                className="text-on-surface-variant hover:text-white transition-colors active:scale-90"
                              >
                                <span className="material-symbols-outlined text-[20px]">remove</span>
                              </button>
                              <span className="font-headline-md text-headline-md text-white w-4 text-center">{selectedQuantity}</span>
                              <button 
                                onClick={() => handleQuantityChange(1)}
                                className="text-primary-fixed-dim hover:text-primary-fixed transition-colors active:scale-90"
                              >
                                <span className="material-symbols-outlined text-[20px]">add</span>
                              </button>
                            </div>
                          </div>
                          {sector.sector === 'VIP' && (
                            <p className="mt-4 text-xs text-on-surface-variant/60 leading-relaxed italic">Incluye acceso prioritario y área preferencial frente al escenario.</p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Checkout Button Area */}
              <div className="mt-10 pt-6 border-t border-white/10">
                <div className="flex justify-between items-end mb-6 gap-4">
                  <span className="font-body-md text-body-md text-on-surface-variant">
                    Total ({selectedSector ? selectedQuantity : 0} entrada{selectedQuantity !== 1 ? 's' : ''})
                  </span>
                  <span className="font-headline-md text-headline-md md:text-headline-lg text-white whitespace-nowrap">
                    $ {selectedSector ? (parseInt(selectedSector.price) * selectedQuantity).toLocaleString('es-AR') : '0'}
                  </span>
                </div>
                <button 
                  disabled={!selectedSector || selectedQuantity === 0}
                  onClick={handleContinue}
                  className={`w-full font-bold py-5 rounded-xl text-label-md uppercase tracking-[0.2em] transition-all ${!selectedSector ? 'bg-surface-container-high text-on-surface-variant cursor-not-allowed' : 'bg-primary-fixed hover:bg-primary-container text-on-primary-fixed active:scale-95 primary-glow'}`}
                >
                  Continuar Compra
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
      <Footer />
    </>
  );
}
