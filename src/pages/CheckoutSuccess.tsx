import { Link, useLocation, Navigate } from 'react-router-dom';
import { CheckCircle2, MessageCircle, Package, ArrowRight, Phone } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function CheckoutSuccess() {
  const location = useLocation();
  const orderId = location.state?.orderId;
  let whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '08029660153';
  whatsappNumber = whatsappNumber.replace(/[\s+-]/g, '');
  if (whatsappNumber.startsWith('0')) {
    whatsappNumber = '234' + whatsappNumber.substring(1);
  }

  // Redirect if no order ID is found (user navigated here directly)
  if (!orderId) {
    return <Navigate to="/" replace />;
  }

  const whatsappMessage = encodeURIComponent(
    `Hello Gbotemi Holistic Pharmacy, I have made my payment for order #${orderId}. Kindly confirm and get back to me.`
  );

  return (
    <div className="bg-slate-50 min-h-[70vh] py-12 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 md:p-12 max-w-xl w-full text-center">
        
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={48} />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
        <p className="text-gray-600 mb-8 text-lg">
          Thank you for choosing Gbotemi Holistic Pharmacy. Your payment has been securely verified.
        </p>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8 text-left">
          <div className="flex items-center gap-3 mb-4 border-b border-gray-200 pb-4">
            <Package className="text-primary-600" />
            <h3 className="font-bold text-gray-900 text-lg">Order Details</h3>
          </div>
          <div className="grid grid-cols-2 gap-y-4 text-sm">
            <div className="text-gray-500">Order Number:</div>
            <div className="font-bold text-gray-900 text-right">{orderId}</div>
            <div className="text-gray-500">Payment Status:</div>
            <div className="font-bold text-green-600 text-right">Confirmed (Paystack)</div>
            <div className="text-gray-500">Status:</div>
            <div className="font-bold text-primary-700 text-right">Preparing Order</div>
          </div>
        </div>

        <div className="space-y-4">
          <a 
            href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full"
          >
            <Button size="lg" className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white gap-2">
              <MessageCircle size={20} />
              Confirm via WhatsApp
            </Button>
          </a>
          
          <Link to="/account/orders" className="block w-full">
            <Button variant="outline" size="lg" className="w-full gap-2">
              Track Order Status <ArrowRight size={18} />
            </Button>
          </Link>
          
          <div className="pt-4 mt-4 border-t border-gray-100">
            <Link to="/" className="text-sm font-medium text-primary-700 hover:text-primary-800 transition-colors">
              Return to Homepage
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
