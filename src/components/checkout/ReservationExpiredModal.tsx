"use client";

interface ReservationExpiredModalProps {
  onClose: () => void;
}

export function ReservationExpiredModal({ onClose }: ReservationExpiredModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="glass-panel max-w-xl w-full rounded-xxl p-8 border border-white/10 shadow-2xl">
        <div className="space-y-6 text-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary-fixed/10 text-primary-fixed mx-auto">
            <span className="material-symbols-outlined text-4xl">timer_off</span>
          </div>
          <div>
            <h2 className="font-display text-headline-lg text-white mb-2">TU TIEMPO HA EXPIRADO</h2>
            <p className="text-on-surface-variant leading-relaxed">
              Lo sentimos, tu tiempo de compra ha expirado. Por seguridad y para dar oportunidad a otros fans, hemos liberado tus entradas.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="mx-auto mt-4 rounded-xl bg-primary-fixed text-black py-4 px-8 font-bold uppercase tracking-[0.18em] transition hover:bg-primary-container"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}
