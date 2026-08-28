import { useState, useEffect } from 'react';
import { Newspaper, Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { blogService } from '../../services/blogService';
import { BlogFormModal } from '../../components/admin/BlogFormModal';
import { DeleteBlogModal } from '../../components/admin/DeleteBlogModal';

export default function AdminBlog() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const data = await blogService.getPosts();
      setPosts(data || []);
    } catch (error) {
      console.error('Failed to load posts', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    window.addEventListener('blogs-updated', fetchPosts);
    return () => {
      window.removeEventListener('blogs-updated', fetchPosts);
    };
  }, []);

  const handleAdd = () => {
    setSelectedPost(null);
    setIsFormOpen(true);
  };

  const handleEdit = (post: any) => {
    setSelectedPost(post);
    setIsFormOpen(true);
  };

  const handleDelete = (post: any) => {
    setSelectedPost(post);
    setIsDeleteOpen(true);
  };

  const filteredPosts = posts.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Blog Management</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage posts, categories, and educational content.</p>
        </div>
        <Button className="gap-2 self-start sm:self-auto shadow-sm" onClick={handleAdd}>
          <Plus size={18} /> New Post
        </Button>
      </div>
      
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between gap-4 bg-slate-50/50">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search posts by title or category..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white shadow-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Post</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Author</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    Loading posts...
                  </td>
                </tr>
              ) : filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <Newspaper className="mx-auto text-slate-300 mb-2" size={32} />
                    <p className="font-medium text-slate-700">No posts found</p>
                    <p className="text-sm mt-1 text-slate-500">Create your first blog post to get started.</p>
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {post.imageUrl ? (
                            <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                          ) : (
                            <Newspaper size={20} className="text-slate-400" />
                          )}
                        </div>
                        <div className="max-w-[250px] truncate">
                          <p className="font-bold text-slate-900 truncate" title={post.title}>{post.title}</p>
                          <p className="text-xs text-slate-500 truncate mt-0.5">{post.excerpt}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">
                      {post.author}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {post.date}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(post)}
                          className="p-2 text-slate-400 hover:text-primary-600 transition-colors rounded-xl hover:bg-primary-50" 
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(post)}
                          className="p-2 text-slate-400 hover:text-red-600 transition-colors rounded-xl hover:bg-red-50" 
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <BlogFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        post={selectedPost}
        onSuccess={fetchPosts}
      />
      
      <DeleteBlogModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        post={selectedPost}
        onSuccess={fetchPosts}
      />
    </div>
  );
}
