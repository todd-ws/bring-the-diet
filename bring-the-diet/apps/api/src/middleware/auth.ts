import type { NextFunction, Request, Response } from 'express';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { env } from '../lib/env.js';

export type AuthContext = {
  id: string;
  email?: string;
  roles: string[];
  permissions: string[];
};

declare global {
  namespace Express {
    interface Request {
      auth?: AuthContext;
    }
  }
}

function unauth(res: Response, message: string) {
  return res.status(401).json({ error: 'unauthorized', message });
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  // Local dev escape hatch
  if (env.ALLOW_DEV_USER_HEADER && req.header('X-Dev-User')) {
    const raw = req.header('X-Dev-User') || 'dev-user';
    req.auth = {
      id: raw,
      email: `${raw}@local.dev`,
      roles: ['admin'],
      permissions: ['*']
    };
    return next();
  }

  const authHeader = req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return unauth(res, 'Missing bearer token');
  }

  if (!env.OIDC_AUTHORITY || !env.OIDC_AUDIENCE) {
    return unauth(res, 'OIDC not configured (OIDC_AUTHORITY/OIDC_AUDIENCE)');
  }

  try {
    const token = authHeader.slice('Bearer '.length).trim();
    const jwksUri = new URL(`${env.OIDC_AUTHORITY.replace(/\/$/, '')}/discovery/v2.0/keys`);
    const JWKS = createRemoteJWKSet(jwksUri);

    const { payload } = await jwtVerify(token, JWKS, {
      audience: env.OIDC_AUDIENCE
    });

    const sub = (payload.sub || payload.oid || payload.uid) as string | undefined;
    if (!sub) return unauth(res, 'Token missing subject');

    const email = (payload.email || payload.preferred_username || payload.upn) as string | undefined;

    // RBAC mapping is typically done by looking up the user in DB.
    // For foundation purposes we treat everyone as user until role assignment is implemented.
    req.auth = {
      id: sub,
      email,
      roles: ['user'],
      permissions: []
    };

    return next();
  } catch (err: any) {
    return unauth(res, err?.message || 'Token verification failed');
  }
}
