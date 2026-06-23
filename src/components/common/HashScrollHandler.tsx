"use client";

import { useEffect } from 'react';

export default function HashScrollHandler() {
  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash;
      if (hash) {
        const id = hash.replace('#', '');
        const el = document.getElementById(id);
        if (el) {
          // small delay to ensure layout is ready
          setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
        }
      }
    };

    // Run once on mount in case the URL already has a hash
    scrollToHash();

    // Also handle future hash changes
    window.addEventListener('hashchange', scrollToHash);
    return () => window.removeEventListener('hashchange', scrollToHash);
  }, []);

  return null;
}
