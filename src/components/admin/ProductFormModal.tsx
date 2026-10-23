import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { ProductImageInput } from './ProductImageInput';
import { CATEGORIES } from '../../data/categories';
import toast from 'react-hot-toast';
import { productService } from '../../services/productService';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: any;
  onSuccess: () => void;
}

export function ProductFormModal({ isOpen, onClose, product, onSuccess }: ProductFormModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    brand: '',
    generic_name: '',
    description: '',
    price: '' as number | '',
    previous_price: '' as number | '',
    stock_quantity: '' as number | '',
    low_stock_threshold: '' as number | '',
    prescription_required: false,
    active: true,
    featured: false,
    image_url: '',
    category: ''
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        slug: product.slug || '',
        brand: product.brand || '',
        generic_name: product.generic_name || '',
        description: product.description || '',
        price: product.price || 0,
        previous_price: product.previous_price || 0,
        stock_quantity: product.stock_quantity || 0,
        low_stock_threshold: product.low_stock_threshold || 10,
        prescription_required: product.prescription_required || false,
        active: product.active ?? true,
        featured: product.featured ?? false,
        image_url: product.image_url || '',
        category: product.category || ''
      });
    } else {
      setFormData({
        name: '',
        slug: '',
        brand: '',
        generic_name: '',
        description: '',
        price: '',
        previous_price: '',
        stock_quantity: '',
        low_stock_threshold: '',
        prescription_required: false,
        active: true,
        featured: false,
        image_url: '',
        category: ''
      });
    }
  }, [product, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData(prev => {
      const updated = {
        ...prev,
        [name]: type === 'checkbox' 
          ? (e.target as HTMLInputElement).checked 
          : type === 'number' 
            ? (value === '' ? '' : Number(value)) 
            : value
      };
      
      if (name === 'name' && (!product || !prev.slug)) {
        updated.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      }
      
      return updated;
    });
  };

  const generateSlug = () => {
    if (formData.name) {
      setFormData(prev => ({
        ...prev,
        slug: prev.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Product name is required');
      return;
    }

    if (Number(formData.price) < 0 || isNaN(Number(formData.price))) {
      toast.error('Please enter a valid price');
      return;
    }

    setIsLoading(true);

    try {
      let finalSlug = formData.slug.trim();
      if (!finalSlug && formData.name) {
        finalSlug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      }

      const payload = {
        ...formData,
        id: product?.id,
        slug: finalSlug,
        price: Number(formData.price),
        previous_price: formData.previous_price ? Number(formData.previous_price) : undefined,
        stock_quantity: Number(formData.stock_quantity) || 0,
        low_stock_threshold: Number(formData.low_stock_threshold) || 10,
        image_url: formData.image_url.trim() || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400&h=400'
      };

      const result = await productService.saveProduct(payload);

      if (result.success) {
        toast.success(product?.id ? 'Product updated successfully' : 'Product added to inventory');
        onSuccess();
        onClose();
      } else {
        throw new Error(result.error || 'Failed to save product');
      }
    } catch (error: any) {
      console.error('Save product error:', error);
      toast.error(error.message || 'Error saving product');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-start sm:items-center justify-center p-2 sm:p-4 md:p-6">
      <div 
        className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[92vh] sm:max-h-[88vh] my-auto overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Sticky Header - Always visible at top */}
        <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-slate-100 flex justify-between items-center bg-white flex-shrink-0 z-20">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              {product ? 'Edit Product' : 'Add New Product'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {product ? 'Update inventory specifications, pricing, and details.' : 'Fill in the information below to add a new pharmacy product.'}
            </p>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="px-2.5 py-1 text-sm font-bold text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors flex-shrink-0 ml-2"
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>
        
        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 overscroll-contain">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input 
                label="Product Name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                onBlur={!product ? generateSlug : undefined}
                required 
              />
              <Input 
                label="Slug (URL)" 
                name="slug" 
                value={formData.slug} 
                onChange={handleChange} 
                required 
              />
              <Input 
                label="Brand" 
                name="brand" 
                value={formData.brand} 
                onChange={handleChange} 
              />
              <Input 
                label="Generic Name" 
                name="generic_name" 
                value={formData.generic_name} 
                onChange={handleChange} 
              />
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange} 
                  rows={3} 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
              </div>
              
              <Input 
                label="Price (₦)" 
                name="price" 
                type="number" 
                value={formData.price} 
                onChange={handleChange} 
                required 
              />
              <Input 
                label="Previous Price (₦)" 
                name="previous_price" 
                type="number" 
                value={formData.previous_price} 
                onChange={handleChange} 
              />
              <Input 
                label="Stock Quantity" 
                name="stock_quantity" 
                type="number" 
                value={formData.stock_quantity} 
                onChange={handleChange} 
                required 
              />
              <Input 
                label="Low Stock Threshold" 
                name="low_stock_threshold" 
                type="number" 
                value={formData.low_stock_threshold} 
                onChange={handleChange} 
                required 
              />
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="" disabled>Select category...</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Dual Image Uploader: Gallery / Device upload & Web link */}
              <div className="md:col-span-2 pt-2 border-t border-slate-100">
                <ProductImageInput
                  value={formData.image_url}
                  onChange={(newUrl) => setFormData(prev => ({ ...prev, image_url: newUrl }))}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-6">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  name="prescription_required" 
                  checked={formData.prescription_required} 
                  onChange={handleChange} 
                  className="rounded text-primary-600 focus:ring-primary-500 w-4 h-4"
                />
                <span className="text-sm font-medium text-slate-700">Prescription Required</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  name="featured" 
                  checked={formData.featured} 
                  onChange={handleChange} 
                  className="rounded text-primary-600 focus:ring-primary-500 w-4 h-4"
                />
                <span className="text-sm font-medium text-slate-700">Featured Product</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  name="active" 
                  checked={formData.active} 
                  onChange={handleChange} 
                  className="rounded text-primary-600 focus:ring-primary-500 w-4 h-4"
                />
                <span className="text-sm font-medium text-slate-700">Active (Visible in Store)</span>
              </label>
            </div>
          </div>

          {/* Sticky Action Footer */}
          <div className="px-5 py-3.5 sm:px-6 sm:py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50 flex-shrink-0 z-20">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading} className="gap-2">
              {product ? 'Save Changes' : 'Add Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
