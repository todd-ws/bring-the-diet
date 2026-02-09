'use client';

import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

const MsalAuthProvider = dynamic(
  () => import('./MsalAuthProvider').then(m => ({ default: m.MsalAuthProvider })),
  { ssr: false }
);

export function ClientProviders({ children }: { children: ReactNode }) {
  return <MsalAuthProvider>{children}</MsalAuthProvider>;
}
