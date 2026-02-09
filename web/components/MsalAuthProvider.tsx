'use client';

import { ReactNode, useEffect, useState } from 'react';
import {
  PublicClientApplication,
  EventType,
  AuthenticationResult,
} from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { msalConfig } from '../lib/msalConfig';

const msalInstance = new PublicClientApplication(msalConfig);

export function MsalAuthProvider({ children }: { children: ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
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

  if (!isInitialized) {
    return null;
  }

  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
}
