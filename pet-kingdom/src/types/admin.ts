export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  stock: number;
  imageUrl: string;
  isActive: boolean;
  birthday?: string; // Ngày sinh, có thể là kiểu string hoặc Date
  age?: number; // Độ tuổi
  gender?: 'male' | 'female'; // Giới tính
  vaccinated?: boolean; // Trạng thái tiêm phòng
}

export interface Category {
  id: string;
  name: string;
  type: 'pet' | 'tool';
  description?: string;
  isActive: boolean;
}