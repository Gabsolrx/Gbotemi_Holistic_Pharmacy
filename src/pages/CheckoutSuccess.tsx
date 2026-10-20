import { useState } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { formatCurrency } from '../utils/format';
import { BANK_DETAILS } from '../components/checkout/BankTransferPaymentCard';
import { openWhatsAppDirect } from '../utils/receiptUpload';
import toast from 'react-hot-toast';

export default function CheckoutSuccess() {
  const location = useLocation();
  const state = location.state || {};
  const orderId = state.orderId;
  const customerName = state.customerName || '';
  const customerPhone = state.customerPhone || '';
  const totalAmount = state.totalAmount || 0;
  const deliveryMethodName = state.deliveryMethodName || '';
  const orderedProducts: Array<{ name: string; quantity: number; price?: number }> = state.orderedProducts || [];
  
  const [copied, setCopied] = useState<boolean>(false);
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || BANK_DETAILS.whatsappNumber;

  // Redirect if no order ID is found (user navigated here directly)
  if (!orderId) {
    return <Navigate to="/" replace />;
  }

  const handleCopyAccount = async () => {
    try {
      await navigator.clipboard.writeText(BANK_DETAILS.accountNumber);
      setCopied(true);
      toast.success(`Account number ${BANK_DETAILS.accountNumber} copied!`);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = BANK_DETAILS.accountNumber;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      toast.success(`Account number ${BANK_DETAILS.accountNumber} copied!`);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const buildSuccessMessage = () => {
    const formattedAmount = totalAmount ? formatCurrency(totalAmount) : '';
    const deliveryText = deliveryMethodName ? `\n• Delivery Preference: ${deliveryMethodName} (Pay driver or rider directly upon delivery)` : '';
    
    let productsText = '';
    if (orderedProducts && orderedProducts.length > 0) {
      productsText = '\n• Products Ordered:\n' + orderedProducts.map((p, idx) => `  ${idx + 1}. ${p.name} (Qty: ${p.quantity}) - ${formatCurrency((p.price || 0) * p.quantity)}`).join('\n');
    }

    return `Hello Gbotemi Holistic Pharmacy,\n\nI have made a bank transfer payment${formattedAmount ? ` of ${formattedAmount}` : ''} to your Moniepoint MFB account (${BANK_DETAILS.accountNumber}) for Order #${orderId}${customerName ? ` (${customerName})` : ''}${customerPhone ? ` (Phone: ${customerPhone})` : ''}.${deliveryText}${productsText}\n\nKindly confirm my payment and dispatch my order.\n\nThank you!`;
  };

  const handleWhatsAppAction = () => {
    const isMobile = typeof navigator !== 'undefined' && /android|iphone|ipad|ipod/i.test(navigator.userAgent);
    let preWin: Window | null = null;
    if (!isMobile) {
      try {
        preWin = window.open('about:blank', '_blank');
      } catch {}
    }

    const messageText = buildSuccessMessage();

    // Direct user automatically to Gbotemi Holistic Pharmacy WhatsApp directly
    openWhatsAppDirect(whatsappNumber, messageText, preWin);
    toast.success('Directing to Gbotemi Holistic Pharmacy WhatsApp...');
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 md:py-16 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 sm:p-10 max-w-2xl w-full text-center">
        
        {/* Order Success Badge */}
        <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 border border-emerald-300">
          Order Placed Successfully
        </div>
        
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
          Thank You For Your Order!
        </h1>
        <p className="text-gray-600 mb-8 text-sm sm:text-base max-w-lg mx-auto">
          Please complete your transfer to Moniepoint MFB and confirm via WhatsApp for rapid order processing and delivery dispatch.
        </p>

        {/* Order Details Summary */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 mb-6 text-left space-y-3">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="font-bold text-gray-900 text-base sm:text-lg">Order Summary</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-y-3 text-xs sm:text-sm pt-1">
            <div className="text-slate-500 font-medium">Order Number:</div>
            <div className="font-bold text-slate-900 text-right font-mono truncate">{orderId}</div>
            
            {totalAmount > 0 && (
              <>
                <div className="text-slate-500 font-medium">Medication Total:</div>
                <div className="font-extrabold text-emerald-800 text-right">{formatCurrency(totalAmount)}</div>
              </>
            )}

            <div className="text-slate-500 font-medium">Payment Method:</div>
            <div className="font-bold text-slate-900 text-right">Bank Transfer (Moniepoint MFB)</div>

            <div className="text-slate-500 font-medium">Payment Status:</div>
            <div className="font-bold text-amber-700 text-right">Pending WhatsApp Confirmation</div>

            {deliveryMethodName && (
              <>
                <div className="text-slate-500 font-medium">Delivery Method:</div>
                <div className="font-bold text-slate-900 text-right">
                  <span>{deliveryMethodName}</span>
                  <span className="block text-[11px] font-bold text-amber-800">
                    Pay driver or rider directly upon delivery
                  </span>
                </div>
              </>
            )}

            <div className="text-slate-500 font-medium">Fulfillment Status:</div>
            <div className="font-bold text-primary-700 text-right">Preparing for Dispatch</div>

            {orderedProducts && orderedProducts.length > 0 && (
              <div className="col-span-2 border-t border-slate-200/80 pt-3 mt-1">
                <div className="text-slate-500 font-medium mb-1.5">Products Ordered:</div>
                <div className="space-y-1 bg-white p-2.5 rounded-lg border border-slate-200">
                  {orderedProducts.map((p, i) => (
                    <div key={i} className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-900">{p.name} × {p.quantity}</span>
                      {p.price && <span className="text-slate-600 font-semibold">{formatCurrency(p.price * p.quantity)}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Delivery Payment Notice Banner */}
        <div className="bg-amber-50/90 border border-amber-300 rounded-2xl p-4 sm:p-5 mb-6 text-left">
          <div className="text-xs sm:text-sm text-amber-950 leading-relaxed">
            <strong className="font-bold text-amber-900 block mb-0.5">
              Delivery Notice:
            </strong>
            Always pay driver or rider directly upon delivery.
          </div>
        </div>

        {/* Moniepoint MFB Account Details Card */}
        <div className="bg-white rounded-2xl border-2 border-emerald-600/30 shadow-md p-5 sm:p-6 mb-6 text-left space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <span className="font-bold text-slate-900 text-sm sm:text-base">
              Moniepoint MFB Account Details
            </span>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
              Verified Business
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold block mb-0.5">
                Bank Name
              </span>
              <span className="font-bold text-slate-900 text-base">
                {BANK_DETAILS.bankName}
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold block mb-0.5">
                Account Name
              </span>
              <span className="font-bold text-slate-900 text-base">
                {BANK_DETAILS.accountName}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold block mb-1">
                Account Number
              </span>
              <div className="font-mono text-2xl sm:text-3xl font-black text-slate-900 tracking-wider">
                {BANK_DETAILS.accountNumber}
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopyAccount}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 shadow-sm cursor-pointer ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-primary-700 hover:bg-primary-800 text-white'
              }`}
            >
              {copied ? 'COPIED!' : 'COPY ACCOUNT NUMBER'}
            </button>
          </div>

          {/* Transfer Instructions */}
          <div className="text-xs text-slate-600 bg-amber-50/80 p-3.5 rounded-xl border border-amber-200">
            <span>
              <strong>Transfer Narration:</strong> Please use your Order Number <strong className="text-slate-900">#{orderId}</strong> or your name as the transfer remark, then click below to confirm payment on WhatsApp.
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3.5">
          {/* PAYMENT MADE (Open WhatsApp Confirmation) */}
          <button
            type="button"
            onClick={handleWhatsAppAction}
            className="w-full bg-[#25D366] hover:bg-[#20bd5a] active:bg-[#1caa51] text-white font-extrabold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center cursor-pointer text-sm sm:text-base tracking-wide uppercase"
          >
            <span>PAYMENT MADE (Open WhatsApp Confirmation)</span>
          </button>

          <Link to="/account/orders" className="block w-full">
            <Button variant="outline" size="lg" className="w-full py-3.5 rounded-2xl">
              Track Order Status
            </Button>
          </Link>
          
          <div className="pt-2">
            <Link to="/" className="text-sm font-semibold text-primary-700 hover:text-primary-800 transition-colors">
              Return to Homepage
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
