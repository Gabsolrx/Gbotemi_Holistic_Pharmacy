import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import toast from 'react-hot-toast';
import { blogService } from '../../services/blogService';
import { ProductImageInput } from './ProductImageInput'; // Re-using this since it handles URLs well

interface BlogFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: any | null;
  onSuccess: () => void;
}

export function BlogFormModal({ isOpen, onClose, post, onSuccess }: BlogFormModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    author: '',
    readTime: '',
    excerpt: '',
    content: '',
    imageUrl: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || '',
        category: post.category || '',
        author: post.author || '',
        readTime: post.readTime || '',
        excerpt: post.excerpt || '',
        content: post.content || '',
        imageUrl: post.imageUrl || '',
        date: post.date || new Date().toISOString().split('T')[0],
      });
    } else {
      setFormData({
        title: '',
        category: '',
        author: 'Admin',
        readTime: '5 min read',
        excerpt: '',
        content: '',
        imageUrl: '',
        date: new Date().toISOString().split('T')[0],
      });
    }
  }, [post, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Title and content are required');
      return;
    }
    
    setIsLoading(true);
    try {
      const payload = { ...formData, id: post?.id };
      await blogService.savePost(payload);
      toast.success(post ? 'Post updated successfully' : 'Post created successfully');
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error('Failed to save post');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-start sm:items-center justify-center p-2 sm:p-4 md:p-6">
      <div 
        className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[92vh] sm:max-h-[88vh] my-auto overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
      >
        <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-slate-100 flex justify-between items-center bg-white flex-shrink-0 z-20">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              {post ? 'Edit Post' : 'Create New Post'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Draft and publish content for the pharmacy blog.
            </p>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input 
                label="Post Title" 
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                required 
              />
              <Input 
                label="Category" 
                name="category" 
                value={formData.category} 
                onChange={handleChange} 
              />
              <Input 
                label="Author" 
                name="author" 
                value={formData.author} 
                onChange={handleChange} 
              />
              <Input 
                label="Publish Date" 
                name="date" 
                type="date"
                value={formData.date} 
                onChange={handleChange} 
              />
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Excerpt</label>
                <textarea 
                  name="excerpt" 
                  value={formData.excerpt} 
                  onChange={handleChange} 
                  rows={2} 
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  placeholder="Brief summary shown on the blog listing..."
                />
              </div>
              <div className="md:col-span-2 pt-2 border-t border-slate-100">
                <ProductImageInput
                  value={formData.imageUrl}
                  onChange={(newUrl) => setFormData(prev => ({ ...prev, imageUrl: newUrl }))}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">HTML Content</label>
                <textarea 
                  name="content" 
                  value={formData.content} 
                  onChange={handleChange} 
                  rows={10} 
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-xs leading-relaxed bg-slate-50"
                  required
                  placeholder="<h2>Heading</h2><p>Paragraph content...</p>"
                />
              </div>
            </div>
          </div>

          <div className="px-5 py-3.5 sm:px-6 sm:py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50 flex-shrink-0 z-20">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading} className="gap-2">
              {post ? 'Save Changes' : 'Publish Post'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
