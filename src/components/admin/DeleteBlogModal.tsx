import React, { useState } from 'react';
import { AlertTriangle, Trash2, X, Loader2, Newspaper } from 'lucide-react';
import { Button } from '../ui/Button';
import { blogService } from '../../services/blogService';
import toast from 'react-hot-toast';

interface DeleteBlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: any;
  onSuccess: () => void;
}

export function DeleteBlogModal({ isOpen, onClose, post, onSuccess }: DeleteBlogModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !post) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await blogService.deletePost(post.id);
      toast.success(`"${post.title}" was deleted successfully`);
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Failed to delete post:', err);
      toast.error('Could not delete post.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
      >
        <button 
          onClick={onClose}
          disabled={isDeleting}
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="p-6 sm:p-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6 ring-8 ring-red-50">
            <AlertTriangle size={32} />
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Blog Post?</h3>
          <p className="text-slate-500 mb-6 max-w-sm">
            Are you sure you want to permanently delete this post? This action cannot be undone.
          </p>

          <div className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 mb-8 text-left flex items-start gap-3">
            <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 overflow-hidden">
               {post.imageUrl ? (
                 <img src={post.imageUrl} alt="" className="w-full h-full object-cover" />
               ) : (
                 <Newspaper size={20} className="text-slate-500" />
               )}
            </div>
            <div>
              <p className="font-semibold text-slate-900 text-sm line-clamp-1">{post.title}</p>
              <p className="text-xs text-slate-500 mt-0.5">Author: {post.author || 'Admin'}</p>
            </div>
          </div>

          <div className="w-full flex flex-col-reverse sm:flex-row gap-3">
            <Button 
              variant="outline" 
              className="w-full sm:flex-1" 
              onClick={onClose}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDelete}
              disabled={isDeleting}
              className="w-full sm:flex-1 bg-red-600 hover:bg-red-700 text-white gap-2 border-red-600 hover:border-red-700 shadow-sm shadow-red-600/20"
            >
              {isDeleting ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Deleting...
                </>
              ) : (
                <>
                  <Trash2 size={18} /> Delete Post
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
