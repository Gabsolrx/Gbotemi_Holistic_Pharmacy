import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { UserPlus, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

const signupSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Valid phone number is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  acceptTerms: z.boolean().refine(v => v === true, { message: "You must accept the terms and conditions" }),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function Signup() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    try {
      let signupSuccess = false;
      try {
        // Create user via server API if backend server is available
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (res.ok) {
          const result = await res.json();
          if (!result.error) {
            signupSuccess = true;
          }
        }
      } catch {
        // Server API not reachable in static deployment (e.g. Vercel), fall back to client Supabase
      }

      if (!signupSuccess) {
        const { error: supaError } = await supabase.auth.signUp({
          email: data.email.trim(),
          password: data.password,
          options: {
            data: {
              first_name: data.firstName,
              last_name: data.lastName,
              phone: data.phone,
            }
          }
        });
        if (supaError) {
          throw supaError;
        }
      }

      // Automatically sign in the user now that the account is created
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: data.email.trim(),
        password: data.password
      });

      if (signInError) {
        toast.success('Account created! Please sign in with your credentials.');
        navigate('/customer-login');
      } else {
        toast.success('Account created successfully! Welcome to Gbotemi Holistic Pharmacy.');
        navigate('/account');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus size={32} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Create an account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Join Gbotemi Holistic Pharmacy to manage your health seamlessly.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input 
              label="First Name"
              placeholder="e.g. Ade"
              {...register('firstName')}
              error={errors.firstName?.message}
            />
            <Input 
              label="Last Name"
              placeholder="e.g. Ojo"
              {...register('lastName')}
              error={errors.lastName?.message}
            />
          </div>

          <Input 
            label="Phone Number"
            type="tel"
            placeholder="e.g. 08012345678"
            {...register('phone')}
            error={errors.phone?.message}
          />

          <Input 
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            {...register('email')}
            error={errors.email?.message}
          />
          
          <Input 
            label="Password"
            type="password"
            placeholder="••••••••"
            {...register('password')}
            error={errors.password?.message}
          />

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                type="checkbox"
                {...register('acceptTerms')}
                className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="text-gray-600 font-medium">
                I agree to the <Link to="/terms" target="_blank" className="text-primary-600 hover:underline">Terms and Conditions</Link> and <Link to="/privacy-policy" target="_blank" className="text-primary-600 hover:underline">Privacy Policy</Link>.
              </label>
              {errors.acceptTerms && (
                <p className="text-sm text-red-600 mt-1">{errors.acceptTerms.message}</p>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full gap-2" size="lg" isLoading={isLoading}>
            Create Account <ArrowRight size={18} />
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/user-login" className="font-medium text-primary-600 hover:text-primary-500 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
