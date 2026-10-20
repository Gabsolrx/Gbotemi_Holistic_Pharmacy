import { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle2, X, Loader2 } from 'lucide-react';
import { formatCurrency } from '../../utils/format';
import { openWhatsAppDirect } from '../../utils/receiptUpload';
import { uploadProductImage } from '../../utils/imageUpload';
import toast from 'react-hot-toast';

export const BANK_DETAILS = {
  bankName: 'Moniepoint MFB',
  accountNumber: '4005436023',
  accountName: 'GBOTEMI HOLISTIC PHARMACY',
  whatsappNumber: '2348029660153',
};

export interface OrderedItemInfo {
  name: string;
  quantity: number;
  price?: number;
}

interface BankTransferPaymentCardProps {
  amount: number;
  customerName?: string;
  orderReference?: string;
  customerPhone?: string;
  deliveryMethodName?: string;
  deliveryNotice?: string;
  orderedItems?: OrderedItemInfo[];
  showWhatsAppButton?: boolean;
  onWhatsAppClick?: () => void;
  receiptFile?: File | null;
  onReceiptFileChange?: (file: File | null) => void;
  isUploadingReceipt?: boolean;
}

export function BankTransferPaymentCard({
  amount,
  customerName = '',
  orderReference = '',
  customerPhone = '',
  deliveryMethodName = '',
  orderedItems = [],
  showWhatsAppButton = true,
  onWhatsAppClick,
  receiptFile: controlledReceiptFile,
  onReceiptFileChange,
  isUploadingReceipt = false,
}: BankTransferPaymentCardProps) {
  const [copied, setCopied] = useState(false);
  const [internalReceiptFile, setInternalReceiptFile] = useState<File | null>(null);
  const [localUploading, setLocalUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const activeFile = controlledReceiptFile !== undefined ? controlledReceiptFile : internalReceiptFile;

  const handleFileChange = (file: File | null) => {
    if (onReceiptFileChange) {
      onReceiptFileChange(file);
    } else {
      setInternalReceiptFile(file);
    }
  };

  useEffect(() => {
    if (activeFile && activeFile.type.startsWith('image/')) {
      const url = URL.createObjectURL(activeFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [activeFile]);

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

  const buildWhatsAppMessage = (supabaseReceiptUrl = '') => {
    const orderText = orderReference && orderReference !== 'New Order' ? `for Order #${orderReference}` : 'for my medication order';
    const nameText = customerName ? `\n\n*Customer Details:*\nName: ${customerName}` : '';
    const phoneText = customerPhone ? `\nPhone: ${customerPhone}` : '';
    const deliveryText = deliveryMethodName ? `\nDelivery Preference: ${deliveryMethodName} (Pay driver or rider directly upon delivery)` : '';

    let productsText = '';
    if (orderedItems && orderedItems.length > 0) {
      productsText = '\n\n*Products Ordered:*\n' + orderedItems.map((item, idx) => `  ${idx + 1}. ${item.name} (Qty: ${item.quantity}) - ${formatCurrency((item.price || 0) * item.quantity)}`).join('\n');
    }

    const receiptSection = supabaseReceiptUrl ? `\n\n*Payment Receipt Document:*\n${supabaseReceiptUrl}` : '';

    return `Hello Gbotemi Holistic Pharmacy,\n\nI have made a bank transfer payment of ${formatCurrency(amount)} to your Moniepoint MFB account (${BANK_DETAILS.accountNumber}) ${orderText}.${nameText}${phoneText}${deliveryText}${productsText}${receiptSection}\n\nKindly confirm my payment and dispatch my order.\n\nThank you!`;
  };

  const handleWhatsAppAction = async () => {
    if (onWhatsAppClick) {
      onWhatsAppClick();
      return;
    }

    if (!activeFile) {
      toast.error('Please upload your bank transfer receipt (image or PDF) before proceeding.');
      return;
    }

    const isMobile = typeof navigator !== 'undefined' && /android|iphone|ipad|ipod/i.test(navigator.userAgent);
    let preWin: Window | null = null;
    if (!isMobile) {
      try {
        preWin = window.open('about:blank', '_blank');
      } catch {}
    }

    setLocalUploading(true);
    let fileUrl = '';
    try {
      const uploadToastId = toast.loading('Uploading receipt to Supabase...');
      const uploadResult = await uploadProductImage(activeFile);
      fileUrl = uploadResult.url;
      toast.success('Receipt uploaded to Supabase!', { id: uploadToastId });
    } catch (err: any) {
      console.warn('Could not upload receipt to storage:', err);
      toast.error('Could not upload receipt to Supabase: ' + (err.message || 'Error'));
      if (preWin && !preWin.closed) preWin.close();
      setLocalUploading(false);
      return;
    }

    const messageText = buildWhatsAppMessage(fileUrl);
    const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || BANK_DETAILS.whatsappNumber;

    openWhatsAppDirect(whatsappNumber, messageText, preWin);
    toast.success('Directing to Gbotemi Holistic Pharmacy WhatsApp with receipt link...');
    setLocalUploading(false);
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-emerald-600/30 shadow-md overflow-hidden transition-all duration-300">
      {/* Top Banner / Method Title */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-primary-700 px-6 py-4 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="font-bold text-lg leading-tight text-white tracking-wide">
              Direct Bank Transfer
            </h3>
            <p className="text-xs text-emerald-100">
              Moniepoint MFB • Instant Direct Verification
            </p>
          </div>
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-100 text-xs font-semibold self-start sm:self-auto border border-emerald-400/30">
            Verified Business Account
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-7 space-y-6">
        {/* Amount to Transfer Highlight */}
        <div className="bg-gradient-to-br from-emerald-50 to-primary-50/60 rounded-xl p-4 sm:p-5 border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <span className="text-xs uppercase tracking-wider text-emerald-800 font-bold block mb-1">
              Amount to Transfer
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-950 tracking-tight">
              {formatCurrency(amount)}
            </span>
          </div>
          <div className="text-xs text-emerald-800 bg-white/80 backdrop-blur-xs px-3.5 py-2 rounded-lg border border-emerald-200 shadow-2xs font-medium">
            Please transfer the exact amount
          </div>
        </div>

        {/* Selected Delivery Option */}
        {deliveryMethodName && (
          <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="text-xs sm:text-sm text-slate-800">
              <span className="font-semibold text-slate-900">Delivery Method: </span>
              {deliveryMethodName}
            </div>
            <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-md border border-amber-300 w-fit">
              Pay driver or rider directly upon delivery
            </span>
          </div>
        )}

        {/* Ordered Products Preview */}
        {orderedItems && orderedItems.length > 0 && (
          <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-xl p-3.5 space-y-2">
            <span className="text-xs text-emerald-900 uppercase tracking-wider font-bold block">
              Products in this Order:
            </span>
            <div className="space-y-1">
              {orderedItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs sm:text-sm text-slate-800">
                  <span className="font-medium text-slate-900">
                    {item.name} × {item.quantity}
                  </span>
                  {item.price && (
                    <span className="font-semibold text-emerald-900">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Official Moniepoint MFB Account Details */}
        <div className="rounded-xl border-2 border-emerald-500/40 bg-emerald-50/40 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-200/60 pb-3">
            <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
              Bank Details
            </span>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
              Official Account
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

          <div className="pt-2 border-t border-emerald-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
              className={`px-5 py-3 rounded-xl font-bold text-sm transition-all duration-200 shadow-sm cursor-pointer ${
                copied
                  ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                  : 'bg-primary-700 hover:bg-primary-800 active:bg-primary-900 text-white hover:shadow-md'
              }`}
              title="Copy 4005436023 to clipboard"
            >
              {copied ? 'COPIED!' : 'COPY ACCOUNT NUMBER'}
            </button>
          </div>
        </div>

        {/* PAYMENT INSTRUCTIONS SECTION */}
        <div className="rounded-xl border border-amber-200/90 bg-amber-50/70 p-5 space-y-3">
          <div className="text-amber-900 font-bold text-sm uppercase tracking-wider">
            PAYMENT INSTRUCTIONS
          </div>

          <ol className="space-y-3 text-sm text-slate-700 font-medium">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-700 text-white text-xs font-bold flex items-center justify-center mt-0.5 shadow-2xs">
                1
              </span>
              <span>
                Transfer the exact total of{' '}
                <strong className="text-slate-900 font-bold">
                  {formatCurrency(amount)}
                </strong>{' '}
                to the{' '}
                <strong className="text-slate-900 font-bold">
                  {BANK_DETAILS.bankName}
                </strong>{' '}
                account above ({BANK_DETAILS.accountNumber}) via your bank app, USSD, or internet banking.
              </span>
            </li>

            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-700 text-white text-xs font-bold flex items-center justify-center mt-0.5 shadow-2xs">
                2
              </span>
              <span>
                Use your <strong className="text-slate-900 font-bold">Full Name</strong>
                {customerName ? ` (${customerName})` : ''} or Order ID as your transfer description / narration.
              </span>
            </li>

            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-700 text-white text-xs font-bold flex items-center justify-center mt-0.5 shadow-2xs">
                3
              </span>
              <span>
                Upload your transfer screenshot or PDF receipt below. Our system will generate a verified Supabase link for WhatsApp.
              </span>
            </li>

            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-600 text-white text-xs font-bold flex items-center justify-center mt-0.5 shadow-2xs">
                4
              </span>
              <span>
                <strong className="text-slate-900 font-bold">Delivery Notice:</strong> Always pay driver or rider directly upon delivery.
              </span>
            </li>
          </ol>
        </div>

        {/* RECEIPT UPLOAD AREA (Same logic as Prescription Upload) */}
        <div className="rounded-2xl border-2 border-emerald-500/40 bg-white p-5 sm:p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm sm:text-base font-bold text-gray-900">
                Upload Payment Receipt (Image or PDF) *
              </label>
              <p className="text-xs text-slate-500 mt-0.5">
                Your receipt will be securely stored on Supabase and linked directly in your WhatsApp message.
              </p>
            </div>
            {activeFile && (
              <button
                type="button"
                onClick={() => handleFileChange(null)}
                className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-semibold px-2 py-1 rounded-md hover:bg-red-50 transition-colors"
              >
                <X size={14} />
                <span>Remove</span>
              </button>
            )}
          </div>

          <div className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center transition-all cursor-pointer relative ${
            activeFile 
              ? 'border-emerald-500 bg-emerald-50/50' 
              : 'border-gray-300 bg-gray-50/70 hover:bg-emerald-50/30 hover:border-emerald-400'
          }`}>
            <input 
              type="file" 
              accept="image/*,.pdf" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              onChange={(e) => {
                const selected = e.target.files?.[0] || null;
                handleFileChange(selected);
              }}
            />
            {activeFile ? (
              <div className="flex flex-col items-center">
                {previewUrl ? (
                  <div className="relative mb-3 rounded-lg overflow-hidden border-2 border-emerald-300 shadow-xs max-h-36 max-w-xs bg-white">
                    <img 
                      src={previewUrl} 
                      alt="Receipt preview" 
                      className="max-h-36 object-contain mx-auto"
                    />
                  </div>
                ) : (
                  <FileText className="text-emerald-700 mb-2" size={42} />
                )}
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full mb-1">
                  <CheckCircle2 size={13} />
                  <span>Receipt Attached</span>
                </div>
                <span className="text-sm font-bold text-gray-900 truncate max-w-sm">{activeFile.name}</span>
                <span className="text-xs text-emerald-700 font-medium mt-0.5">
                  {(activeFile.size / 1024 / 1024).toFixed(2)} MB • Ready to upload to Supabase
                </span>
                <p className="text-xs text-slate-500 mt-3 underline font-medium">Click or drag another file to replace</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                  <Upload size={28} />
                </div>
                <span className="text-sm sm:text-base font-bold text-gray-900">
                  Click to upload transfer receipt or drag & drop
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  PNG, JPG, JPEG, WEBP, or PDF (up to 10MB)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* PAYMENT MADE (Open WhatsApp Confirmation) Button (Used when standalone) */}
        {showWhatsAppButton && (
          <div className="pt-2 space-y-2">
            <button
              type="button"
              onClick={handleWhatsAppAction}
              disabled={localUploading || isUploadingReceipt}
              className="w-full bg-[#25D366] hover:bg-[#20bd5a] active:bg-[#1caa51] text-white font-bold py-4 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer text-center disabled:opacity-75"
            >
              {(localUploading || isUploadingReceipt) ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Uploading Receipt to Supabase...</span>
                </>
              ) : (
                <span className="tracking-wide text-sm sm:text-base uppercase font-extrabold">
                  PAYMENT MADE (Open WhatsApp Confirmation)
                </span>
              )}
            </button>
            <p className="text-center text-xs text-slate-500">
              Uploads receipt to Supabase and opens WhatsApp with your prefilled order & receipt link
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
