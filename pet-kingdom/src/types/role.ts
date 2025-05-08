export type UserRole = 'Admin' | 'Shipper' | 'Customer';

export interface TabPermission {
  path: string;
  title: string;
  allowedRoles: UserRole[];
}
