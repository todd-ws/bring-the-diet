import type { Request } from "express";
import type { ApiUser } from "@nutri/shared";

export interface AuthenticatedRequest extends Request {
  user?: ApiUser;
}

export interface CollectionConfig {
  name: string;
  envVar: string;
  permissions: {
    read: string;
    write: string;
    delete: string;
  };
}
