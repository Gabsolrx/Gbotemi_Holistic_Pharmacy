import { useState } from 'react';
import { useNavigate, useLocation, Navigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const adminLoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;

export default function AdminLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const isUnauthorizedRedirect = location.state?.unauthorized;
  const from = location.state?.from?.pathname || '/admin';

  const { register, handleSubmit, formState: { errors } } = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
  });

  if (user && (user.role === 'admin' || user.role === 'super_admin')) {
    return <Navigate to="/admin" replace />;
  }

  const onSubmit = async (data: AdminLoginFormValues) => {
    setIsLoading(true);
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        toast.error('Invalid admin credentials.');
      } else {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', authData.user.id)
          .single();
          
        if (profile && (profile.role === 'admin' || profile.role === 'super_admin')) {
          toast.success('Admin authentication successful');
          navigate(from, { replace: true });
        } else {
          await supabase.auth.signOut();
          toast.error('Unauthorized access. This portal is for administrators only.');
        }
      }
    } catch (error: any) {
      toast.error('Authentication service unavailable.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
        
        <div className="absolute top-0 left-0 w-full h-2 bg-[#047857]"></div>
        
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-[#047857] bg-[#ECFDF5] px-3 py-1 rounded-full inline-block mb-3">
            Admin Access Portal
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Admin Sign In</h2>
          <p className="mt-1 text-sm text-slate-500 font-medium">
            Restricted Access. Authorized personnel only.
          </p>
        </div>

        {isUnauthorizedRedirect && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs">
            <span>You need administrator credentials to access the Admin Dashboard. Please sign in below.</span>
          </div>
        )}
        
        <form className="mt-6 space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <Input 
              label="Administrator Email"
              type="email"
              autoComplete="email"
              placeholder="admin@gbotemi.com"
              {...register('email')}
              error={errors.email?.message}
            />
            
            <Input 
              label="Security Passkey"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              {...register('password')}
              error={errors.password?.message}
            />
          </div>
          
          <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold" size="lg" isLoading={isLoading}>
            Authenticate
          </Button>

          <div className="pt-3 text-center">
            <Link 
              to="/" 
              className="text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
            >
              Back to Storefront
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
