export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  stock: number;
  imageUrl: string;
  isActive: boolean;
  birthday?: string;
  age?: number;
  gender?: 'male' | 'female';
  vaccinated?: boolean;
}

export interface Category {
  _id: string;
  name: string;
  description?: string;
  type: 'pet' | 'tool';
  parent?: string | Category;
  isActive: boolean;
  order: number;
  icon?: string | null;
  children?: Category[];
}

export interface CategoryNode extends Category {
  children: CategoryNode[];
}