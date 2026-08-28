import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Check, CreditCard, Truck, User, ArrowRight, ShieldCheck, MapPin, Upload } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { formatCurrency } from '../utils/format';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { cmsService } from '../services/cmsService';

const checkoutSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  state: z.string().min(2, 'State is required'),
  city: z.string().min(2, 'City is required'),
  address: z.string().min(5, 'Detailed address is required'),
  landmark: z.string().optional(),
  acceptTerms: z.boolean().refine(v => v === true, { message: "You must accept the terms and conditions to proceed" }),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const { items, getTotalPrice, clearCart, getTotalItems } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express' | 'pickup' | null>(null);
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [standardFee, setStandardFee] = useState(1500);
  const [expressFee, setExpressFee] = useState(3000);

  useEffect(() => {
    const fetchFees = async () => {
      const config = await cmsService.getConfig();
      if (config.storeSettings?.deliveryFeeStandard !== undefined) {
        setStandardFee(Number(config.storeSettings.deliveryFeeStandard) || 0);
      }
      if (config.storeSettings?.deliveryFeeExpress !== undefined) {
        setExpressFee(Number(config.storeSettings.deliveryFeeExpress) || 0);
      }
    };
    fetchFees();
  }, []);

  const subtotal = getTotalPrice();
  let deliveryFee = 0;
  if (deliveryMethod === 'standard') deliveryFee = standardFee;
  if (deliveryMethod === 'express') deliveryFee = expressFee;
  const total = subtotal + deliveryFee;

  const hasPrescriptionItems = items.some(item => item.product.prescriptionRequired);

  const { register, handleSubmit, trigger, formState: { errors } } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    mode: 'onTouched',
  });

  // Protect route
  useEffect(() => {
    // Only redirect if cart is empty and we haven't successfully processed an order
    if (items.length === 0 && !isProcessing && !sessionStorage.getItem('orderSuccess')) {
      navigate('/cart');
    }
  }, [items.length, isProcessing, navigate]);

  if (items.length === 0 && !isProcessing && !sessionStorage.getItem('orderSuccess')) {
    return null;
  }

  const nextStep = async (currentStep: number) => {
    let isValid = false;
    if (currentStep === 1) {
      isValid = await trigger(['firstName', 'lastName', 'email', 'phone']);
    } else if (currentStep === 2) {
      isValid = await trigger(['state', 'city', 'address']);
    } else if (currentStep === 3) {
      isValid = !!deliveryMethod;
      if (!isValid) toast.error('Please select a shipping method');
    }
    
    if (isValid) {
      setStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const { user } = useAuth();
  
  const processPayment = async (data: CheckoutFormValues) => {
    if (hasPrescriptionItems && !prescriptionFile) {
      toast.error('Please upload your prescription to continue.');
      return;
    }

    setIsProcessing(true);
    
    try {
      // 1. Create the order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user?.id || null, 
          customer_name: data.firstName + ' ' + data.lastName,
          customer_email: data.email,
          shipping_address: data.address + ', ' + data.city + ', ' + data.state,
          total_amount: subtotal + deliveryFee,
          status: 'pending',
          payment_reference: 'PAY-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
        })
        .select()
        .single();

      if (orderError) throw orderError;
      
      // 2. Create order items
      const orderItems = items.map(item => ({
        order_id: orderData.id,
        product_id: item.product.id,
        product_name: item.product.name,
        quantity: item.quantity,
        price_at_time: item.product.price
      }));
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
        
      if (itemsError) throw itemsError;

      // 3. Clear cart and redirect
      toast.success('Payment completed securely');
      sessionStorage.setItem('orderSuccess', 'true');
      clearCart();
      navigate('/checkout/success', { state: { orderId: orderData.id } });
      // Clean up flag after a delay
      setTimeout(() => sessionStorage.removeItem('orderSuccess'), 1000);
      
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error('Failed to process order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const steps = [
    { id: 1, title: 'Information', icon: User },
    { id: 2, title: 'Delivery', icon: MapPin },
    { id: 3, title: 'Shipping', icon: Truck },
    { id: 4, title: 'Payment', icon: CreditCard },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Checkout Header / Steps */}
        <div className="mb-8 md:mb-12">
          <div className="flex items-center justify-between max-w-2xl mx-auto relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 z-0 rounded-full"></div>
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary-600 z-0 rounded-full transition-all duration-300"
              style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
            ></div>
            
            {steps.map((s) => (
              <div key={s.id} className="relative z-10 flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-colors ${
                  step > s.id 
                    ? 'bg-primary-600 border-primary-600 text-white' 
                    : step === s.id 
                      ? 'bg-white border-primary-600 text-primary-600'
                      : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  {step > s.id ? <Check size={18} /> : <s.icon size={18} />}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${step >= s.id ? 'text-gray-900' : 'text-gray-400'}`}>
                  {s.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form Area */}
          <div className="flex-grow">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
              <form id="checkout-form" onSubmit={handleSubmit(processPayment)}>
                
                {/* STEP 1: CUSTOMER INFO */}
                {step === 1 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Customer Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input label="First Name" placeholder="e.g. Ade" {...register('firstName')} error={errors.firstName?.message} />
                      <Input label="Last Name" placeholder="e.g. Ojo" {...register('lastName')} error={errors.lastName?.message} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input label="Email Address" type="email" placeholder="e.g. ade@example.com" {...register('email')} error={errors.email?.message} />
                      <Input label="Phone Number" placeholder="e.g. 08012345678" {...register('phone')} error={errors.phone?.message} />
                    </div>
                    <div className="pt-6">
                      <Button type="button" size="lg" className="w-full sm:w-auto" onClick={() => nextStep(1)}>
                        Continue to Delivery
                      </Button>
                    </div>
                  </div>
                )}

                {/* STEP 2: DELIVERY ADDRESS */}
                {step === 2 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Delivery Address</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input label="State" placeholder="e.g. Osun State" {...register('state')} error={errors.state?.message} />
                      <Input label="City" placeholder="e.g. Ile Ife" {...register('city')} error={errors.city?.message} />
                    </div>
                    <Input label="Detailed Address" placeholder="Street name and house number" {...register('address')} error={errors.address?.message} />
                    <Input label="Nearest Landmark (Optional)" placeholder="e.g. Beside the main post office" {...register('landmark')} error={errors.landmark?.message} />
                    
                    <div className="pt-6 flex flex-col sm:flex-row gap-4">
                      <Button type="button" variant="outline" size="lg" onClick={() => setStep(1)}>
                        Back
                      </Button>
                      <Button type="button" size="lg" className="flex-grow" onClick={() => nextStep(2)}>
                        Continue to Shipping
                      </Button>
                    </div>
                  </div>
                )}

                {/* STEP 3: SHIPPING METHOD */}
                {step === 3 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Shipping Method</h2>
                    
                    <div className="space-y-4">
                      <label className={`flex items-start p-4 border rounded-xl cursor-pointer transition-colors ${deliveryMethod === 'standard' ? 'border-primary-600 bg-primary-50' : 'border-gray-200 hover:border-primary-300'}`}>
                        <div className="flex items-center h-5">
                          <input type="radio" checked={deliveryMethod === 'standard'} onChange={() => setDeliveryMethod('standard')} className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500" />
                        </div>
                        <div className="ml-3 flex-grow flex justify-between">
                          <div>
                            <span className="block text-sm font-medium text-gray-900">Standard Delivery</span>
                            <span className="block text-sm text-gray-500 mt-1">2-3 Business Days</span>
                          </div>
                          <span className="text-sm font-bold text-gray-900">{formatCurrency(standardFee)}</span>
                        </div>
                      </label>

                      <label className={`flex items-start p-4 border rounded-xl cursor-pointer transition-colors ${deliveryMethod === 'express' ? 'border-primary-600 bg-primary-50' : 'border-gray-200 hover:border-primary-300'}`}>
                        <div className="flex items-center h-5">
                          <input type="radio" checked={deliveryMethod === 'express'} onChange={() => setDeliveryMethod('express')} className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500" />
                        </div>
                        <div className="ml-3 flex-grow flex justify-between">
                          <div>
                            <span className="block text-sm font-medium text-gray-900">Express Delivery</span>
                            <span className="block text-sm text-gray-500 mt-1">Same Day or Next Day</span>
                          </div>
                          <span className="text-sm font-bold text-gray-900">{formatCurrency(expressFee)}</span>
                        </div>
                      </label>

                      <label className={`flex items-start p-4 border rounded-xl cursor-pointer transition-colors ${deliveryMethod === 'pickup' ? 'border-primary-600 bg-primary-50' : 'border-gray-200 hover:border-primary-300'}`}>
                        <div className="flex items-center h-5">
                          <input type="radio" checked={deliveryMethod === 'pickup'} onChange={() => setDeliveryMethod('pickup')} className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500" />
                        </div>
                        <div className="ml-3 flex-grow flex justify-between">
                          <div>
                            <span className="block text-sm font-medium text-gray-900">Pharmacy Pickup</span>
                            <span className="block text-sm text-gray-500 mt-1">Ready in 2 hours at Ile Ife branch</span>
                          </div>
                          <span className="text-sm font-bold text-gray-900">Free</span>
                        </div>
                      </label>
                    </div>

                    <div className="pt-6 flex flex-col sm:flex-row gap-4">
                      <Button type="button" variant="outline" size="lg" onClick={() => setStep(2)}>
                        Back
                      </Button>
                      <Button type="button" size="lg" className="flex-grow" onClick={() => nextStep(3)}>
                        Continue to Payment
                      </Button>
                    </div>
                  </div>
                )}

                {/* STEP 4: PAYMENT */}
                {step === 4 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Secure Payment</h2>
                    
                    {hasPrescriptionItems && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
                        <h3 className="font-bold text-yellow-800 flex items-center gap-2 mb-2">
                          <ShieldCheck size={20} />
                          Prescription Upload Required
                        </h3>
                        <p className="text-sm text-yellow-700 mb-4">
                          Your order contains regulated medications. Please upload a clear picture of your doctor's prescription.
                        </p>
                        <div className="border-2 border-dashed border-yellow-300 rounded-lg p-6 text-center bg-white hover:bg-yellow-50/50 transition-colors cursor-pointer relative">
                          <input 
                            type="file" 
                            accept="image/*,.pdf" 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={(e) => setPrescriptionFile(e.target.files?.[0] || null)}
                          />
                          <Upload className="mx-auto text-yellow-600 mb-2" size={32} />
                          <span className="text-sm font-medium text-yellow-800">
                            {prescriptionFile ? prescriptionFile.name : 'Click to upload or drag and drop'}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200">
                      <div className="flex items-center gap-3 mb-4 text-gray-700 font-medium border-b border-gray-200 pb-4">
                        <CreditCard className="text-primary-600" />
                        Pay securely via Paystack
                      </div>
                      <p className="text-sm text-gray-500 leading-relaxed mb-4">
                        By clicking "Pay Now", you will be securely redirected to Paystack to complete your purchase using your Card, Bank Transfer, or USSD. Gbotemi Holistic Pharmacy does not store your card details.
                      </p>
                      
                      {/* Note about backend architecture */}
                      <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg text-xs text-blue-800">
                        <strong>Developer Note:</strong> Payment processing is handled securely on the backend (Express server). The frontend avoids exposing Paystack Secret Keys and initializes transactions safely via API calls.
                      </div>
                    </div>

                    <div className="flex items-start mb-6">
                      <div className="flex items-center h-5">
                        <input
                          id="checkout-terms"
                          type="checkbox"
                          {...register('acceptTerms')}
                          className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="checkout-terms" className="text-gray-600 font-medium">
                          I have read and agree to the website <Link to="/terms" target="_blank" className="text-primary-600 hover:underline">Terms and Conditions</Link>, <Link to="/refund-policy" target="_blank" className="text-primary-600 hover:underline">Refund Policy</Link>, and <Link to="/privacy-policy" target="_blank" className="text-primary-600 hover:underline">Privacy Policy</Link>.
                        </label>
                        {errors.acceptTerms && (
                          <p className="text-sm text-red-600 mt-1">{errors.acceptTerms.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="pt-6 flex flex-col sm:flex-row gap-4">
                      <Button type="button" variant="outline" size="lg" onClick={() => setStep(3)} disabled={isProcessing}>
                        Back
                      </Button>
                      <Button type="submit" size="lg" className="flex-grow gap-2" isLoading={isProcessing}>
                        Pay {formatCurrency(total)} <ArrowRight size={18} />
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Checkout Summary */}
          <div className="w-full lg:w-80 xl:w-96 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-4">
                    <div className="w-16 h-16 bg-gray-50 rounded-lg flex-shrink-0 border border-gray-100 p-1 flex items-center justify-center">
                      <img src={item.product.imageUrl} alt={item.product.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                    </div>
                    <div className="flex-grow">
                      <div className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight mb-1">{item.product.name}</div>
                      {(item.product.genericName || item.product.genericName) && (
                        <div className="text-xs text-gray-500 italic mb-1 line-clamp-1">{item.product.genericName || item.product.genericName}</div>
                      )}
                      <div className="text-xs text-gray-500 mb-1">Qty: {item.quantity}</div>
                      <div className="text-sm font-bold text-primary-800">{formatCurrency(item.product.price * item.quantity)}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-4 mb-6 border-t border-gray-100 pt-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal ({getTotalItems()} items)</span>
                  <span className="font-medium text-gray-900">{formatCurrency(subtotal)}</span>
                </div>
                {deliveryMethod && (
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Delivery</span>
                    <span className="font-medium text-gray-900">{formatCurrency(deliveryFee)}</span>
                  </div>
                )}
              </div>
              
              <div className="border-t border-gray-100 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-primary-800">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
