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
  joinDate: string;
  password: string;
  isDeleted?: boolean;
}

export interface Address {
  street: string;
  ward: string;
  district: string;
  city: string;
  isDefault: boolean;
}
