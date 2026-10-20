import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import { CATEGORIES } from '../data/categories';

export default function Categories() {
  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="container mx-auto px-4">
        {/* Navigation back to Home */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary-700 bg-white px-4 py-2 rounded-xl border border-gray-200/80 shadow-xs hover:border-primary-300 hover:shadow-sm transition-all"
          >
            <ArrowLeft size={16} />
            <span>Back to Homepage</span>
          </Link>
          <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
            <Link to="/" className="hover:text-primary-600 flex items-center gap-1">
              <Home size={13} />
              <span>Home</span>
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Shop by Category</span>
          </div>
        </div>

        <div className="text-center max-w-2xl mx-auto mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shop by Category</h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Explore our comprehensive range of medications, wellness products, and healthcare supplies.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 sm:gap-6">
          {CATEGORIES.map((categoryName) => (
            <Link 
              key={categoryName}
              to={`/shop?category=${encodeURIComponent(categoryName)}`}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary-200 hover:bg-primary-50/40 transition-all group flex items-center justify-center text-center min-h-[5.5rem]"
            >
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base group-hover:text-primary-700 transition-colors">
                {categoryName}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
