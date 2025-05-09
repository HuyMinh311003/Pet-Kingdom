import { Category } from '../types/admin';

export const STATIC_TABS: Category[] = [
  {
    _id: 'pets',
    name: 'Thú cưng',
    type: 'pet',
    isActive: true,
  },
  {
    _id: 'tools', 
    name: 'Vật dụng',
    type: 'tool',
    isActive: true,
  }
];