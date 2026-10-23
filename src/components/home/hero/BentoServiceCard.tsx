import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Pill, Sparkles, Video, FileText, HeartPulse } from 'lucide-react';

export type BentoCardType = 'medicines' | 'wellness' | 'consultation' | 'prescription';

interface BentoServiceCardProps {
  type: BentoCardType;
  className?: string;
}

export function BentoServiceCard({ type, className = '' }: BentoServiceCardProps) {
  switch (type) {
    case 'medicines':
      return (
        <Link
          to="/shop"
          className={`group relative overflow-hidden rounded-3xl bg-[#064E3B] text-white p-6 sm:p-7 flex flex-col justify-between shadow-lg shadow-emerald-950/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-emerald-800/40 ${className}`}
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-[#087F5B]/30 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
          
          <div className="flex items-center justify-between relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center text-[#C5E86C] shadow-inner group-hover:bg-[#C5E86C] group-hover:text-[#064E3B] transition-colors duration-300">
              <Pill size={24} />
            </div>
            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/80 group-hover:bg-white group-hover:text-[#064E3B] group-hover:rotate-45 transition-all duration-300">
              <ArrowUpRight size={18} />
            </div>
          </div>

          <div className="relative z-10 mt-6 sm:mt-8">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-[#C5E86C] block mb-1">
              Store Catalog
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Healthcare Essentials
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/80 mt-1.5 leading-relaxed">
              Explore available pharmacy products, certified OTC, and essential drugs.
            </p>
          </div>
        </Link>
      );

    case 'wellness':
      return (
        <Link
          to="/categories"
          className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#E6F4EC] to-[#FAF8F0] text-[#17372C] p-6 sm:p-7 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-emerald-100/80 ${className}`}
        >
          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-[#087F5B]/10 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

          <div className="flex items-center justify-between relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-[#087F5B]/10 border border-[#087F5B]/15 flex items-center justify-center text-[#087F5B] group-hover:bg-[#087F5B] group-hover:text-white transition-colors duration-300">
              <Sparkles size={24} />
            </div>
            <div className="w-9 h-9 rounded-full bg-white/80 border border-emerald-200/60 flex items-center justify-center text-[#17372C] group-hover:bg-[#087F5B] group-hover:text-white group-hover:rotate-45 transition-all duration-300">
              <ArrowUpRight size={18} />
            </div>
          </div>

          <div className="relative z-10 mt-6 sm:mt-8">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-[#087F5B] block mb-1">
              Supplements & Care
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-[#17372C] tracking-tight">
              Everyday Wellness
            </h3>
            <p className="text-xs sm:text-sm text-[#65776D] mt-1.5 leading-relaxed">
              Discover personal care, holistic herbal solutions, and daily nutrition.
            </p>
          </div>
        </Link>
      );

    case 'consultation':
      return (
        <Link
          to="/consultation"
          className={`group relative overflow-hidden rounded-3xl bg-white text-[#17372C] p-6 sm:p-7 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-gray-100 hover:border-[#087F5B]/30 ${className}`}
        >
          <div className="flex items-center justify-between relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-[#087F5B]/10 border border-[#087F5B]/20 flex items-center justify-center text-[#087F5B] group-hover:bg-[#087F5B] group-hover:text-white transition-colors duration-300">
              <Video size={24} />
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#087F5B] bg-[#E6F4EC] px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#087F5B] animate-pulse" />
                Pharmacist Online
              </span>
              <div className="w-9 h-9 rounded-full bg-slate-50 border border-gray-200 flex items-center justify-center text-[#17372C] group-hover:bg-[#087F5B] group-hover:text-white group-hover:rotate-45 transition-all duration-300">
                <ArrowUpRight size={18} />
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-6 sm:mt-8">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-[#087F5B] block mb-1">
              Telepharmacy Care
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-[#17372C] tracking-tight">
              Talk to a Pharmacist
            </h3>
            <p className="text-xs sm:text-sm text-[#65776D] mt-1.5 leading-relaxed">
              Get professional guidance on your medicines, dosage, and holistic therapy.
            </p>
          </div>
        </Link>
      );

    case 'prescription':
      return (
        <Link
          to="/prescription"
          className={`group relative overflow-hidden rounded-3xl bg-gradient-to-tr from-[#FAF8F0] to-white text-[#17372C] p-6 sm:p-7 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-[#087F5B]/20 hover:border-[#087F5B]/50 ${className}`}
        >
          <div className="flex items-center justify-between relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-[#087F5B] text-white flex items-center justify-center shadow-md shadow-emerald-950/20 group-hover:bg-[#064E3B] transition-colors duration-300">
              <FileText size={24} />
            </div>
            <div className="w-9 h-9 rounded-full bg-white border border-emerald-200 flex items-center justify-center text-[#17372C] group-hover:bg-[#087F5B] group-hover:text-white group-hover:rotate-45 transition-all duration-300">
              <ArrowUpRight size={18} />
            </div>
          </div>

          <div className="relative z-10 mt-6 sm:mt-8">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-[#087F5B] block mb-1">
              Direct Dispense
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-[#17372C] tracking-tight">
              Prescription Support
            </h3>
            <p className="text-xs sm:text-sm text-[#65776D] mt-1.5 leading-relaxed">
              Upload photos or PDFs of your doctor's prescription for swift verification & dispatch.
            </p>
          </div>
        </Link>
      );
  }
}
