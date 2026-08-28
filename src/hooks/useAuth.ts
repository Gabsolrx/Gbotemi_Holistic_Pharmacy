import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User, UserRole } from '../types';

interface AuthState {
  user: User | null;
  session: any | null;
  isLoading: boolean;
  initialized: boolean;
  setUser: (user: User | null) => void;
  setSession: (session: any | null) => void;
  setLoading: (loading: boolean) => void;
  initialize: () => Promise<void>;
  signOut: () => Promise<void>;
  setDemoAdmin: () => void;
}

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  isLoading: true,
  initialized: false,
  
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setLoading: (loading) => set({ isLoading: loading }),
  
  setDemoAdmin: () => {
    set({
      user: {
        id: 'demo-admin-123',
        email: 'admin@gbotemi.com',
        role: 'admin',
        firstName: 'Demo',
        lastName: 'Admin',
        phone: '08000000000',
        createdAt: new Date().toISOString(),
      },
      session: { access_token: 'demo-token' },
      isLoading: false,
      initialized: true
    });
  },

  initialize: async () => {
    if (get().initialized) return;
    
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      set({ session });
      
      if (session?.user) {
        // Fetch extended user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (profile) {
          set({
            user: {
              id: session.user.id,
              email: session.user.email!,
              role: profile.role as UserRole,
              firstName: profile.first_name,
              lastName: profile.last_name,
              phone: profile.phone,
              createdAt: profile.created_at,
            }
          });
        }
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
    } finally {
      set({ isLoading: false, initialized: true });
    }
    
    // Set up real-time listener for auth state changes
    supabase.auth.onAuthStateChange(async (event, session) => {
      set({ session });
      
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (profile) {
          set({
            user: {
              id: session.user.id,
              email: session.user.email!,
              role: profile.role as UserRole,
              firstName: profile.first_name,
              lastName: profile.last_name,
              phone: profile.phone,
              createdAt: profile.created_at,
            }
          });
        }
      } else {
        set({ user: null });
      }
    });
  },
  
  signOut: async () => {
    set({ isLoading: true });
    try {
      await supabase.auth.signOut();
      set({ user: null, session: null });
    } finally {
      set({ isLoading: false });
    }
  }
}));
