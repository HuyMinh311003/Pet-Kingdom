import { TabPermission } from '../types/role';

export const AdminTabs: TabPermission[] = [
  {
    path: '/Admin/categories',
    title: 'Category Manager',
    allowedRoles: ['Admin']
  },
  {
    path: '/Admin/products',
    title: 'Product Management', 
    allowedRoles: ['Admin']
  },
  {
    path: '/Admin/orders',
    title: 'Order Management',
    allowedRoles: ['Admin']
  },
  {
    path: '/Admin/staff',
    title: 'Staff Accounts',
    allowedRoles: ['Admin']
  },
  {
    path: '/Admin/assigned-orders',
    title: 'Assigned Orders',
    allowedRoles: ['Shipper']
  },
  {
    path: '/Admin/analytics',
    title: 'Analytics',
    allowedRoles: ['Admin']
  },
  {
    path: '/Admin/promotions',
    title: 'Promotions',
    allowedRoles: ['Admin']
  }
];
