'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import {
  PublicClientApplication,
  EventType,
  AuthenticationResult,
} from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { msalConfig } from '../lib/msalConfig';

export function MsalAuthProvider({ children }: { children: ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [cryptoError, setCryptoError] = useState(false);
  const msalInstanceRef = useRef<PublicClientApplication | null>(null);

  useEffect(() => {
    if (!window.crypto?.subtle) {
      console.error(
        'MSAL requires the Web Crypto API (crypto.subtle), which is only available in secure contexts (HTTPS or http://localhost). ' +
        'Current origin:', window.location.origin
      );
      setCryptoError(true);
      return;
    }

    const msalInstance = new PublicClientApplication(msalConfig);
    msalInstanceRef.current = msalInstance;

    msalInstance.initialize().then(() => {
      const accounts = msalInstance.getAllAccounts();
      if (accounts.length > 0) {
        msalInstance.setActiveAccount(accounts[0]);
      }

      msalInstance.addEventCallback((event) => {
        if (
          event.eventType === EventType.LOGIN_SUCCESS &&
          (event.payload as AuthenticationResult)?.account
        ) {
          msalInstance.setActiveAccount(
            (event.payload as AuthenticationResult).account
          );
        }
      });

      setIsInitialized(true);
    });
  }, []);

  if (cryptoError) {
    return <>{children}</>;
  }

  if (!isInitialized || !msalInstanceRef.current) {
    return null;
  }

  return <MsalProvider instance={msalInstanceRef.current}>{children}</MsalProvider>;
}
