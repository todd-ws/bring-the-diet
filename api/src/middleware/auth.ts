import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import type { AuthenticatedRequest } from "../types/index.js";
import type { ApiUser } from "@nutri/shared";

const client = process.env.OIDC_AUTHORITY
  ? jwksClient({
      jwksUri: `${process.env.OIDC_AUTHORITY}/.well-known/jwks.json`,
      cache: true,
      rateLimit: true,
    })
  : null;

function getSigningKey(kid: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!client) {
      reject(new Error("OIDC not configured"));
      return;
    }
    client.getSigningKey(kid, (err, key) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(key?.getPublicKey() || "");
    });
  });
}

async function verifyOidcToken(token: string): Promise<ApiUser | null> {
  try {
    const decoded = jwt.decode(token, { complete: true });
    if (!decoded || !decoded.header.kid) {
      return null;
    }

    const signingKey = await getSigningKey(decoded.header.kid);
    const verified = jwt.verify(token, signingKey, {
      audience: process.env.OIDC_AUDIENCE,
      issuer: process.env.OIDC_AUTHORITY,
    }) as jwt.JwtPayload;

    return {
      id: verified.sub || verified.oid || "unknown",
      email: verified.email || verified.preferred_username,
      roles: verified.roles || ["user"],
      permissions: verified.permissions || [],
    };
  } catch {
    return null;
  }
}

function getDevUser(username: string): ApiUser {
  return {
    id: `dev-${username}`,
    email: `${username}@dev.local`,
    roles: ["admin"],
    permissions: ["*"],
  };
}

export async function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  // Dev escape hatch
  if (process.env.ALLOW_DEV_USER_HEADER === "true") {
    const devUser = req.headers["x-dev-user"];
    if (typeof devUser === "string" && devUser.length > 0) {
      req.user = getDevUser(devUser);
      next();
      return;
    }
  }

  // OIDC JWT validation
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing or invalid authorization header" });
    return;
  }

  const token = authHeader.slice(7);
  const user = await verifyOidcToken(token);

  if (!user) {
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }

  req.user = user;
  next();
}

export function requirePermission(permission: string) {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): void => {
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const hasPermission =
      user.permissions.includes("*") || user.permissions.includes(permission);

    if (!hasPermission) {
      res.status(403).json({ error: "Insufficient permissions" });
      return;
    }

    next();
  };
}
