import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, Order, OrderStatus } from '../types';
import { mockProducts } from '../data/mockProducts';

// Create some mock orders to start with
const mockOrders: Order[] = [
  {
    id: 'ORD-84393',
    userId: 'u1',
    customerName: 'Adebayo Johnson',
    customerEmail: 'adebayo.j@example.com',
    items: [
      { id: 'i1', productId: '1', name: 'Paracetamol 500mg Tablets', price: 850, quantity: 2 },
      { id: 'i2', productId: '2', name: 'Vitamin C 1000mg + Zinc', price: 4500, quantity: 1 }
    ],
    totalAmount: 6200,
    status: 'pending',
    shippingAddress: '12 Awolowo Road, Ikoyi, Lagos',
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
  },
  {
    id: 'ORD-84394',
    userId: 'u2',
    customerName: 'Chinwe Okonkwo',
    customerEmail: 'chinwe.o@example.com',
    items: [
      { id: 'i3', productId: '3', name: 'Omron M3 Blood Pressure Monitor', price: 35000, quantity: 1 }
    ],
    totalAmount: 35000,
    status: 'processing',
    shippingAddress: '45 Independence Layout, Enugu',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'ORD-84395',
    userId: 'u3',
    customerName: 'Fatima Bello',
    customerEmail: 'fatima.b@example.com',
    items: [
      { id: 'i4', productId: '4', name: 'Arthrotec 75', price: 8500, quantity: 2 }
    ],
    totalAmount: 17000,
    status: 'shipped',
    shippingAddress: '8 Zaria Road, Kano',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  }
];

interface AdminState {
  products: Product[];
  orders: Order[];
  
  // Product actions
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // Order actions
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  deleteOrder: (id: string) => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      products: mockProducts,
      orders: mockOrders,
      
      addProduct: (productData) => set((state) => {
        const newProduct: Product = {
          ...productData,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return { products: [...state.products, newProduct] };
      }),
      
      updateProduct: (id, productData) => set((state) => ({
        products: state.products.map(p => 
          p.id === id 
            ? { ...p, ...productData, updatedAt: new Date().toISOString() } 
            : p
        )
      })),
      
      deleteProduct: (id) => set((state) => ({
        products: state.products.filter(p => p.id !== id)
      })),
      
      updateOrderStatus: (id, status) => set((state) => ({
        orders: state.orders.map(o => 
          o.id === id 
            ? { ...o, status, updatedAt: new Date().toISOString() } 
            : o
        )
      })),
      
      deleteOrder: (id) => set((state) => ({
        orders: state.orders.filter(o => o.id !== id)
      }))
    }),
    {
      name: 'gbotemi-admin-storage',
    }
  )
);
