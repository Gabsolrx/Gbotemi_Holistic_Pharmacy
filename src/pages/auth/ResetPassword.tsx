import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Lock, ArrowRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

const resetSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ResetFormValues = z.infer<typeof resetSchema>;

export default function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [hasValidSession, setHasValidSession] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    // Check if recovery tokens are present in URL hash or search params
    const hash = window.location.hash || '';
    const search = window.location.search || '';
    const hasRecoveryParams = 
      hash.includes('access_token') || 
      hash.includes('type=recovery') || 
      search.includes('code=') ||
      search.includes('type=recovery');

    // Subscribe to auth state changes to detect PASSWORD_RECOVERY
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;
      if (event === 'PASSWORD_RECOVERY' || (session && hasRecoveryParams)) {
        setHasValidSession(true);
        setIsChecking(false);
      }
    });

    // Initial check for session or token exchange
    const verifySession = async () => {
      try {
        // 1. If PKCE code is present in query parameters, explicitly exchange it
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        if (code) {
          try {
            const { data: exchangeData, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
            if (!exchangeError && exchangeData?.session) {
              if (isMounted) {
                setHasValidSession(true);
                setIsChecking(false);
              }
              return;
            }
          } catch (codeErr) {
            console.warn('PKCE code exchange error, trying fallback:', codeErr);
          }
        }

        // 2. Check existing active session
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          if (isMounted) {
            setHasValidSession(true);
            setIsChecking(false);
          }
          return;
        }

        // 3. If recovery params (hash access_token or recovery type) are in URL, allow Supabase time to parse
        if (hasRecoveryParams) {
          setTimeout(async () => {
            if (!isMounted) return;
            const { data: { session: recheck } } = await supabase.auth.getSession();
            if (recheck) {
              setHasValidSession(true);
            } else {
              setHasValidSession(true);
            }
            setIsChecking(false);
          }, 1500);
        } else {
          // No recovery token and no session
          if (isMounted) {
            setHasValidSession(false);
            setIsChecking(false);
          }
        }
      } catch (err) {
        if (isMounted) {
          setIsChecking(false);
        }
      }
    };

    verifySession();

    return () => {
      isMounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const { register, handleSubmit, formState: { errors } } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data: ResetFormValues) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password.trim(),
      });

      if (error) {
        toast.error(error.message);
      } else {
        setIsSuccess(true);
        toast.success('Your password has been reset successfully!');
        setTimeout(() => {
          navigate('/customer-login');
        }, 3000);
      }
    } catch (error: any) {
      console.error('Password update error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-slate-50 p-4">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mb-3" />
        <p className="text-sm font-medium text-gray-600">Verifying your secure password reset link...</p>
      </div>
    );
  }

  if (!hasValidSession && !isSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-xl text-center">
          <div className="w-16 h-16 bg-amber-50 text-amber-700 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-200">
            <AlertCircle size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Reset Link Expired or Invalid</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            This password reset link is invalid, has already been used, or has expired. Please request a fresh password reset email.
          </p>
          <div className="pt-2">
            <Link
              to="/forgot-password"
              className="inline-flex items-center justify-center w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm transition-colors shadow-sm"
            >
              Request New Reset Link
            </Link>
          </div>
          <div>
            <Link to="/customer-login" className="text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors">
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-xl">
        <div className="text-center">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-100 shadow-2xs">
            {isSuccess ? <CheckCircle2 size={32} /> : <Lock size={32} />}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            {isSuccess ? 'Password Updated!' : 'Create New Password'}
          </h2>
          <p className="mt-2 text-sm text-gray-600 leading-relaxed">
            {isSuccess 
              ? 'Your password has been successfully reset. Redirecting you to sign in...'
              : 'Choose a strong new password with at least 6 characters.'
            }
          </p>
        </div>

        {isSuccess ? (
          <div className="pt-4 space-y-3">
            <Link
              to="/customer-login"
              className="inline-flex items-center justify-center w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm transition-colors shadow-sm"
            >
              Sign In Now <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        ) : (
          <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <Input 
                label="New Password *"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                {...register('password')}
                error={errors.password?.message}
                helperText="Must be at least 6 characters"
              />

              <Input 
                label="Confirm New Password *"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                {...register('confirmPassword')}
                error={errors.confirmPassword?.message}
              />
            </div>

            <Button type="submit" className="w-full gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold" size="lg" isLoading={isLoading}>
              Update Password <ArrowRight size={18} />
            </Button>
          </form>
        )}

        <div className="pt-4 border-t border-gray-100 text-center">
          <Link to="/customer-login" className="text-xs font-semibold text-gray-500 hover:text-emerald-700 transition-colors">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
