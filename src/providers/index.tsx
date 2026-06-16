"use client";

import { AuthProvider } from './AuthProvider';
import { ReactQueryProvider } from './ReactQueryProvider';
import { SocketProvider } from './SocketProvider';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      <AuthProvider>
        <SocketProvider>
          {children}
        </SocketProvider>
      </AuthProvider>
    </ReactQueryProvider>
  );
}
