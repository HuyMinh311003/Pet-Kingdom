import { TabPermission } from '../types/role';

export const adminTabs: TabPermission[] = [
  {
    path: '/admin/categories',
    title: 'Category Manager',
    allowedRoles: ['admin']
  },
  {
    path: '/admin/products',
    title: 'Product Management', 
    allowedRoles: ['admin']
  },
  {
    path: '/admin/orders',
    title: 'Order Management',
    allowedRoles: ['admin']
  },
  {
    path: '/admin/staff',
    title: 'Staff Accounts',
    allowedRoles: ['admin']
  },
  {
    path: '/admin/assigned-orders',
    title: 'Assigned Orders',
    allowedRoles: ['shipper']
  },
  {
    path: '/admin/analytics',
    title: 'Analytics',
    allowedRoles: ['admin']
  },
  {
    path: '/admin/promotions',
    title: 'Promotions',
    allowedRoles: ['admin']
  }
];
