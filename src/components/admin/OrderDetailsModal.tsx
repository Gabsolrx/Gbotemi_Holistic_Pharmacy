import React, { useState } from 'react';
import { X, Package, MapPin, CreditCard, Clock, CheckCircle, MessageSquare, FileText, ExternalLink } from 'lucide-react';
import { Button } from '../ui/Button';
import { formatCurrency } from '../../utils/format';
import { Order, OrderStatus } from '../../types';
import { SendPaymentConfirmationModal } from './SendPaymentConfirmationModal';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onPaymentConfirmed?: (orderId: string, updatedFields: Partial<Order>) => void;
}

export function OrderDetailsModal({ isOpen, onClose, order, onUpdateStatus, onPaymentConfirmed }: OrderDetailsModalProps) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  if (!isOpen || !order) return null;

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const statusOptions: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div 
        className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh] sm:max-h-[85vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
      >
        <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-white flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              Order #{order.id.replace('ORD-', '')}
            </h2>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <Clock size={12} /> {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-slate-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left Column: Details */}
            <div className="md:col-span-2 space-y-6">
              
              {/* Items */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Package size={18} className="text-primary-600" /> Order Items
                </h3>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium text-slate-900 text-sm">{item.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">Qty: {item.quantity} × {formatCurrency(item.price)}</p>
                      </div>
                      <p className="font-bold text-slate-900 text-sm">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                  <span className="font-bold text-slate-900">Total</span>
                  <span className="font-bold text-xl text-primary-700">{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>

              {/* Status Update */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle size={18} className="text-primary-600" /> Fulfillment Status
                </h3>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((status) => (
                    <button
                      key={status}
                      onClick={() => onUpdateStatus(order.id, status)}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize border transition-all ${
                        order.status === status
                          ? getStatusColor(status) + ' ring-2 ring-offset-1 ring-primary-500'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Customer Info */}
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4">Customer Details</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Name</p>
                    <p className="font-medium text-sm text-slate-900">{order.customerName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Email</p>
                    <p className="font-medium text-sm text-slate-900 break-all">{order.customerEmail}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <MapPin size={16} className="text-slate-400" /> Shipping
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {order.shippingAddress}
                </p>
              </div>

              {/* Uploaded Payment Receipt (Supabase) */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <FileText size={16} className="text-emerald-700" />
                    <span>Payment Receipt (Supabase)</span>
                  </h3>
                  {order.receiptUrl ? (
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                      Receipt Attached
                    </span>
                  ) : (
                    <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                      No Upload
                    </span>
                  )}
                </div>

                {order.receiptUrl ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 text-xs space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-emerald-950">Supabase Document Link:</span>
                        <a
                          href={order.receiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-bold text-primary-700 hover:text-primary-800 hover:underline bg-white px-2.5 py-1 rounded-lg border border-emerald-300 shadow-2xs"
                        >
                          <span>Open Document</span>
                          <ExternalLink size={12} />
                        </a>
                      </div>
                      <p className="font-mono text-[11px] text-slate-600 break-all select-all bg-white/90 p-2 rounded border border-emerald-100">
                        {order.receiptUrl}
                      </p>
                    </div>

                    {/* Image Preview Thumbnail if image */}
                    {!order.receiptUrl.toLowerCase().endsWith('.pdf') && (
                      <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 p-2 text-center">
                        <a href={order.receiptUrl} target="_blank" rel="noopener noreferrer" title="Click to view full image in new tab">
                          <img 
                            src={order.receiptUrl} 
                            alt="Receipt Preview" 
                            className="max-h-48 object-contain mx-auto rounded shadow-2xs hover:opacity-90 transition-opacity"
                          />
                          <span className="text-[11px] text-slate-500 underline mt-1.5 inline-block font-medium">Click to view full image</span>
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center">
                    <p className="text-xs text-slate-500">No payment receipt file uploaded for this order.</p>
                  </div>
                )}
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <CreditCard size={16} className="text-slate-400" /> Payment & Confirmation
                </h3>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 inline-block">
                      Bank Transfer (Moniepoint MFB)
                    </p>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                      order.paymentStatus === 'confirmed'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}>
                      {order.paymentStatus === 'confirmed' ? '✓ Payment Confirmed' : 'Payment Pending'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-mono">
                    Acc: 4005436023 • GBOTEMI HOLISTIC
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowConfirmModal(true)}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] active:bg-[#1caa51] text-white font-bold py-2.5 px-3.5 rounded-xl shadow-xs hover:shadow-sm transition-all text-xs cursor-pointer"
                  >
                    <MessageSquare size={15} />
                    <span>Send Prefilled WhatsApp Confirmation</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {showConfirmModal && (
        <SendPaymentConfirmationModal
          isOpen={true}
          onClose={() => setShowConfirmModal(false)}
          order={order}
          onPaymentConfirmed={(orderId, updatedFields) => {
            if (onPaymentConfirmed) onPaymentConfirmed(orderId, updatedFields);
            if (updatedFields.status) onUpdateStatus(orderId, updatedFields.status);
          }}
        />
      )}
    </div>
  );
}
