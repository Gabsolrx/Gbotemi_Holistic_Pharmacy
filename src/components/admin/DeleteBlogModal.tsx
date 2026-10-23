import React, { useState } from 'react';
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
      <div 
        className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
      >
        <button 
          onClick={onClose}
          disabled={isDeleting}
          className="absolute right-4 top-4 px-2.5 py-1 text-sm font-bold text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
        >
          ✕
        </button>

        <div className="p-6 sm:p-8 flex flex-col items-center text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-red-700 bg-red-50 px-2.5 py-1 rounded-md mb-3">
            Delete Post
          </span>

          <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Blog Post?</h3>
          <p className="text-slate-500 mb-6 max-w-sm text-sm">
            Are you sure you want to permanently delete this post? This action cannot be undone.
          </p>

          <div className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 mb-8 text-left flex items-start gap-3">
            <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 overflow-hidden">
               {post.imageUrl ? (
                 <img src={post.imageUrl} alt="" className="w-full h-full object-cover" />
               ) : (
                 <span className="text-[10px] text-slate-400 font-bold">BLOG</span>
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
              isLoading={isDeleting}
              className="w-full sm:flex-1 bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700 shadow-sm"
            >
              Delete Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
