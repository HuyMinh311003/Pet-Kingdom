export type UserRole = 'admin' | 'shipper';

export interface TabPermission {
  path: string;
  title: string;
  allowedRoles: UserRole[];
}
