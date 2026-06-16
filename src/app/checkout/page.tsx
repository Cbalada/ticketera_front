"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { useReservationStore } from '@/store/reservationStore';

export default function CheckoutPage() {
  const router = useRouter();
  const { selectedSector, selectedQuantity } = useReservationStore();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'ewallet' | 'transfer' | null>('card');

  const total = selectedSector ? parseInt(selectedSector.price) * selectedQuantity : 0;
  const serviceCharge = total * 0.15; // Mock 15%
  const finalTotal = total + serviceCharge;

  const handleContinue = () => {
    if (paymentMethod === 'card') {
      router.push('/checkout/payment');
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 pb-24 px-6 md:px-margin-desktop max-w-container-max mx-auto">
        {/* Progress Indicator */}
        <div className="flex justify-center mb-16">
          <div className="flex items-center space-x-4 md:space-x-12">
            <div className="flex flex-col items-center opacity-60">
              <div className="w-10 h-10 rounded-full border-2 border-outline flex items-center justify-center font-display font-bold">1</div>
              <span className="text-[10px] font-bold uppercase tracking-widest mt-2">Selección</span>
            </div>
            <div className="w-12 h-px bg-outline-variant"></div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full border-2 border-primary-fixed bg-primary-fixed text-black flex items-center justify-center font-display font-bold">2</div>
              <span className="text-[10px] font-bold uppercase tracking-widest mt-2 text-primary-fixed">Detalles</span>
            </div>
            <div className="w-12 h-px bg-outline-variant"></div>
            <div className="flex flex-col items-center opacity-40">
              <div className="w-10 h-10 rounded-full border-2 border-outline flex items-center justify-center font-display font-bold">3</div>
              <span className="text-[10px] font-bold uppercase tracking-widest mt-2">Pago</span>
            </div>
            <div className="w-12 h-px bg-outline-variant"></div>
            <div className="flex flex-col items-center opacity-40">
              <div className="w-10 h-10 rounded-full border-2 border-outline flex items-center justify-center font-display font-bold">4</div>
              <span className="text-[10px] font-bold uppercase tracking-widest mt-2">Finalizar</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
          {/* Checkout Form Section */}
          <section className="lg:col-span-8 space-y-8">
            <div className="glass-panel p-8 rounded-xl border border-white/5">
              <h1 className="font-display text-3xl font-extrabold text-white mb-8">Formulario de Compra</h1>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block">Nombre completo</label>
                    <input className="w-full bg-surface-container-low border border-white/5 rounded-lg p-4 focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed transition-all outline-none text-on-surface" placeholder="Ej. Juan Pérez" type="text" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block">DNI/Cédula</label>
                    <input className="w-full bg-surface-container-low border border-white/5 rounded-lg p-4 focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed transition-all outline-none text-on-surface" placeholder="Número de identificación" type="text" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block">Teléfono</label>
                  <div className="flex">
                    <span className="bg-surface-container-high border border-white/5 border-r-0 rounded-l-lg px-4 flex items-center text-on-surface-variant text-sm font-bold">+54</span>
                    <input className="w-full bg-surface-container-low border border-white/5 rounded-r-lg p-4 focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed transition-all outline-none text-on-surface" placeholder="11 1234 5678" type="tel" />
                  </div>
                </div>
                
                <div className="pt-8 border-t border-white/5">
                  <h3 className="font-display text-xl font-bold text-white mb-6">Método de Pago</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button 
                      type="button" 
                      onClick={() => setPaymentMethod('card')}
                      className={`flex flex-col items-center justify-center p-6 rounded-xl transition-all ${paymentMethod === 'card' ? 'border-2 border-primary-fixed bg-primary-fixed/5' : 'border border-white/5 hover:bg-white/5 group'}`}
                    >
                      <span className={`material-symbols-outlined mb-2 ${paymentMethod === 'card' ? 'text-primary-fixed' : 'text-on-surface-variant group-hover:text-white'}`} style={paymentMethod === 'card' ? { fontVariationSettings: "'FILL' 1" } : {}}>credit_card</span>
                      <span className="text-[11px] font-bold uppercase tracking-wider">Tarjeta</span>
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setPaymentMethod('ewallet')}
                      className={`flex flex-col items-center justify-center p-6 rounded-xl transition-all ${paymentMethod === 'ewallet' ? 'border-2 border-primary-fixed bg-primary-fixed/5' : 'border border-white/5 hover:bg-white/5 group'}`}
                    >
                      <span className={`material-symbols-outlined mb-2 ${paymentMethod === 'ewallet' ? 'text-primary-fixed' : 'text-on-surface-variant group-hover:text-white'}`} style={paymentMethod === 'ewallet' ? { fontVariationSettings: "'FILL' 1" } : {}}>account_balance_wallet</span>
                      <span className="text-[11px] font-bold uppercase tracking-wider">E-wallet</span>
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setPaymentMethod('transfer')}
                      className={`flex flex-col items-center justify-center p-6 rounded-xl transition-all ${paymentMethod === 'transfer' ? 'border-2 border-primary-fixed bg-primary-fixed/5' : 'border border-white/5 hover:bg-white/5 group'}`}
                    >
                      <span className={`material-symbols-outlined mb-2 ${paymentMethod === 'transfer' ? 'text-primary-fixed' : 'text-on-surface-variant group-hover:text-white'}`} style={paymentMethod === 'transfer' ? { fontVariationSettings: "'FILL' 1" } : {}}>qr_code_2</span>
                      <span className="text-[11px] font-bold uppercase tracking-wider">Transferencia</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </section>

          {/* Sidebar Summary */}
          <aside className="lg:col-span-4 space-y-6 sticky top-24">
            <div className="glass-panel p-6 rounded-xl border border-white/5 space-y-6">
              <div className="relative rounded-lg overflow-hidden h-40">
                <img alt="Electronic Echoes Event" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEK-8wGZYSbipMerC9-VRT6mnL1wUWimHa3UE9RQFj41ZKr4A2kfICxEy9Iv-JXhrc1ztM7VK3G8HPu82DGikT2c2I-EvxK9eI4iC5q9usRvdbjG7zbPidGdjLZooXAR_1t1yeAQhWrvX4mMJjvfCuAdkFo4zLgxSOA7uZfrOB2V3WUe_j9pH04CEbwg37naF-O9yrhW7Tf7PkQ8ECwMhmBLla66rX5HfOLE-g2rSTYuEDVftO_jj2vE3rYznJjMIhZpv5cDOeR8c" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <h2 className="font-display font-extrabold text-xl text-white">Electronic Echoes</h2>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant font-medium">Fecha</span>
                  <span className="font-bold text-white">20 Junio 2026</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant font-medium">Sector</span>
                  <span className="font-bold text-secondary">{selectedSector?.sector || 'VIP'}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant font-medium">Cantidad</span>
                  <span className="font-bold text-white">{selectedQuantity || 1} x ${total.toLocaleString('es-AR')}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant font-medium">Service Charge</span>
                  <span className="font-bold text-white">${serviceCharge.toLocaleString('es-AR')}</span>
                </div>
                
                <div className="pt-4 border-t border-white/5 flex justify-between items-end">
                  <span className="font-display font-extrabold text-xl text-white uppercase tracking-tighter">Total</span>
                  <span className="font-display font-extrabold text-2xl text-primary-fixed">${finalTotal.toLocaleString('es-AR')}</span>
                </div>
              </div>
              
              <button 
                onClick={handleContinue}
                className="w-full py-4 bg-primary-fixed text-black font-display font-extrabold rounded-sm uppercase tracking-widest text-xs primary-glow transition-all active:scale-95"
              >
                Continuar a Pago
              </button>
              <p className="text-[10px] text-center text-on-surface-variant px-4 font-medium leading-relaxed">
                Al continuar, aceptas nuestros términos y condiciones de servicio.
              </p>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
