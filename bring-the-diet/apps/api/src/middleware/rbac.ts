import type { NextFunction, Request, Response } from 'express';

function forbidden(res: Response, message: string) {
  return res.status(403).json({ error: 'forbidden', message });
}

export function requirePermission(permission: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const p = req.auth?.permissions ?? [];
    if (p.includes('*') || p.includes(permission)) return next();
    return forbidden(res, `Missing permission: ${permission}`);
  };
}

export function requireAnyPermission(permissions: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const p = req.auth?.permissions ?? [];
    if (p.includes('*')) return next();
    if (permissions.some((perm) => p.includes(perm))) return next();
    return forbidden(res, `Missing required permission(s): ${permissions.join(', ')}`);
  };
}
