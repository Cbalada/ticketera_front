"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useExperienceNavigation from '@/hooks/useExperienceNavigation';
import { useAuthStore } from '@/store/authStore';
import { fetchClient } from '@/lib/fetchClient';
import { useReservationLeaveGuard } from '@/components/checkout/ReservationLeaveGuard';

export function Navbar() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [open, setOpen] = useState(false);
  const navigateToExperience = useExperienceNavigation();
  const reservationLeaveGuard = useReservationLeaveGuard();

  const handleLogout = async () => {
    const confirmed = confirm('¿Estás seguro que quieres cerrar sesión?');
    if (!confirmed) return;

    try {
      await fetchClient('/auth/logout', { data: {} });
    } catch (err) {
      // ignore errors from server logout, still clear client state
    } finally {
      logout();
      router.push('/');
    }
  };

  return (
    <header className="bg-surface/80 backdrop-blur-xl dark:bg-surface/80 border-b border-white/15 dock-0 sticky top-0 z-50 shadow-md">
      <div className="flex justify-between items-center w-full px-margin-desktop py-4 max-w-container-max mx-auto relative">
        <Link href="/" className="font-display text-headline-md font-extrabold text-primary-container dark:text-primary-container">
          Ticket +
        </Link>
        <nav className="hidden md:flex items-center space-x-8 md:absolute md:left-1/2 md:-translate-x-1/2">
          <Link className="text-primary-fixed font-bold border-b-2 border-primary-fixed pb-1" href="/#inicio">Inicio</Link>
          <Link className="text-on-surface-variant hover:text-primary transition-colors" href="/events">Shows</Link>
          <Link onClick={navigateToExperience} className="text-on-surface-variant hover:text-primary transition-colors" href="/#ticket-plus-experience">Experiencias</Link>
        </nav>
        <div className="flex items-center space-x-6">
          {!isAuthenticated ? (
            <Link href="/login" className="bg-primary-fixed text-on-primary-fixed px-6 py-2 rounded-full font-label-md hover:opacity-80 transition-all duration-300 scale-95 active:scale-90 transform uppercase font-display">
              Login
            </Link>
          ) : (
            <div className="relative">
              <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-3 bg-surface-container px-4 py-2 rounded-full border border-outline-variant hover:shadow-sm"
                aria-haspopup="true"
                aria-expanded={open}
              >
                <span className="font-bold">{user?.name ?? user?.email}</span>
                <span className="material-symbols-outlined">expand_more</span>
              </button>
              {open && (
                <div className="absolute right-0 mt-2 w-44 bg-surface-container rounded-md shadow-lg border border-white/5 py-2">
                  {user?.role === 'ADMIN' && (
                    <button
                      onClick={async () => {
                        setOpen(false);
                        const allowed = await reservationLeaveGuard.promptLeave('/admin/events');
                        if (allowed) {
                          router.push('/admin/events');
                        }
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-surface/5"
                    >
                      Panel de Eventos
                    </button>
                  )}
                  <button
                    onClick={async () => {
                      setOpen(false);
                      const allowed = await reservationLeaveGuard.promptLeave('/profile');
                      if (allowed) {
                        router.push('/profile');
                      }
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-surface/5"
                  >
                    Compras
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-surface/5"
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
