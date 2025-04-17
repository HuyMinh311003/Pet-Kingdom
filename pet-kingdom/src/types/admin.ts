export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  stock: number;
  imageUrl: string;
  isActive: boolean;
}

export interface Category {
  id: string;
  name: string;
  type: 'pet' | 'tool';
  description?: string;
  isActive: boolean;
}