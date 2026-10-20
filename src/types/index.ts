export type UserRole = 'customer' | 'pharmacist' | 'admin' | 'super_admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phone: string;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  deliveryMethod?: string;
  paymentStatus?: 'pending' | 'confirmed' | 'refunded';
  paymentConfirmedAt?: string;
  paymentReference?: string;
  receiptUrl?: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentConfirmationRecord {
  id: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  amount: number;
  messageText: string;
  confirmedBy?: string;
  confirmedAt: string;
}

export interface Product {

  id: string;
  name: string;
  slug: string;
  brand: string;
  genericName?: string;
  strength?: string;
  dosageForm?: string;
  packSize?: string;
  description: string;
  composition?: string;
  directions?: string;
  warnings?: string;
  storage?: string;
  price: number;
  previousPrice?: number;
  discountPercentage?: number;
  rating: number;
  stockQuantity: number;
  lowStockThreshold: number;
  prescriptionRequired: boolean;
  pharmacistReviewRequired: boolean;
  active: boolean;
  featured: boolean;
  imageUrl: string;
  categoryId: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}
