"use client";

import Link from 'next/link';
import useExperienceNavigation from '@/hooks/useExperienceNavigation';

export function Footer() {
  const navigateToExperience = useExperienceNavigation();
 
  return (
    <footer className="bg-surface-container-lowest dark:bg-surface-container-lowest border-t border-white/10 w-full pt-20 pb-10">
      <div className="max-w-container-max mx-auto px-margin-desktop">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter mb-20">
            <div className="md:col-span-4">
                <div className="font-display text-headline-md font-extrabold text-primary-container mb-6">Ticket +</div>
                <p className="text-on-surface-variant font-body-md max-w-sm">La plataforma definitiva para vivir la música en vivo. Sentí el pulso de cada show con acceso exclusivo y experiencias premium.</p>
            </div>
            <div className="md:col-span-2 md:col-start-7">
                <h5 className="font-display font-bold text-white uppercase tracking-wider mb-6">Explorar</h5>
                <ul className="space-y-4">
                    <li><Link href="/" className="text-on-surface-variant hover:text-primary-fixed transition-colors">Inicio</Link></li>
                    <li><Link href="/events" className="text-on-surface-variant hover:text-primary-fixed transition-colors">Shows</Link></li>
                    <li><Link onClick={navigateToExperience} href="/#ticket-plus-experience" className="text-on-surface-variant hover:text-primary-fixed transition-colors">Experiencias</Link></li>
                </ul>
            </div>
            <div className="md:col-span-4">
                <h5 className="font-display font-bold text-white uppercase tracking-wider mb-6">Newsletter</h5>
                <div className="flex gap-2">
                    <input type="email" placeholder="Tu email" className="bg-surface-container-high border-0 rounded-lg px-4 py-2 w-full text-on-surface focus:ring-2 focus:ring-primary-fixed" />
                    <button className="bg-primary-fixed text-on-primary-fixed px-4 py-2 rounded-lg font-label-md hover:opacity-80 transition-all">OK</button>
                </div>
            </div>
        </div>
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-on-surface-variant text-sm opacity-80">© 2024 Ticket +. Todos los derechos reservados.</p>
            <div className="flex space-x-6">
                <a href="#" className="text-on-surface-variant hover:text-primary-fixed transition-colors"><span className="material-symbols-outlined">share</span></a>
                <a href="#" className="text-on-surface-variant hover:text-primary-fixed transition-colors"><span className="material-symbols-outlined">public</span></a>
                <a href="#" className="text-on-surface-variant hover:text-primary-fixed transition-colors"><span className="material-symbols-outlined">mail</span></a>
            </div>
        </div>
      </div>
    </footer>
  );
}
