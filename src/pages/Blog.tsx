import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, User, ChevronRight } from 'lucide-react';
import { blogService } from '../services/blogService';
import { Badge } from '../components/ui/Badge';

export default function Blog() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await blogService.getPosts();
        setPosts(data || []);
      } catch (error) {
        console.error('Failed to load posts', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Health & Wellness Blog</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Expert advice, holistic health tips, and the latest medical insights from our licensed pharmacists.
          </p>
        </div>

        {isLoading ? (
          <div className="text-center text-slate-500 py-12">Loading posts...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article key={post.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow group">
                <div className="h-56 overflow-hidden bg-slate-100">
                  {post.imageUrl && (
                    <img 
                      src={post.imageUrl} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge variant="info" className="bg-primary-50 text-primary-700 border-primary-200">
                      {post.category}
                    </Badge>
                    <div className="flex items-center text-xs text-gray-500 gap-1">
                      <Clock size={14} />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  
                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    <Link to={`/blog/${post.id}`} className="hover:text-primary-600 transition-colors">
                      {post.title}
                    </Link>
                  </h2>
                  
                  <p className="text-gray-600 mb-6 line-clamp-3 text-sm flex-grow">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between border-t border-gray-50 pt-4 mt-auto">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                        <User size={16} />
                      </div>
                      <span className="font-medium text-gray-900">{post.author}</span>
                    </div>
                    
                    <Link to={`/blog/${post.id}`} className="flex items-center text-primary-600 text-sm font-bold hover:text-primary-800 transition-colors">
                      Read <ChevronRight size={16} className="ml-1" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
