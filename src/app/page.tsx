import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import EventsList from '@/components/home/EventsList';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative h-[90vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              className="w-full h-full object-cover grayscale brightness-50" 
              alt="Hero image" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGjIEzsNv-KtgBy0COmv9z7ZTBijJLZLmoCrDAASBMyn5XATxnEBVCHjauTww4Gg9Yw3NP3GAouSZ79v2enurhutJBEusGfF8qlKHR_minsY71Z7uZq681jq7oUCR47_F4ZYa2D1D_KywmhsYROKSGj_kAe6Y2N00wOU1QOaelc-wR6A9Eq-PRIo9k_jhOn5uEgaqbEUodcQbLFzUlOMXIY_I48Bewcffjr94n4HuGIfGLAZymA8pFVtCFKNXK-UaIZGuIjbg6jt1M" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-surface/40"></div>
          </div>
          <div className="relative z-10 px-margin-desktop max-w-container-max mx-auto w-full">
            <div className="max-w-3xl">
              <span className="inline-flex items-center px-4 py-1 rounded-full bg-primary-fixed/20 border border-primary-fixed/30 text-primary-fixed font-label-md mb-6">
                <span className="w-2 h-2 rounded-full bg-primary-fixed mr-2 pulse-dot"></span> EN VIVO AHORA
              </span>
              <h1 className="font-display text-display mb-8 uppercase leading-tight">
                SENTÍ EL <span className="text-primary-fixed italic">PULSO</span>
              </h1>
              <p className="font-body-lg text-on-surface-variant max-w-xl mb-12">
                Viví lo mejor de la música en vivo con la plataforma de ticketing más innovadora. Acceso exclusivo, experiencias premium y el pulso de la noche en tus manos.
              </p>
            </div>
          </div>
          {/* Ticker */}
          <div className="absolute bottom-0 w-full glass-panel py-4 border-t-0 overflow-hidden">
            <div className="scrolling-text flex items-center space-x-12">
              <span className="text-primary-fixed font-display text-headline-md font-bold opacity-80 italic">TECHNO WEEKENDER</span>
              <span className="text-white font-display text-headline-md font-bold opacity-40">•</span>
              <span className="text-primary-fixed font-display text-headline-md font-bold opacity-80 italic">ROCK ARENA 2024</span>
              <span className="text-white font-display text-headline-md font-bold opacity-40">•</span>
              <span className="text-primary-fixed font-display text-headline-md font-bold opacity-80 italic">URBAN VIBES</span>
              <span className="text-white font-display text-headline-md font-bold opacity-40">•</span>
              <span className="text-primary-fixed font-display text-headline-md font-bold opacity-80 italic">FESTIVAL PULSO</span>
              <span className="text-white font-display text-headline-md font-bold opacity-40">•</span>
            </div>
          </div>
        </section>

        {/* Upcoming Shows (dynamic from API) */}
        <section className="py-24 px-margin-desktop max-w-container-max mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-display text-headline-lg mb-4">SHOWS RECOMENDADOS</h2>
              <p className="text-on-surface-variant font-body-lg">No te pierdas los eventos más calientes de la temporada.</p>
            </div>
            <Link href="/events" className="text-primary-fixed font-label-md flex items-center space-x-2 group">
              <span>VER TODOS</span>
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
            </Link>
          </div>

          <EventsList />
        </section>

        {/* Experience Section */}
        <section className="bg-surface-container-lowest py-32 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none"></div>
          <div className="px-margin-desktop max-w-container-max mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div>
                <h2 className="font-display text-display leading-none mb-8">LA EXPERIENCIA <span className="text-primary-fixed">TICKET +</span></h2>
                <p className="font-body-lg text-on-surface-variant mb-12 max-w-lg">
                  No es solo un ticket, es tu entrada a un universo de sensaciones. Descubrí todo lo que preparamos para vos antes y después del show.
                </p>
                <div className="space-y-8">
                  <div className="flex items-start space-x-6 p-6 rounded-xl glass-panel transition-colors hover:bg-white/10 group h-40">
                    <div className="bg-primary-fixed/20 p-4 rounded-lg text-primary-fixed group-hover:bg-primary-fixed group-hover:text-on-primary-fixed transition-colors">
                      <span className="material-symbols-outlined text-3xl">restaurant</span>
                    </div>
                    <div>
                      <h4 className="font-display text-headline-md mb-2">Hamburguesas de Autor</h4>
                      <p className="text-on-surface-variant">Nuestra selección de hamburguesas premium preparadas con ingredientes de alta calidad para el pulso de la noche.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-6 p-6 rounded-xl glass-panel transition-colors hover:bg-white/10 group h-40">
                    <div className="bg-secondary/20 p-4 rounded-lg text-secondary group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
                      <span className="material-symbols-outlined text-3xl">stars</span>
                    </div>
                    <div>
                      <h4 className="font-display text-headline-md mb-2">Zonas VIP Premium</h4>
                      <p className="text-on-surface-variant">Acceso preferencial, barras exclusivas y la mejor vista del escenario.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-6 p-6 rounded-xl glass-panel transition-colors hover:bg-white/10 group h-40">
                    <div className="bg-tertiary-fixed/20 p-4 rounded-lg text-tertiary-fixed group-hover:bg-tertiary-fixed group-hover:text-on-tertiary transition-colors">
                      <span className="material-symbols-outlined text-3xl">local_activity</span>
                    </div>
                    <div>
                      <h4 className="font-display text-headline-md mb-2">Actividades &amp; Pop-ups</h4>
                      <p className="text-on-surface-variant">Experiencias inmersivas y activaciones de marca únicas en cada evento.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-full border border-primary-fixed/20 p-12">
                  <div className="w-full h-full rounded-full overflow-hidden border-4 border-primary-fixed/40 relative">
                    <img className="w-full h-full object-cover" alt="Gourmet burger" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9qnY_xVrM_1xKXrIxI7SI4QfqRnd3d9zsZEFEnTit8vQHwi7-B8YGCG30-WPnlhED6GVqBHhVUNnIP6FW0CIjtTi5C26ay57DprSgAohLu08jVjnikmgliQRZEYnM144GCm9LLQv48V3tE4sHefhms7nE0v-yYXCl9qa_cQhQw-C3UcFQRf-r-JtdsYzmCBJEPmAPU7jSxZjZBoSCd2mmUcQcn2qaR-mszEkhByiNIZ-jrj_WFh5PVLuhfUO3UEcvGY2Beyys2Qij" />
                    <div className="absolute inset-0 bg-primary-fixed/10 mix-blend-overlay"></div>
                  </div>
                </div>
                {/* Floating chips */}
                <div className="absolute top-10 right-0 glass-panel px-6 py-4 rounded-full flex items-center space-x-3 transform rotate-3">
                  <span className="material-symbols-outlined text-primary-fixed">check_circle</span>
                  <span className="font-label-md">FAST PASS INCLUIDO</span>
                </div>
                <div className="absolute bottom-20 -left-10 glass-panel px-6 py-4 rounded-full flex items-center space-x-3 transform -rotate-6">
                  <span className="material-symbols-outlined text-secondary">cookie</span>
                  <span className="font-label-md">DRINK BAR EXCLUSIVE</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
