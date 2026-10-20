import { Link } from 'react-router-dom';
import { CATEGORIES } from '../../data/categories';

export function CategoryShowcase() {
  const displayedCategories = CATEGORIES.slice(0, 4);

  return (
    <section className="py-16 bg-slate-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Shop by Category</h2>
            <p className="text-gray-600">Find exactly what you need from our wide selection.</p>
          </div>
          <Link to="/shop" className="hidden sm:inline-flex text-primary-700 font-medium hover:text-primary-800 hover:underline">
            View All Products
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {displayedCategories.map((categoryName) => (
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
        
        <div className="mt-8 text-center">
          <Link 
            to="/shop#categories" 
            className="inline-flex items-center gap-1 text-primary-700 font-semibold hover:text-primary-800 hover:underline transition-colors"
          >
            View All Categories in Shop &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}

