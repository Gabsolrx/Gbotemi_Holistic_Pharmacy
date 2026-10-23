import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { formatCurrency } from '../../utils/format';
import { Order } from '../../types';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface SendPaymentConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onPaymentConfirmed?: (orderId: string, updatedFields: Partial<Order>) => void;
}

export function SendPaymentConfirmationModal({
  isOpen,
  onClose,
  order,
  onPaymentConfirmed,
}: SendPaymentConfirmationModalProps) {
  if (!isOpen || !order) return null;

  const [customerPhone, setCustomerPhone] = useState<string>(
    order.customerPhone || ''
  );
  const [message, setMessage] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const rawPhone = order.customerPhone || '';
    setCustomerPhone(rawPhone);

    const formattedAmount = formatCurrency(order.totalAmount);
    const deliveryMethod = order.deliveryMethod || 'Dispatch Rider';

    const defaultMsg = `Hello ${order.customerName},\n\nThis is Gbotemi Holistic Pharmacy. We are pleased to confirm that we have received and verified your payment of ${formattedAmount} for Order #${order.id}.\n\nYour medication order has been approved and is now being packaged for dispatch!\n• Delivery Method: ${deliveryMethod} (Remember to pay the driver or rider directly upon delivery)\n\nIf you have any questions or require consultation regarding your medications, our licensed pharmacists are here to support you.\n\nThank you for choosing Gbotemi Holistic Pharmacy!`;

    setMessage(defaultMsg);
  }, [order]);

  const cleanPhone = (phone: string): string => {
    let cleaned = phone.replace(/[\s+\-()]/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = '234' + cleaned.substring(1);
    } else if (!cleaned.startsWith('234')) {
      if (cleaned.length === 10) {
        cleaned = '234' + cleaned;
      } else if (cleaned.length === 11 && cleaned.startsWith('0')) {
        cleaned = '234' + cleaned.substring(1);
      }
    }
    return cleaned;
  };

  const recordConfirmation = async (phone: string, text: string) => {
    const timestamp = new Date().toISOString();

    try {
      await supabase
        .from('orders')
        .update({
          payment_status: 'confirmed',
          payment_confirmed_at: timestamp,
          status: order.status === 'pending' ? 'processing' : order.status,
          updated_at: timestamp,
        })
        .eq('id', order.id);
    } catch (e) {
      console.warn('Could not update order status in Supabase:', e);
    }

    try {
      await supabase
        .from('payment_confirmations')
        .insert({
          order_id: order.id,
          customer_name: order.customerName,
          customer_phone: phone,
          amount: order.totalAmount,
          message_text: text,
          confirmed_at: timestamp,
        });
    } catch (e) {
      console.warn('Could not insert to payment_confirmations table:', e);
    }

    try {
      const stored = JSON.parse(localStorage.getItem('gbotemi_payment_confirmations') || '[]');
      stored.unshift({
        id: `conf_${Date.now()}`,
        orderId: order.id,
        customerName: order.customerName,
        customerPhone: phone,
        amount: order.totalAmount,
        messageText: text,
        confirmedAt: timestamp,
      });
      localStorage.setItem('gbotemi_payment_confirmations', JSON.stringify(stored.slice(0, 50)));
    } catch {}

    if (onPaymentConfirmed) {
      onPaymentConfirmed(order.id, {
        paymentStatus: 'confirmed',
        paymentConfirmedAt: timestamp,
        status: order.status === 'pending' ? 'processing' : order.status,
      });
    }
  };

  const handleSendWhatsApp = async () => {
    if (!customerPhone.trim()) {
      toast.error('Please enter the customer phone number');
      return;
    }

    const formattedPhone = cleanPhone(customerPhone);
    const encodedText = encodeURIComponent(message);
    const waUrl = `https://wa.me/${formattedPhone}?text=${encodedText}`;

    // Open synchronously in user gesture context to prevent popup blocker
    try {
      const win = window.open(waUrl, '_blank', 'noopener,noreferrer');
      if (!win) {
        const link = document.createElement('a');
        link.href = waUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch {
      window.location.href = waUrl;
    }

    setIsUpdating(true);
    await recordConfirmation(customerPhone, message);
    toast.success('Payment confirmed and WhatsApp opened!');
    setIsUpdating(false);
    onClose();
  };

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      toast.success('Confirmation message copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error('Could not copy message');
    }
  };

  const handleMarkConfirmedOnly = async () => {
    setIsUpdating(true);
    await recordConfirmation(customerPhone, message);
    toast.success('Order marked as payment confirmed!');
    setIsUpdating(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 font-sans">
      <div 
        className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-xl flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-white flex-shrink-0">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md inline-block mb-1">
              Payment Dispatch
            </span>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">
              Send Payment Confirmation
            </h2>
            <p className="text-xs text-slate-500">
              Order #{order.id} • {order.customerName}
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="px-2.5 py-1 text-sm font-bold text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 bg-slate-50">
          {/* Order Snapshot */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-slate-500 block mb-0.5">Customer</span>
              <span className="font-bold text-slate-900 truncate block">{order.customerName}</span>
            </div>
            <div>
              <span className="text-slate-500 block mb-0.5">Amount Paid</span>
              <span className="font-extrabold text-emerald-800 block">{formatCurrency(order.totalAmount)}</span>
            </div>
            <div>
              <span className="text-slate-500 block mb-0.5">Current Status</span>
              <span className="font-semibold text-primary-700 capitalize block">{order.status}</span>
            </div>
          </div>

          {/* Customer WhatsApp Number */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
              Customer WhatsApp / Phone Number
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="e.g. 08012345678 or 2348012345678"
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <p className="text-[11px] text-slate-500">
              Admin can update the customer's phone number here before triggering the WhatsApp confirmation.
            </p>
          </div>

          {/* Prefilled Confirmation Message */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Prefilled Confirmation Message
              </label>
              <button
                type="button"
                onClick={handleCopyMessage}
                className="text-xs font-semibold text-slate-600 hover:text-emerald-700 cursor-pointer"
              >
                {copied ? 'Copied to Clipboard' : 'Copy Text'}
              </button>
            </div>
            <textarea
              rows={7}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-sans leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-y"
            />
            <p className="text-[11px] text-slate-500">
              You can personalize this message before dispatching it to the customer.
            </p>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-5 py-4 border-t border-slate-200 bg-white flex-shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleMarkConfirmedOnly}
            disabled={isUpdating}
            className="w-full sm:w-auto text-xs font-semibold"
          >
            Mark Confirmed (Without WhatsApp)
          </Button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isUpdating}
              className="flex-1 sm:flex-initial text-xs"
            >
              Cancel
            </Button>
            <button
              type="button"
              onClick={handleSendWhatsApp}
              disabled={isUpdating}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center bg-[#25D366] hover:bg-[#20bd5a] active:bg-[#1caa51] text-white font-bold py-2.5 px-4 rounded-xl shadow-sm hover:shadow-md transition-all text-xs sm:text-sm cursor-pointer disabled:opacity-75"
            >
              Send via WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
