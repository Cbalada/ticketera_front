"use client";

import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import EventsList from '@/components/home/EventsList';

export default function EventsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32 pb-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="mb-12">
          <h1 className="font-display text-headline-lg mb-2">Shows</h1>
          <p className="text-on-surface-variant">Todos los eventos disponibles</p>
        </div>

        <section>
          <EventsList />
        </section>
      </main>
      <Footer />
    </>
  );
}
