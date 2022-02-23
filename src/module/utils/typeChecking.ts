/**
 * Type guard: Checks if given object x has the key.
 */
export const has = <K extends string>(key: K, x: object): x is { [key in K]: unknown } => key in x;

export const isNotNullObject = (obj: unknown): obj is object => {
  return obj !== null && typeof obj === 'object' && !Array.isArray(obj);
};

export const isValidRole = (role: string): role is keyof typeof CONST.USER_ROLES => {
  return Object.keys(CONST.USER_ROLES).includes(role);
};

export const isValidPermission = (permission: string): permission is keyof typeof CONST.USER_PERMISSIONS => {
  return Object.keys(CONST.USER_PERMISSIONS).includes(permission);
};
