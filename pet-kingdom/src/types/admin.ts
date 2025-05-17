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

export interface Category {
  _id: string;
  name: string;
  type: 'pet' | 'tool';
  parent?: string | null;
  isActive: boolean;
  children?: Category[];
}

export interface CategoryNode extends Category {
  children: CategoryNode[];
}