'use client';

import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { InteractionRequiredAuthError, InteractionStatus } from '@azure/msal-browser';
import { loginRequest } from './msalConfig';

export function useAuth() {
  const { instance, accounts, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const account = accounts[0] ?? null;

  const login = async () => {
    if (inProgress !== InteractionStatus.None) return;
    try {
      await instance.loginRedirect(loginRequest);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const logout = async () => {
    try {
      await instance.logoutRedirect({
        postLogoutRedirectUri: window.location.origin,
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getAccessToken = async (): Promise<string | null> => {
    if (!account) return null;

    try {
      const response = await instance.acquireTokenSilent({
        ...loginRequest,
        account,
      });
      return response.accessToken;
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError) {
        try {
          await instance.acquireTokenRedirect(loginRequest);
          return null;
        } catch (redirectError) {
          console.error('Token acquisition failed:', redirectError);
          return null;
        }
      }
      console.error('Token acquisition failed:', error);
      return null;
    }
  };

  return {
    isAuthenticated,
    user: account
      ? {
          name: account.name ?? account.username,
          email: account.username,
        }
      : null,
    login,
    logout,
    getAccessToken,
  };
}
