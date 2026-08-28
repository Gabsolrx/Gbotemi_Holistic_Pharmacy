import { Link } from 'react-router-dom';
import { Pill, Activity, HeartPulse, Stethoscope, Sparkles } from 'lucide-react';
import { CATEGORIES } from '../../data/categories';

const getCategoryIcon = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes('device') || lower.includes('machine')) return Activity;
  if (lower.includes('supplement') || lower.includes('vitamin')) return HeartPulse;
  if (lower.includes('care') || lower.includes('topical')) return Sparkles;
  if (lower.includes('health')) return Stethoscope;
  return Pill;
};

export function CategoryShowcase() {
  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Shop by Category</h2>
            <p className="text-gray-600">Find exactly what you need from our wide selection.</p>
          </div>
          <Link to="/shop" className="hidden sm:inline-flex text-primary-700 font-medium hover:text-primary-800 hover:underline">
            View All Products
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {CATEGORIES.map((categoryName) => {
            const Icon = getCategoryIcon(categoryName);
            return (
              <Link 
                key={categoryName}
                to={`/shop?category=${encodeURIComponent(categoryName)}`}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary-100 transition-all group flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary-100 transition-all duration-300">
                  <Icon className="text-primary-600" size={28} />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm group-hover:text-primary-700 transition-colors">
                  {categoryName}
                </h3>
              </Link>
            );
          })}
        </div>
        
        <div className="mt-8 text-center">
          <Link to="/shop" className="inline-flex text-primary-700 font-medium hover:text-primary-800">
            View All Categories in Shop &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
