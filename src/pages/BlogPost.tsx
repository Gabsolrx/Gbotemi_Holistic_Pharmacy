import { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Calendar, Clock, User, ArrowLeft } from 'lucide-react';
import { blogService } from '../services/blogService';
import { Badge } from '../components/ui/Badge';
import { format } from 'date-fns';

export default function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      try {
        const data = await blogService.getPostById(id);
        setPost(data);
      } catch (err) {
        console.error('Failed to load post', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (isLoading) {
    return <div className="text-center py-20 text-slate-500">Loading...</div>;
  }

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-slate-50 py-12 md:py-20 border-b border-gray-100">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link to="/blog" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-primary-600 transition-colors mb-8">
            <ArrowLeft size={16} className="mr-2" /> Back to Blog
          </Link>
          
          <div className="mb-6 flex items-center gap-3">
            <Badge variant="info" className="bg-primary-50 text-primary-700 border-primary-200">
              {post.category}
            </Badge>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                <User size={20} />
              </div>
              <span className="font-medium text-gray-900">{post.author}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{format(new Date(post.date), 'MMMM do, yyyy')}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 max-w-4xl py-12">
        {post.imageUrl && (
          <div className="rounded-2xl overflow-hidden mb-12 shadow-sm border border-gray-100">
            <img 
              src={post.imageUrl} 
              alt={post.title} 
              className="w-full h-[400px] object-cover"
            />
          </div>
        )}
        
        {/* We use dangerouslySetInnerHTML here safely because the content is static from our own data file. 
            In a real CMS, we would parse this or use a rich text renderer. */}
        <div 
          className="text-lg leading-relaxed text-gray-700 [&>h2]:text-3xl [&>h2]:font-bold [&>h2]:text-gray-900 [&>h2]:mt-10 [&>h2]:mb-4 [&>h3]:text-2xl [&>h3]:font-bold [&>h3]:text-gray-900 [&>h3]:mt-8 [&>h3]:mb-4 [&>p]:mb-6 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ul>li]:mb-2"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        
        <div className="mt-16 pt-8 border-t border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Share this article</h3>
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-bold text-gray-700 transition-colors">
              Twitter
            </button>
            <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-bold text-gray-700 transition-colors">
              Facebook
            </button>
            <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-bold text-gray-700 transition-colors">
              LinkedIn
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
