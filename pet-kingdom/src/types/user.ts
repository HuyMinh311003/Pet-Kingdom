export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: "Customer" | "Admin" | "Shipper";
  isActive: boolean;
  avatar: string | null;
  addresses: Address[];
  lastLogin: string | null;
  password: string;
  isDeleted?: boolean;
  createdAt: string;
}

export interface Address {
  street: string;
  ward: string;
  district: string;
  city: string;
  isDefault: boolean;
}
