import React, { useState } from 'react';
import { Copy, Check, Building2, User, Hash, Upload, FileText, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../../utils/format';
import toast from 'react-hot-toast';

export const BANK_DETAILS = {
  bankName: 'Moniepoint Microfinance Bank (MFB)',
  accountNumber: '8029660153',
  accountName: 'Gbotemi Holistic Pharmacy',
  whatsappNumber: '2348029660153',
};

export interface BankTransferPaymentCardProps {
  amount?: number;
  customerName?: string;
  orderReference?: string;
  customerPhone?: string;
  deliveryMethodName?: string;
  orderedItems?: Array<{ name: string; quantity: number; price?: number }>;
  showWhatsAppButton?: boolean;
  receiptFile?: File | null;
  onReceiptFileChange?: (file: File | null) => void;
  isUploadingReceipt?: boolean;
}

export function BankTransferPaymentCard({
  amount,
  customerName,
  orderReference,
  receiptFile,
  onReceiptFileChange,
  isUploadingReceipt = false,
}: BankTransferPaymentCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyAccount = async () => {
    try {
      await navigator.clipboard.writeText(BANK_DETAILS.accountNumber);
      setCopied(true);
      toast.success(`Account number ${BANK_DETAILS.accountNumber} copied!`);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const el = document.createElement('textarea');
      el.value = BANK_DETAILS.accountNumber;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      toast.success(`Account number ${BANK_DETAILS.accountNumber} copied!`);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm font-sans">
      {/* Top Banner */}
      <div className="bg-emerald-900 text-white p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-800/80 px-2.5 py-0.5 rounded-full inline-block mb-1 border border-emerald-700/50">
              Official Pharmacy Account
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white">Direct Bank Transfer</h3>
          </div>
          {amount !== undefined && (
            <div className="text-left sm:text-right">
              <span className="text-xs text-emerald-200 block">Total Transfer Amount</span>
              <span className="text-xl sm:text-2xl font-black text-amber-300">
                {formatCurrency(amount)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Account Info Box */}
      <div className="p-5 sm:p-6 space-y-4">
        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
              <Building2 size={16} className="text-emerald-700" /> Bank Name
            </span>
            <span className="text-sm font-bold text-gray-900">{BANK_DETAILS.bankName}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
              <User size={16} className="text-emerald-700" /> Account Name
            </span>
            <span className="text-sm font-bold text-gray-900">{BANK_DETAILS.accountName}</span>
          </div>

          <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Hash size={18} className="text-emerald-700 shrink-0" />
              <div>
                <span className="text-[11px] text-gray-500 uppercase font-bold block">Account Number</span>
                <span className="text-lg sm:text-xl font-mono font-black text-emerald-950 tracking-wider">
                  {BANK_DETAILS.accountNumber}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopyAccount}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer shrink-0"
              title="Copy account number"
            >
              {copied ? <Check size={14} className="text-emerald-300" /> : <Copy size={14} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Transfer instructions */}
        <div className="text-xs text-gray-600 flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-gray-100">
          <AlertCircle size={16} className="text-emerald-600 shrink-0 mt-0.5" />
          <span>
            Please transfer the exact amount and upload your payment receipt below. Your order will be immediately confirmed upon receipt verification.
          </span>
        </div>

        {/* Receipt Upload Section */}
        {onReceiptFileChange && (
          <div className="pt-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Upload Bank Transfer Receipt (Screenshot / PDF)
            </label>
            <div className="relative border-2 border-dashed border-emerald-300 rounded-2xl p-5 text-center bg-emerald-50/30 hover:bg-emerald-50/60 transition-colors cursor-pointer group">
              <input
                type="file"
                accept="image/*,.pdf"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  onReceiptFileChange(file);
                }}
              />
              <div className="flex flex-col items-center justify-center gap-2 pointer-events-none">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                  {receiptFile ? <FileText size={20} /> : <Upload size={20} />}
                </div>
                {receiptFile ? (
                  <div>
                    <span className="text-xs font-bold text-emerald-900 block truncate max-w-xs sm:max-w-md">
                      {receiptFile.name}
                    </span>
                    <span className="text-[11px] text-gray-500">
                      {(receiptFile.size / 1024).toFixed(1)} KB • Click or drag to replace
                    </span>
                  </div>
                ) : (
                  <div>
                    <span className="text-xs font-bold text-emerald-900 block">
                      Click to browse or drop payment receipt here
                    </span>
                    <span className="text-[11px] text-gray-500">
                      PNG, JPG, JPEG, or PDF up to 10MB
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BankTransferPaymentCard;
