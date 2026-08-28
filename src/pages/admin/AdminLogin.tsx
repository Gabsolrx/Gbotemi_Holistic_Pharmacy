import { useState } from 'react';
import { useNavigate, useLocation, Navigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ShieldAlert, ArrowRight, Lock, ArrowLeft, AlertCircle } from 'lucide-react';
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

  // If already logged in as admin, redirect to dashboard
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
        // Check if user is actually an admin (this is a client-side check, 
        // real security is enforced by RLS in Supabase)
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
    <div className="min-h-screen flex items-center justify-center bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
        
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-primary-500 to-blue-500"></div>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-slate-100 text-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
            <ShieldAlert size={36} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Admin Portal</h2>
          <p className="mt-1 text-sm text-slate-500 font-medium">
            Restricted Access. Authorized personnel only.
          </p>
        </div>

        {isUnauthorizedRedirect && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-amber-800 text-xs">
            <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
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
          
          <Button type="submit" className="w-full gap-2 bg-slate-900 hover:bg-slate-800 text-white" size="lg" isLoading={isLoading}>
            <Lock size={18} /> Authenticate <ArrowRight size={18} />
          </Button>

          <div className="pt-3 text-center">
            <Link 
              to="/" 
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft size={14} /> Back to Storefront
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
