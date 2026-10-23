import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, ArrowRight, UserCheck, Stethoscope } from 'lucide-react';

interface PharmacistConsultationCardProps {
  className?: string;
}

export function PharmacistConsultationCard({ className = '' }: PharmacistConsultationCardProps) {
  return (
    <div
      className={`bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-emerald-900/10 relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow ${className}`}
    >
      {/* Soft mint accent background blob */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-[#DDF5E8]/60 rounded-full blur-xl pointer-events-none" />

      <div className="relative z-10 flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#DDF5E8] flex items-center justify-center shrink-0 text-[#087F5B] border border-[#087F5B]/15">
          <Stethoscope size={20} />
        </div>
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] uppercase font-bold text-[#087F5B] tracking-wider">
              Licensed Pharmacist Online
            </span>
          </div>
          <h4 className="text-sm sm:text-base font-bold text-[#17231E] tracking-tight">
            Speak with a Pharmacist
          </h4>
          <p className="text-xs text-[#65776D] mt-1 leading-relaxed">
            Get professional guidance for your medicine and wellness questions.
          </p>
        </div>
      </div>

      <div className="relative z-10 mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
        <span className="text-[11px] text-[#65776D] font-medium flex items-center gap-1">
          <UserCheck size={13} className="text-[#087F5B]" /> Telepharmacy & Chat
        </span>
        <Link
          to="/consultation"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF8F0] hover:bg-[#DDF5E8] text-[#064E3B] border border-emerald-900/15 text-xs font-bold rounded-lg transition-all active:scale-95"
        >
          <span>Start Consultation</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}
