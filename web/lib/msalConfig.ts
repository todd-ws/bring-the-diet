import { Configuration, LogLevel } from '@azure/msal-browser';

export const msalConfig: Configuration = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_AZURE_CLIENT_ID || '',
    authority:
      process.env.NEXT_PUBLIC_AZURE_AUTHORITY ||
      'https://login.microsoftonline.com/common',
    redirectUri: typeof window !== 'undefined' ? window.location.origin : '',
    postLogoutRedirectUri:
      typeof window !== 'undefined' ? window.location.origin : '',
  },
  cache: {
    cacheLocation: 'localStorage',
  },
  system: {
    loggerOptions: {
      logLevel: LogLevel.Warning,
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return;
        if (level === LogLevel.Error) console.error(message);
        else if (level === LogLevel.Warning) console.warn(message);
      },
    },
  },
};

export const loginRequest = {
  scopes: [
    process.env.NEXT_PUBLIC_API_SCOPE || 'User.Read',
  ],
};

export const graphScopes = {
  scopes: ['User.Read'],
};
