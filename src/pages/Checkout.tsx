import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCart } from '../hooks/useCart';
import { formatCurrency } from '../utils/format';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { BankTransferPaymentCard, BANK_DETAILS } from '../components/checkout/BankTransferPaymentCard';
import { DELIVERY_OPTIONS, DeliveryOption } from '../data/deliveryOptions';
import { ExternalLink } from 'lucide-react';
import { uploadProductImage } from '../utils/imageUpload';
import { 
  openWhatsAppDirect,
  getWhatsAppUrl
} from '../utils/receiptUpload';

export interface CompletedOrderInfo {
  orderId: string;
  amount: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryMethodName: string;
  orderedProducts: { name: string; quantity: number; price?: number }[];
  whatsappUrl: string;
  receiptUrl?: string;
}

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
  const [selectedDeliveryId, setSelectedDeliveryId] = useState<string>('osun_intracity');
  const [deliveryTab, setDeliveryTab] = useState<'osun' | 'interstate'>('osun');
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [isUploadingReceipt, setIsUploadingReceipt] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<CompletedOrderInfo | null>(null);

  const selectedDelivery = DELIVERY_OPTIONS.find((o) => o.id === selectedDeliveryId) || DELIVERY_OPTIONS[0];

  // Delivery fee is NOT paid online. Medication payment is strictly the drug subtotal.
  const subtotal = getTotalPrice();
  const total = subtotal;

  const hasPrescriptionItems = items.some(item => item.product.prescriptionRequired);

  const { register, handleSubmit, trigger, watch, formState: { errors } } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    mode: 'onTouched',
  });

  // Protect route
  useEffect(() => {
    // Only redirect if cart is empty and we haven't successfully processed an order
    if (items.length === 0 && !isProcessing && !sessionStorage.getItem('orderSuccess') && !completedOrder) {
      navigate('/cart');
    }
  }, [items.length, isProcessing, navigate, completedOrder]);

  if (items.length === 0 && !isProcessing && !sessionStorage.getItem('orderSuccess') && !completedOrder) {
    return null;
  }

  const nextStep = async (currentStep: number) => {
    let isValid = false;
    if (currentStep === 1) {
      isValid = await trigger(['firstName', 'lastName', 'email', 'phone']);
    } else if (currentStep === 2) {
      isValid = await trigger(['state', 'city', 'address']);
    } else if (currentStep === 3) {
      isValid = !!selectedDeliveryId;
      if (!isValid) toast.error('Please select a delivery method');
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

    if (!receiptFile) {
      toast.error('Please upload your bank transfer receipt (image or PDF) before proceeding.');
      return;
    }

    // 1. Immediately open window reference synchronously during user click on desktop to guarantee zero popup blocking
    const isMobile = typeof navigator !== 'undefined' && /android|iphone|ipad|ipod/i.test(navigator.userAgent);
    let preOpenedWin: Window | null = null;
    if (!isMobile) {
      try {
        preOpenedWin = window.open('about:blank', '_blank');
      } catch (e) {
        console.warn('Could not pre-open blank window:', e);
      }
    }

    setIsProcessing(true);
    setIsUploadingReceipt(true);

    let supabaseReceiptUrl = '';
    const uploadToastId = toast.loading('Uploading receipt to Supabase...');

    try {
      const uploadResult = await uploadProductImage(receiptFile);
      supabaseReceiptUrl = uploadResult.url;
      toast.success('Receipt uploaded to Supabase!', { id: uploadToastId });
    } catch (uploadErr: any) {
      console.warn('Receipt upload error:', uploadErr);
      toast.error('Failed to upload receipt to Supabase: ' + (uploadErr.message || 'Error'), { id: uploadToastId });
      if (preOpenedWin && !preOpenedWin.closed) preOpenedWin.close();
      setIsProcessing(false);
      setIsUploadingReceipt(false);
      return;
    }

    try {
      const paymentRef = `TRF-MONIEPOINT-${Math.random().toString(36).substring(2, 9).toUpperCase()}${supabaseReceiptUrl ? ` | ${supabaseReceiptUrl}` : ''}`;
      let createdOrderId = 'GBO-' + Math.floor(100000 + Math.random() * 900000);

      // Save order to Supabase
      try {
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .insert({
            user_id: user?.id || null, 
            customer_name: `${data.firstName} ${data.lastName}`.trim(),
            customer_email: data.email,
            customer_phone: data.phone,
            delivery_method: selectedDelivery.name,
            shipping_address: `${data.address}, ${data.city}, ${data.state} [Delivery: ${selectedDelivery.name}]`,
            total_amount: subtotal,
            status: 'pending',
            payment_status: 'pending',
            payment_reference: paymentRef,
          })
          .select()
          .single();

        if (!orderError && orderData?.id) {
          createdOrderId = orderData.id;
          const orderItems = items.map(item => ({
            order_id: orderData.id,
            product_id: item.product.id,
            product_name: item.product.name,
            quantity: item.quantity,
            price_at_time: item.product.price
          }));
          await supabase.from('order_items').insert(orderItems);
        }
      } catch (dbErr) {
        console.warn('Database order insert fallback:', dbErr);
      }

      // Record receipt in payment_receipts table
      try {
        await supabase
          .from('payment_receipts')
          .insert({
            order_id: createdOrderId,
            user_id: user?.id || null,
            file_url: supabaseReceiptUrl,
            file_name: receiptFile.name,
            file_type: receiptFile.type,
            customer_name: `${data.firstName} ${data.lastName}`.trim(),
            customer_phone: data.phone,
            amount: subtotal,
            status: 'pending',
          });
      } catch (recErr) {
        console.warn('Could not insert to payment_receipts table:', recErr);
      }

      // Save in localStorage receipts cache for immediate admin and order access
      try {
        const receiptsCache = JSON.parse(localStorage.getItem('gbotemi_order_receipts') || '{}');
        receiptsCache[createdOrderId] = supabaseReceiptUrl;
        localStorage.setItem('gbotemi_order_receipts', JSON.stringify(receiptsCache));
      } catch {}

      // 2. Build WhatsApp message (matching format with Supabase link as requested)
      const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || BANK_DETAILS.whatsappNumber;
      const formattedAmount = formatCurrency(subtotal);
      const orderText = `for Order #${createdOrderId}`;

      let productsText = '';
      if (items && items.length > 0) {
        productsText = '\n\n*Products Ordered:*\n' + items.map((item, idx) => `  ${idx + 1}. ${item.product.name} (Qty: ${item.quantity}) - ${formatCurrency(item.product.price * item.quantity)}`).join('\n');
      }

      const receiptSection = supabaseReceiptUrl ? `\n\n*Payment Receipt Document:*\n${supabaseReceiptUrl}` : '';

      const messageText = `Hello Gbotemi Holistic Pharmacy, I have made a bank transfer payment of ${formattedAmount} to your Moniepoint MFB account (${BANK_DETAILS.accountNumber}) ${orderText}.

*Customer Details:*
Name: ${data.firstName} ${data.lastName}
Phone: ${data.phone}
Email: ${data.email}
Delivery Address: ${data.address}, ${data.city}, ${data.state}
Delivery Preference: ${selectedDelivery.name} (Pay driver or rider directly upon delivery)${productsText}${receiptSection}

Kindly confirm my payment and dispatch my order.

Thank you!`;

      // 3. Save completed order state and clear cart
      const currentItems = items.map(i => ({ name: i.product.name, quantity: i.quantity, price: i.product.price }));
      clearCart();
      sessionStorage.setItem('orderSuccess', 'true');

      const waUrl = getWhatsAppUrl(whatsappNumber, messageText);
      setCompletedOrder({
        orderId: createdOrderId,
        amount: subtotal,
        customerName: `${data.firstName} ${data.lastName}`.trim(),
        customerPhone: data.phone,
        customerEmail: data.email,
        deliveryMethodName: selectedDelivery.name,
        orderedProducts: currentItems,
        whatsappUrl: waUrl,
        receiptUrl: supabaseReceiptUrl,
      });

      // 4. Direct user automatically to Gbotemi Holistic Pharmacy WhatsApp
      openWhatsAppDirect(whatsappNumber, messageText, preOpenedWin);
      toast.success('Directing to Gbotemi Holistic Pharmacy WhatsApp with receipt link...');

    } catch (error: any) {
      console.error('Checkout error:', error);
      if (preOpenedWin && !preOpenedWin.closed) {
        preOpenedWin.close();
      }
      toast.error('Failed to process order. Please try again.');
    } finally {
      setIsProcessing(false);
      setIsUploadingReceipt(false);
    }
  };

  if (completedOrder) {
    return (
      <div className="bg-slate-50 min-h-screen py-10 md:py-16 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 sm:p-10 max-w-2xl w-full text-center">
          <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 border border-emerald-300">
            Order Placed Successfully
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
            Directed to Gbotemi Pharmacy WhatsApp!
          </h1>
          <p className="text-gray-600 mb-6 text-sm sm:text-base max-w-lg mx-auto">
            Your transfer payment order has been recorded. We've opened WhatsApp so our on-duty pharmacist can verify your payment and dispatch your medications.
          </p>

          <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 sm:p-5 mb-6 text-left space-y-2">
            <div className="flex justify-between items-center text-sm font-bold text-emerald-950">
              <span>Order Number:</span>
              <span className="font-mono">{completedOrder.orderId}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-slate-800">
              <span>Total Paid:</span>
              <span className="font-extrabold text-emerald-900">{formatCurrency(completedOrder.amount)}</span>
            </div>
            <div className="flex justify-between items-center text-xs text-slate-700">
              <span>Customer:</span>
              <span className="font-medium">{completedOrder.customerName} ({completedOrder.customerPhone})</span>
            </div>
            <div className="flex justify-between items-center text-xs text-slate-700">
              <span>Delivery Method:</span>
              <span className="font-medium">{completedOrder.deliveryMethodName}</span>
            </div>
            {completedOrder.receiptUrl && (
              <div className="flex justify-between items-center text-xs text-slate-700 pt-1.5 border-t border-emerald-200/60">
                <span className="font-semibold text-emerald-900">Uploaded Receipt (Supabase):</span>
                <a
                  href={completedOrder.receiptUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-primary-700 hover:text-primary-800 hover:underline inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-primary-200"
                >
                  <span>View Document</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            )}
            <div className="text-[11px] text-amber-800 font-semibold pt-1 border-t border-emerald-200/60">
              Delivery Notice: Pay driver or rider directly upon delivery.
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <a
              href={completedOrder.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] hover:bg-[#20bd5a] active:bg-[#1caa51] text-white font-extrabold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center cursor-pointer text-base uppercase tracking-wider text-center"
            >
              Open WhatsApp Confirmation
            </a>
            <p className="text-xs text-slate-500">
              If WhatsApp didn't open automatically on your device, click the green button above to send your order details directly.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link to="/account/orders" className="flex-1">
              <Button variant="outline" size="lg" className="w-full py-3 rounded-xl">
                Track Order Status
              </Button>
            </Link>
            <Link to="/" className="flex-1">
              <Button size="lg" className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const steps = [
    { id: 1, title: 'Information' },
    { id: 2, title: 'Delivery' },
    { id: 3, title: 'Shipping' },
    { id: 4, title: 'Payment' },
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
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-colors ${
                  step > s.id 
                    ? 'bg-primary-600 border-primary-600 text-white' 
                    : step === s.id 
                      ? 'bg-white border-primary-600 text-primary-600'
                      : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  {s.id}
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

                {/* STEP 3: DELIVERY & SHIPPING METHOD */}
                {step === 3 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-1 border-b border-gray-100 pb-3">
                        Select Delivery Method for your drug
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1">
                        Choose how you want your drug delivered. <strong className="text-emerald-800">Pay driver or rider directly upon delivery.</strong>
                      </p>
                    </div>

                    {/* Delivery Notice Callout */}
                    <div className="bg-amber-50/90 border border-amber-300 rounded-xl p-3 sm:p-3.5 text-xs sm:text-sm text-amber-950 font-medium">
                      <span>
                        <strong className="font-bold">Delivery Notice: </strong>
                        Pay driver or rider directly upon delivery.
                      </span>
                    </div>

                    {/* Delivery Scope Tabs */}
                    <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                      <button
                        type="button"
                        onClick={() => {
                          setDeliveryTab('osun');
                          if (selectedDelivery.category !== 'osun') {
                            setSelectedDeliveryId('osun_intracity');
                          }
                        }}
                        className={`flex-1 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          deliveryTab === 'osun'
                            ? 'bg-white text-primary-800 shadow-sm border border-slate-200/80'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <span>Deliveries in Osun State</span>
                        <span className="hidden sm:inline text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full font-medium">
                          Intra-State
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setDeliveryTab('interstate');
                          if (selectedDelivery.category !== 'interstate') {
                            setSelectedDeliveryId('interstate_park');
                          }
                        }}
                        className={`flex-1 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          deliveryTab === 'interstate'
                            ? 'bg-white text-primary-800 shadow-sm border border-slate-200/80'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <span>Interstate Delivery</span>
                        <span className="hidden sm:inline text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full font-medium">
                          Nationwide
                        </span>
                      </button>
                    </div>

                    {/* Delivery Options List */}
                    <div className="space-y-3.5">
                      {DELIVERY_OPTIONS.filter((opt) => opt.category === deliveryTab).map((option) => {
                        const isSelected = selectedDeliveryId === option.id;
                        return (
                          <label
                            key={option.id}
                            className={`flex items-start p-4 border rounded-2xl cursor-pointer transition-all ${
                              isSelected
                                ? 'border-primary-600 bg-emerald-50/40 ring-2 ring-primary-500/20 shadow-sm'
                                : 'border-gray-200 hover:border-primary-300 bg-white hover:bg-slate-50/50'
                            }`}
                          >
                            <div className="flex items-center h-5 mt-0.5">
                              <input
                                type="radio"
                                name="deliveryOption"
                                checked={isSelected}
                                onChange={() => setSelectedDeliveryId(option.id)}
                                className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500 cursor-pointer"
                              />
                            </div>
                            <div className="ml-3.5 flex-grow">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-slate-900 text-sm sm:text-base">
                                    {option.name}
                                  </span>
                                  <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-primary-100 text-primary-800 border border-primary-200">
                                    {option.badge}
                                  </span>
                                </div>
                                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-amber-100/90 text-amber-900 border border-amber-300 w-fit">
                                  {option.paymentTerms}
                                </span>
                              </div>

                              <p className="text-xs text-slate-600 leading-relaxed mb-1.5">
                                {option.description}
                              </p>

                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                                <span className="font-medium text-slate-700">
                                  Coverage: {option.area}
                                </span>
                                <span className="text-emerald-700 font-semibold">
                                  Timeframe: {option.timeframe}
                                </span>
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </div>

                    <div className="pt-4 flex flex-col sm:flex-row gap-4">
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
                    <h2 className="text-xl font-bold text-gray-900 mb-1 border-b border-gray-100 pb-3">
                      Secure Bank Transfer Payment
                    </h2>

                    {/* Delivery Method Selected Summary Banner */}
                    <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-2xl p-4">
                      <div className="text-xs sm:text-sm text-emerald-950">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                          <span className="font-bold text-slate-900">
                            Delivery Method: {selectedDelivery.name}
                          </span>
                          <span className="text-[11px] font-semibold bg-primary-100 text-primary-800 px-2.5 py-0.5 rounded-full border border-primary-200 w-fit">
                            {selectedDelivery.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed mb-2">
                          {selectedDelivery.description} (Coverage: {selectedDelivery.area} • Timeframe: {selectedDelivery.timeframe})
                        </p>
                        <div className="text-xs font-bold text-amber-900 bg-amber-100/90 px-2.5 py-1 rounded-lg border border-amber-300 w-fit">
                          <span>{selectedDelivery.paymentTerms}</span>
                        </div>
                      </div>
                    </div>
                    
                    {hasPrescriptionItems && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
                        <h3 className="font-bold text-yellow-800 mb-2">
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
                          <span className="text-sm font-medium text-yellow-800 block">
                            {prescriptionFile ? prescriptionFile.name : 'Click to upload prescription or drag and drop'}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Direct Bank Transfer Payment Method (Moniepoint MFB) */}
                    <div className="mb-6">
                      <BankTransferPaymentCard
                        amount={total}
                        customerName={`${watch('firstName') || ''} ${watch('lastName') || ''}`.trim()}
                        orderReference="New Order"
                        customerPhone={watch('phone') || ''}
                        deliveryMethodName={selectedDelivery.name}
                        orderedItems={items.map(item => ({
                          name: item.product.name,
                          quantity: item.quantity,
                          price: item.product.price
                        }))}
                        showWhatsAppButton={false}
                        receiptFile={receiptFile}
                        onReceiptFileChange={setReceiptFile}
                        isUploadingReceipt={isUploadingReceipt}
                      />
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

                    <div className="pt-4 flex flex-col sm:flex-row gap-4">
                      <Button type="button" variant="outline" size="lg" onClick={() => setStep(3)} disabled={isProcessing}>
                        Back
                      </Button>
                      <button
                        type="submit"
                        disabled={isProcessing}
                        className="flex-grow bg-[#25D366] hover:bg-[#20bd5a] active:bg-[#1caa51] text-white font-extrabold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-center cursor-pointer text-base uppercase tracking-wider disabled:opacity-75"
                      >
                        {isProcessing ? 'Processing Order & Opening WhatsApp...' : 'PAYMENT MADE (Open WhatsApp Confirmation)'}
                      </button>
                    </div>
                    <p className="text-center text-xs text-slate-500 mt-2">
                      Uploads your payment receipt to Supabase and opens WhatsApp with your order details & receipt link (+234 802 966 0153)
                    </p>
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
              
              <div className="space-y-3.5 mb-6 border-t border-gray-100 pt-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Medications Subtotal ({getTotalItems()} items)</span>
                  <span className="font-medium text-gray-900">{formatCurrency(subtotal)}</span>
                </div>
                
                <div className="flex justify-between items-start text-sm text-gray-600">
                  <div className="pr-2">
                    <span className="block font-medium text-gray-900">Delivery Method</span>
                    <span className="block text-xs text-slate-500 line-clamp-1">{selectedDelivery.name}</span>
                    <span className="block text-[11px] font-bold text-amber-800 mt-0.5">{selectedDelivery.paymentTerms}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="inline-block text-xs font-semibold text-primary-800 bg-primary-50 px-2 py-0.5 rounded border border-primary-200">
                      {selectedDelivery.badge}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-100 pt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-lg font-bold text-gray-900 block leading-tight">Total to Transfer</span>
                    <span className="text-xs text-slate-500 font-medium">Drug Order Total</span>
                  </div>
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
