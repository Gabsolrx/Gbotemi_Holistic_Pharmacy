import React, { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, MessageSquare, Search, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroHeadlineProps {
  className?: string;
}

export function HeroHeadline({ className = '' }: HeroHeadlineProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/shop');
    }
  };

  const trendingCategories = [
    { label: 'Prescription & OTC', query: 'Prescription' },
    { label: 'Vitamins & Immunity', query: 'Vitamin' },
    { label: 'Pain Relief', query: 'Pain' },
    { label: 'Herbal Wellness', query: 'Herbal' }
  ];

  return (
    <div className={`flex flex-col justify-between h-full p-6 sm:p-8 lg:p-10 ${className}`}>
      {/* Top Header Eyebrow & Live Verification */}
      <div>
        <div className="flex items-center justify-between gap-3 flex-wrap mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#087F5B] animate-pulse" />
            <span className="text-[11px] sm:text-xs font-semibold tracking-widest text-[#087F5B] uppercase">
              YOUR HEALTH. OUR PRIORITY.
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#65776D] font-medium">
            <ShieldCheck size={14} className="text-[#087F5B]" />
            <span>PCN Licensed Pharmacy</span>
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[3.25rem] font-bold text-[#17372C] leading-[1.15] tracking-tight font-sans">
          A Better Way to Care for Your Health.
        </h1>

        {/* Supporting Copy */}
        <p className="mt-4 sm:mt-5 text-sm sm:text-base lg:text-lg text-[#65776D] leading-relaxed max-w-xl font-normal">
          Discover trusted healthcare essentials, professional pharmacy services, and everyday wellness, all in one place.
        </p>

        {/* Search Shortcut Bar */}
        <form onSubmit={handleSearchSubmit} className="mt-6 sm:mt-7 max-w-xl relative group">
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search genuine medicines, vitamins, antibiotics..."
              className="w-full pl-11 pr-28 sm:pr-32 py-3.5 sm:py-4 rounded-2xl bg-white/95 border border-[#E6F4EC] text-sm text-[#17372C] placeholder:text-[#65776D]/60 focus:outline-none focus:ring-2 focus:ring-[#087F5B]/30 focus:border-[#087F5B] shadow-xs transition-all duration-200"
            />
            <Search size={18} className="absolute left-4 text-[#65776D] pointer-events-none group-focus-within:text-[#087F5B] transition-colors" />
            <button
              type="submit"
              className="absolute right-2 px-4 py-2 sm:py-2.5 rounded-xl bg-[#087F5B] hover:bg-[#064E3B] text-white text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
            >
              <span>Search</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Quick Search Tags */}
          <div className="mt-2.5 flex items-center gap-2 flex-wrap text-xs text-[#65776D]">
            <span className="text-[11px] font-medium text-[#17372C]/70">Popular:</span>
            {trendingCategories.map((cat, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => navigate(`/shop?q=${encodeURIComponent(cat.query)}`)}
                className="text-[11px] hover:text-[#087F5B] hover:underline transition-colors cursor-pointer"
              >
                {cat.label}
              </button>
            ))}
          </div>
        </form>

        {/* Primary & Secondary Call to Actions */}
        <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 max-w-xl">
          <Link
            to="/shop"
            className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3.5 sm:py-4 rounded-2xl bg-[#087F5B] hover:bg-[#064E3B] text-white font-semibold text-sm sm:text-base shadow-md shadow-emerald-950/15 hover:shadow-lg hover:shadow-emerald-950/25 transition-all duration-200 group active:scale-98"
          >
            <span>Explore Healthcare Products</span>
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            to="/consultation"
            className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3.5 sm:py-4 rounded-2xl bg-[#FAF8F0] hover:bg-white text-[#087F5B] border border-[#087F5B]/30 hover:border-[#087F5B] font-semibold text-sm sm:text-base transition-all duration-200 shadow-2xs active:scale-98"
          >
            <MessageSquare size={17} className="text-[#087F5B]" />
            <span>Speak to a Pharmacist</span>
          </Link>
        </div>
      </div>

      {/* Trust Badges Strip (Editorial Bottom row) */}
      <div className="pt-6 sm:pt-8 mt-6 sm:mt-8 border-t border-[#E6F4EC]/80 flex items-center justify-between gap-4 flex-wrap text-xs text-[#65776D]">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={16} className="text-[#087F5B]" />
          <span className="font-medium text-[#17372C]">100% Authentic Medications</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 size={16} className="text-[#087F5B]" />
          <span className="font-medium text-[#17372C]">Direct Delivery Across Nigeria</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 size={16} className="text-[#087F5B]" />
          <span className="font-medium text-[#17372C]">Direct WhatsApp Care</span>
        </div>
      </div>
    </div>
  );
}
