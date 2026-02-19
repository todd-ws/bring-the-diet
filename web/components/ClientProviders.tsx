'use client';

import dynamic from 'next/dynamic';
import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from '../lib/store';
import { ThemeSync } from './ThemeSync';

const MsalAuthProvider = dynamic(
  () => import('./MsalAuthProvider').then(m => ({ default: m.MsalAuthProvider })),
  { ssr: false }
);

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeSync />
      <MsalAuthProvider>{children}</MsalAuthProvider>
    </Provider>
  );
}
