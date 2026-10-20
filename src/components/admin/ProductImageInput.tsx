import React, { useState, useRef, useEffect } from 'react';
import { Upload, Link as LinkIcon, Image as ImageIcon, X, Check, Loader2, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import { uploadProductImage } from '../../utils/imageUpload';
import toast from 'react-hot-toast';

interface ProductImageInputProps {
  value: string;
  onChange: (imageUrl: string) => void;
}

export function ProductImageInput({ value, onChange }: ProductImageInputProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [urlInput, setUrlInput] = useState(value || '');
  const [imageError, setImageError] = useState(false);
  const [uploadDetails, setUploadDetails] = useState<{ fileName?: string; sizeKb?: number } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync internal state if external value changes
  useEffect(() => {
    setUrlInput(value || '');
    setImageError(false);
    if (value && value.startsWith('http') && !value.includes('supabase') && activeTab === 'upload' && !uploadDetails) {
      // If initialized with an external URL, default to url tab
      setActiveTab('url');
    }
  }, [value]);

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose a valid image file (JPG, PNG, WebP, etc.)');
      return;
    }

    // Limit raw file to reasonable size (e.g., 20MB max before compression)
    if (file.size > 20 * 1024 * 1024) {
      toast.error('Image is too large. Please select an image under 20MB.');
      return;
    }

    setIsProcessing(true);
    setImageError(false);

    try {
      const result = await uploadProductImage(file);
      onChange(result.url);
      setUploadDetails({
        fileName: file.name,
        sizeKb: result.sizeKb,
      });
      toast.success('Image loaded successfully!');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to process image');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleUrlSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = urlInput.trim();
    if (!trimmed) {
      onChange('');
      return;
    }
    onChange(trimmed);
    setImageError(false);
    toast.success('Image link applied');
  };

  const handleClear = () => {
    onChange('');
    setUrlInput('');
    setUploadDetails(null);
    setImageError(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Quick preset pharmacy icons / samples for testing
  const sampleImages = [
    { label: 'Syrup / Liquid', url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80' },
    { label: 'Tablets / Blister', url: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=600&auto=format&fit=crop&q=80' },
    { label: 'Vitamins Bottle', url: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&auto=format&fit=crop&q=80' },
    { label: 'First Aid / Device', url: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=600&auto=format&fit=crop&q=80' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-slate-800">
          Product Image
        </label>
        <span className="text-xs text-slate-500">
          Upload from phone/laptop or paste link
        </span>
      </div>

      {/* Tab Switcher */}
      <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all ${
            activeTab === 'upload'
              ? 'bg-white text-slate-900 shadow-sm font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Upload size={16} className={activeTab === 'upload' ? 'text-primary-600' : ''} />
          Upload from Device / Gallery
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('url')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all ${
            activeTab === 'url'
              ? 'bg-white text-slate-900 shadow-sm font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <LinkIcon size={16} className={activeTab === 'url' ? 'text-primary-600' : ''} />
          Paste Image Web Link
        </button>
      </div>

      {/* Tab 1: Upload from Gallery / Device */}
      {activeTab === 'upload' && (
        <div className="space-y-3">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileSelect(e.target.files[0]);
              }
            }}
          />

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 ${
              isDragging
                ? 'border-primary-500 bg-primary-50 scale-[0.99]'
                : 'border-slate-300 hover:border-primary-400 bg-slate-50/70 hover:bg-slate-50'
            }`}
          >
            {isProcessing ? (
              <div className="flex flex-col items-center justify-center py-4 space-y-3">
                <Loader2 size={36} className="text-primary-600 animate-spin" />
                <p className="text-sm font-medium text-slate-700">Optimizing & uploading image...</p>
                <p className="text-xs text-slate-400">Processing file for best display speed</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-primary-600">
                  <Upload size={24} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Click or tap to choose from Gallery / Camera
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Drag and drop file here, or tap to open Phone Gallery or Camera
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600">
                  <span>JPEG, PNG, WebP, GIF (Auto-optimized)</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: URL Link */}
      {activeTab === 'url' && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <LinkIcon size={16} />
              </div>
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/product-image.jpg"
                className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleUrlSubmit();
                  }
                }}
              />
              {urlInput && (
                <button
                  type="button"
                  onClick={() => {
                    setUrlInput('');
                    onChange('');
                  }}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => handleUrlSubmit()}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-medium transition-colors"
            >
              Apply Link
            </button>
          </div>

          {/* Quick Samples */}
          <div className="pt-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
              <Sparkles size={13} className="text-amber-500" />
              <span>Or choose a sample placeholder:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {sampleImages.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setUrlInput(s.url);
                    onChange(s.url);
                    setImageError(false);
                  }}
                  className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg transition-colors"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Active Image Preview Card */}
      {value ? (
        <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 overflow-hidden flex-shrink-0 relative flex items-center justify-center shadow-sm">
              {imageError ? (
                <div className="flex flex-col items-center justify-center p-1 text-center text-red-500">
                  <AlertCircle size={20} />
                  <span className="text-[9px] mt-0.5 leading-tight">Broken</span>
                </div>
              ) : (
                <img
                  src={value}
                  alt="Product preview"
                  className="w-full h-full object-contain p-1"
                  onError={() => setImageError(true)}
                  referrerPolicy="no-referrer"
                />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                  <Check size={12} /> Image Ready
                </span>
                {value.startsWith('data:') && (
                  <span className="text-[10px] text-slate-500 bg-slate-200/80 px-1.5 py-0.5 rounded">
                    Direct Device File
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 truncate mt-1 max-w-[200px] sm:max-w-xs font-mono">
                {uploadDetails?.fileName || (value.startsWith('data:') ? 'Image uploaded from gallery' : value)}
              </p>
              {uploadDetails?.sizeKb && (
                <p className="text-[11px] text-slate-400">
                  Size: ~{uploadDetails.sizeKb} KB
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'upload' ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1"
              >
                <RefreshCw size={12} /> Replace
              </button>
            ) : null}
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Remove image"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
