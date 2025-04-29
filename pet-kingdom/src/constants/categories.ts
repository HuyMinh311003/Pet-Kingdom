import { Category } from '../types/admin';

export const STATIC_TABS: Category[] = [
  {
    _id: 'pets',
    name: 'Thú cưng',
    type: 'pet',
    isActive: true,
    order: 0
  },
  {
    _id: 'tools', 
    name: 'Vật dụng',
    type: 'tool',
    isActive: true,
    order: 1
  }
];

export interface TabConfig {
  id: 'pet' | 'tool';
  label: string;
}

export const PRODUCT_CATEGORY_TABS: TabConfig[] = [
  { id: 'pet',  label: 'THÚ CƯNG' },
  { id: 'tool', label: 'VẬT DỤNG' },
];