"use client";

import { AuthProvider } from './AuthProvider';
import { ReactQueryProvider } from './ReactQueryProvider';
import { SocketProvider } from './SocketProvider';
import { ReservationLeaveGuardProvider } from '@/components/checkout/ReservationLeaveGuard';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      <AuthProvider>
        <SocketProvider>
          <ReservationLeaveGuardProvider>
            {children}
          </ReservationLeaveGuardProvider>
        </SocketProvider>
      </AuthProvider>
    </ReactQueryProvider>
  );
}
