import React, { useState, useEffect } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { blogService } from '../../services/blogService';
import toast from 'react-hot-toast';

interface BlogFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  post?: any;
  onSuccess: () => void;
}

export function BlogFormModal({ isOpen, onClose, post, onSuccess }: BlogFormModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Wellness',
    excerpt: '',
    content: '',
    author: 'Dr. Gbotemi Lead Pharmacist',
    readTime: '4 min read',
    imageUrl: '',
  });

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || '',
        category: post.category || 'Wellness',
        excerpt: post.excerpt || '',
        content: post.content || '',
        author: post.author || 'Dr. Gbotemi Lead Pharmacist',
        readTime: post.readTime || '4 min read',
        imageUrl: post.imageUrl || '',
      });
    } else {
      setFormData({
        title: '',
        category: 'Wellness',
        excerpt: '',
        content: '',
        author: 'Dr. Gbotemi Lead Pharmacist',
        readTime: '4 min read',
        imageUrl: '',
      });
    }
  }, [post, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Post title is required');
      return;
    }

    setIsLoading(true);
    try {
      await blogService.savePost({
        ...formData,
        id: post?.id,
        imageUrl: formData.imageUrl.trim() || 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&q=80&w=800',
      });
      toast.success(post?.id ? 'Article updated successfully' : 'Article published successfully');
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save article');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 font-sans">
      <div 
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            {post?.id ? 'Edit Article' : 'Write New Article'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4 flex-1">
          <Input
            label="Article Title *"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Managing Hypertension: The Holistic Approach"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="Wellness">Wellness & Prevention</option>
                <option value="Medications">Medications & Advice</option>
                <option value="Nutrition">Holistic Nutrition</option>
                <option value="Chronic Care">Chronic Disease Care</option>
                <option value="Pharmacy News">Pharmacy News</option>
              </select>
            </div>

            <Input
              label="Author Name"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              placeholder="Dr. Gbotemi Lead Pharmacist"
            />
          </div>

          <Input
            label="Cover Image URL"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            placeholder="https://images.unsplash.com/..."
          />

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Short Summary / Excerpt
            </label>
            <textarea
              rows={2}
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="A brief punchy summary to display on card previews..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Article Body / Content
            </label>
            <textarea
              rows={6}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Write the full health guidance article here..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <Button type="submit" isLoading={isLoading} className="font-semibold">
              {post?.id ? 'Save Changes' : 'Publish Article'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BlogFormModal;
