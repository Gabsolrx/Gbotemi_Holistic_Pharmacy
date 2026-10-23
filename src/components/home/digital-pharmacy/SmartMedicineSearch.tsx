import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Sparkles, Pill, HeartPulse, Sparkle } from 'lucide-react';

interface SmartMedicineSearchProps {
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  onSearchChange: (query: string) => void;
  searchQuery: string;
}

export function SmartMedicineSearch({
  activeCategory,
  onSelectCategory,
  onSearchChange,
  searchQuery,
}: SmartMedicineSearchProps) {
  const navigate = useNavigate();

  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'Medicines', label: 'Medicines' },
    { id: 'Vitamins & Supplements', label: 'Vitamins & Supplements' },
    { id: 'Personal Care', label: 'Personal Care' },
    { id: 'Wellness', label: 'Wellness' },
  ];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
    } else if (activeCategory !== 'all') {
      navigate(`/shop?category=${encodeURIComponent(activeCategory)}`);
    } else {
      navigate('/shop');
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-emerald-900/10 shadow-sm relative overflow-hidden">
      {/* Subtle emerald corner glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#087F5B]/5 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#087F5B] animate-pulse" />
            <h3 className="text-sm sm:text-base font-bold text-[#17231E]">
              What are you looking for today?
            </h3>
          </div>
          <span className="text-[11px] font-medium text-[#65776D] hidden sm:inline-block">
            Genuine Pharmacy Inventory
          </span>
        </div>

        {/* Search Field */}
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search medicines, wellness products..."
            className="w-full pl-10 pr-24 py-2.5 sm:py-3 bg-[#FAF8F0]/70 border border-emerald-900/15 rounded-xl text-xs sm:text-sm text-[#17231E] placeholder:text-[#65776D]/60 focus:outline-none focus:ring-2 focus:ring-[#087F5B]/30 focus:border-[#087F5B] transition-all"
          />
          <Search size={16} className="absolute left-3.5 text-[#65776D]" />
          <button
            type="submit"
            className="absolute right-1.5 px-3.5 py-1.5 sm:py-2 bg-[#087F5B] hover:bg-[#064E3B] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 shadow-xs cursor-pointer active:scale-95"
          >
            <span>Search</span>
            <ArrowRight size={13} />
          </button>
        </form>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 mt-3 overflow-x-auto scrollbar-none pb-0.5">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#087F5B] text-white shadow-xs'
                    : 'bg-[#FAF8F0] hover:bg-[#DDF5E8] text-[#17231E] border border-emerald-900/10'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
