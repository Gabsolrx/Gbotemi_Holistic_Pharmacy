import { blogPosts } from '../data/blogData';

const STORAGE_KEY = 'gbotemi-blog-posts-v1';

export function normalizeBlogPost(item: any): any {
  if (!item) return null;
  const id = item.id || `post_${Date.now()}`;
  return {
    ...item,
    id,
    title: item.title || 'Untitled Post',
    excerpt: item.excerpt || '',
    content: item.content || '',
    category: item.category || 'General',
    author: item.author || 'Admin',
    date: item.date || new Date().toISOString().split('T')[0],
    readTime: item.readTime || '5 min read',
    imageUrl: item.imageUrl || 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&q=80&w=800',
  };
}

function getLocalStoredPosts(): any[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(normalizeBlogPost);
      }
    }
  } catch (err) {
    console.warn('Error reading blogs from localStorage:', err);
  }

  // Seed default
  const initial = blogPosts.map(normalizeBlogPost);
  saveToLocalStorage(initial);
  return initial;
}

function saveToLocalStorage(posts: any[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  } catch (err) {
    console.warn('Error saving blogs to localStorage:', err);
  }
}

function notifyBlogUpdate() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('blogs-updated'));
  }
}

export const blogService = {
  getPosts: async (): Promise<any[]> => {
    return getLocalStoredPosts();
  },

  getPostById: async (id: string): Promise<any | null> => {
    const local = getLocalStoredPosts();
    return local.find((p) => p.id === id) || null;
  },

  savePost: async (formData: any): Promise<{ success: boolean; post: any }> => {
    const isEdit = Boolean(formData.id);
    const existingList = getLocalStoredPosts();
    const postId = isEdit ? formData.id : `post_${Date.now()}`;

    const fullPost = normalizeBlogPost({
      ...formData,
      id: postId,
    });

    let updatedList: any[];
    if (isEdit) {
      updatedList = existingList.map((p) => (p.id === postId ? fullPost : p));
    } else {
      updatedList = [fullPost, ...existingList];
    }
    saveToLocalStorage(updatedList);
    notifyBlogUpdate();

    return { success: true, post: fullPost };
  },

  deletePost: async (id: string): Promise<{ success: boolean }> => {
    const list = getLocalStoredPosts();
    const updated = list.filter((p) => p.id !== id);
    saveToLocalStorage(updated);
    notifyBlogUpdate();
    return { success: true };
  }
};
