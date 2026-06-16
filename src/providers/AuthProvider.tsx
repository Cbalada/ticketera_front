"use client";

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid hydration mismatch by waiting until mounted
  if (!mounted) {
    return null;
  }

  return <>{children}</>;
}
