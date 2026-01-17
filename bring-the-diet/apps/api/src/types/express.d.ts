import "express";

declare global {
  namespace Express {
    interface Request {
      auth?: {
        sub: string;
        email?: string;
        roles: string[];
        permissions?: string[];
        raw?: any;
      };
    }
  }
}

export {};
