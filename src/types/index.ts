export type UserRole = 'customer' | 'admin' | 'super_admin' | 'pharmacist';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  phone?: string;
  createdAt?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  genericName?: string;
  generic_name?: string;
  description: string;
  price: number;
  previousPrice?: number;
  previous_price?: number;
  rating?: number;
  stockQuantity: number;
  stock_quantity?: number;
  lowStockThreshold?: number;
  low_stock_threshold?: number;
  prescriptionRequired: boolean;
  prescription_required?: boolean;
  pharmacistReviewRequired?: boolean;
  active: boolean;
  featured: boolean;
  imageUrl: string;
  image_url?: string;
  category: string;
  categoryId?: string;
  createdAt?: string;
  updatedAt?: string;
  strength?: string;
  packSize?: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface Order {
  id: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: string;
  deliveryMethod?: string;
  deliveryMethodName?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  paymentReference?: string;
  paymentConfirmed?: boolean;
  paymentConfirmedAt?: string;
  confirmedBy?: string;
  receiptUrl?: string;
  prescriptionUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
