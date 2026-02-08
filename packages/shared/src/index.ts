export type ID = string;

export type UserRole = 'admin' | 'editor' | 'moderator' | 'user';

export type ApiUser = {
  id: ID;
  email?: string;
  roles: UserRole[];
  permissions: string[];
};

export const DIET_TYPES = [
  'keto',
  'paleo',
  'mediterranean',
  'vegan',
  'vegetarian',
  'low_fodmap',
  'dash',
  'gluten_free',
  'diabetic',
  'low_carb',
  'high_protein'
] as const;

export type DietType = (typeof DIET_TYPES)[number];
