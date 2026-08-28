import React, { useState } from 'react';
import { AlertTriangle, Trash2, X, Loader2, Package } from 'lucide-react';
import { Button } from '../ui/Button';
import { productService } from '../../services/productService';
import { formatCurrency } from '../../utils/format';
import toast from 'react-hot-toast';

interface DeleteProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any | null;
  onSuccess: () => void;
}

export function DeleteProductModal({
  isOpen,
  onClose,
  product,
  onSuccess,
}: DeleteProductModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !product) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await productService.deleteProduct(product.id);
      toast.success(`"${product.name}" was deleted successfully`);
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Failed to delete product:', err);
      toast.error('Could not delete product.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeactivateInstead = async () => {
    setIsDeleting(true);
    try {
      await productService.archiveProduct(product.id);
      toast.success(`"${product.name}" was archived (set to Draft)`);
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Failed to deactivate product');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        <button 
          onClick={onClose}
          disabled={isDeleting}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Delete Product</h3>
            <p className="text-sm text-slate-500">This action cannot be undone.</p>
          </div>
        </div>

        {/* Product Preview Info */}
        <div className="my-5 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-xl bg-white border border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
            {product.image_url ? (
              <img 
                src={product.image_url} 
                alt={product.name} 
                className="w-full h-full object-contain p-1 mix-blend-multiply"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <Package className="w-6 h-6 text-slate-400" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-slate-900 text-sm truncate">{product.name}</p>
            <p className="text-xs text-slate-500 truncate">{product.brand || product.category || 'Pharmacy item'}</p>
            <p className="text-xs font-bold text-slate-800 mt-0.5">{formatCurrency(product.price)}</p>
          </div>
        </div>

        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          Are you sure you want to permanently delete <strong className="text-slate-900 font-semibold">{product.name}</strong> from your inventory?
        </p>

        <div className="space-y-2.5">
          <div className="flex flex-col-reverse sm:flex-row gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleDelete}
              isLoading={isDeleting}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white gap-2"
            >
              <Trash2 size={16} /> Delete Permanently
            </Button>
          </div>

          <button
            type="button"
            onClick={handleDeactivateInstead}
            disabled={isDeleting}
            className="w-full text-xs text-center text-slate-500 hover:text-slate-700 py-1.5 transition-colors underline"
          >
            Or set to Inactive (Draft) instead
          </button>
        </div>
      </div>
    </div>
  );
}
