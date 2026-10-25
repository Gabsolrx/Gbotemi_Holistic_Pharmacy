import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { KeyRound, ArrowRight, Mail, CheckCircle2, RotateCcw } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true);
    const cleanEmail = data.email.trim().toLowerCase();
    try {
      // Direct redirect URL to reset password page
      const siteOrigin = window.location.origin.replace(/\/+$/, '');
      const redirectUrl = `${siteOrigin}/reset-password`;

      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: redirectUrl,
      });

      if (error) {
        toast.error(error.message);
      } else {
        setSubmittedEmail(cleanEmail);
        setIsSent(true);
        toast.success('Password reset link sent! Check your inbox.');
      }
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!submittedEmail) return;
    setIsLoading(true);
    try {
      const siteOrigin = window.location.origin.replace(/\/+$/, '');
      const { error } = await supabase.auth.resetPasswordForEmail(submittedEmail, {
        redirectTo: `${siteOrigin}/reset-password`,
      });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Reset email resent! Please check your inbox.');
      }
    } catch (err: any) {
      toast.error('Failed to resend email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-xl">
        <div className="text-center">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-100 shadow-2xs">
            {isSent ? <Mail size={32} /> : <KeyRound size={32} />}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            {isSent ? 'Check Your Email' : 'Reset Password'}
          </h2>
          <p className="mt-2 text-sm text-gray-600 leading-relaxed">
            {isSent 
              ? `We have sent a secure password reset link to ${submittedEmail}. Click the link in that email to create your new password.`
              : 'Enter the email address associated with your account, and we will send you a secure link to reset your password.'
            }
          </p>
        </div>

        {!isSent ? (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <Input 
                label="Email Address"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                {...register('email')}
                error={errors.email?.message}
              />
            </div>

            <Button type="submit" className="w-full gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold" size="lg" isLoading={isLoading}>
              Send Reset Link <ArrowRight size={18} />
            </Button>
          </form>
        ) : (
          <div className="mt-6 space-y-4">
            <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 text-xs sm:text-sm text-emerald-950 flex items-start gap-3">
              <CheckCircle2 size={20} className="text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-emerald-900">Email Dispatched</span>
                <span className="text-emerald-800/90 leading-relaxed">
                  Be sure to check both your <strong>Inbox</strong> and <strong>Spam/Junk</strong> folder. The link will remain active for 24 hours.
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={handleResend}
                disabled={isLoading}
                className="flex-1 py-2.5 px-4 rounded-xl border border-emerald-600 text-emerald-700 hover:bg-emerald-50 text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RotateCcw size={15} />
                <span>Resend Email</span>
              </button>
              <button
                type="button"
                onClick={() => setIsSent(false)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
              >
                Try Another Email
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-600">
            Remember your password?{' '}
            <Link to="/customer-login" className="font-bold text-emerald-700 hover:text-emerald-800 transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
