import React, { useState } from 'react';
import { blogService } from '../../services/blogService';
import toast from 'react-hot-toast';

interface DeleteBlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: any | null;
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
      toast.error('Failed to delete blog article');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
      <div 
        className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Article?</h3>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          Are you sure you want to permanently delete <span className="font-semibold text-slate-800">"{post.title}"</span>? This action cannot be undone.
        </p>

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-semibold transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-colors cursor-pointer shadow-sm active:scale-98"
          >
            {isDeleting ? 'Deleting...' : 'Delete Permanently'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteBlogModal;
