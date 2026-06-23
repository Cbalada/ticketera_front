"use client";

import { useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function useExperienceNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  const navigate = useCallback((e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const id = 'ticket-plus-experience';

    if (pathname === '/') {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      // fallback: set hash so HashScrollHandler can handle it
      window.location.hash = `#${id}`;
      return;
    }

    // navigate to home with hash; HashScrollHandler will handle scrolling
    router.push(`/#${id}`);
  }, [pathname, router]);

  return navigate;
}
