import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../types';
import toast from 'react-hot-toast';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product: Product, quantity: number = 1) => {
        set((state) => {
          const existingItem = state.items.find(item => item.product.id === product.id);
          
          if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;
            if (newQuantity > product.stockQuantity) {
              toast.error(`Only ${product.stockQuantity} items in stock`);
              return state;
            }
            toast.success('Cart updated');
            return {
              items: state.items.map(item => 
                item.product.id === product.id 
                  ? { ...item, quantity: newQuantity } 
                  : item
              )
            };
          }
          
          if (quantity > product.stockQuantity) {
            toast.error(`Only ${product.stockQuantity} items in stock`);
            return state;
          }
          
          toast.success('Added to cart');
          return { items: [...state.items, { product, quantity }] };
        });
      },
      
      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter(item => item.product.id !== productId)
        }));
        toast.success('Item removed');
      },
      
      updateQuantity: (productId: string, quantity: number) => {
        set((state) => {
          const item = state.items.find(i => i.product.id === productId);
          if (item && quantity > item.product.stockQuantity) {
            toast.error(`Only ${item.product.stockQuantity} items in stock`);
            return state;
          }
          if (quantity < 1) return state;
          
          return {
            items: state.items.map(item => 
              item.product.id === productId 
                ? { ...item, quantity } 
                : item
            )
          };
        });
      },
      
      clearCart: () => set({ items: [] }),
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
      }
    }),
    {
      name: 'gbotemi-cart-storage',
    }
  )
);
