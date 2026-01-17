import { z } from "zod";
import { BaseDoc } from "./base.js";

export const PermissionInput = z.object({
  key: z.string().min(3),
  description: z.string().optional()
});

export const RoleInput = z.object({
  name: z.enum(["admin", "editor", "moderator", "user"]),
  permissions: z.array(z.string()).default([])
});

export const UserInput = z.object({
  oidcSub: z.string().min(3),
  email: z.string().email().optional(),
  displayName: z.string().optional(),
  roles: z.array(z.enum(["admin", "editor", "moderator", "user"])).default(["user"])
});

export const PermissionDoc = BaseDoc.merge(PermissionInput).extend({ _id: z.any().optional() });
export const RoleDoc = BaseDoc.merge(RoleInput).extend({ _id: z.any().optional() });
export const UserDoc = BaseDoc.merge(UserInput).extend({ _id: z.any().optional() });

export type PermissionInput = z.infer<typeof PermissionInput>;
export type RoleInput = z.infer<typeof RoleInput>;
export type UserInput = z.infer<typeof UserInput>;

export type PermissionDoc = z.infer<typeof PermissionDoc>;
export type RoleDoc = z.infer<typeof RoleDoc>;
export type UserDoc = z.infer<typeof UserDoc>;
