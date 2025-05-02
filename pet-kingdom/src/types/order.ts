// src/types/order.ts

import { User } from "./user";

export interface OrderItem {
  product: string; // product ID
  quantity: number;
  price: number;
}

export interface OrderStatusHistory {
  status: "Chờ xác nhận" | "Đã xác nhận" | "Đang giao" | "Đã giao" | "Đã hủy";
  date: string;
  note?: string;
  updatedBy?: string; // user ID
}

export interface ShippingAddress {
  street: string;
  ward: string;
  district: string;
  city: string;
}

export interface Order {
  _id: string;
  user: string; // user ID
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  shippingAddress: ShippingAddress;
  phone: string;
  paymentMethod: "COD" | "Bank Transfer";
  status: "Chờ xác nhận" | "Đã xác nhận" | "Đang giao" | "Đã giao" | "Đã hủy";
  statusHistory: OrderStatusHistory[];
  assignedTo?: User | null;
  promoCode?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}
