export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: any;
  stock: number;
  imageUrl: string;
  isActive: boolean;
  birthday?: string;
  age?: number;
  gender?: 'male' | 'female';
  vaccinated?: boolean;
  brand?: string;
  type?: string
}