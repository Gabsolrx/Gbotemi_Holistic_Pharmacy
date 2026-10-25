import React from 'react';
import { Link } from 'react-router-dom';
import { Upload, ArrowRight, ShieldCheck, FileText } from 'lucide-react';

interface PrescriptionAssistanceCardProps {
  className?: string;
}

export function PrescriptionAssistanceCard({ className = '' }: PrescriptionAssistanceCardProps) {
  return (
    <div
      className={`bg-gradient-to-br from-[#064E3B] to-[#033D2E] text-white rounded-2xl p-5 sm:p-6 shadow-sm border border-emerald-800/40 relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow ${className}`}
    >
      {/* Decorative gradient sphere */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#C5E86C]/15 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10">
        <div className="w-10 h-10 rounded-xl bg-white/10 text-emerald-300 flex items-center justify-center mb-3.5 border border-white/15">
          <Upload size={20} />
        </div>
        <div className="flex items-center gap-1.5 mb-1">
          <ShieldCheck size={14} className="text-[#C5E86C]" />
          <span className="text-[10px] uppercase font-bold text-[#C5E86C] tracking-wider">
            Fast Verification
          </span>
        </div>
        <h4 className="text-base sm:text-lg font-bold text-white tracking-tight mb-1.5">
          Digital Prescription Assistance
        </h4>
        <p className="text-xs text-emerald-100/80 leading-relaxed mb-4">
          Snap a photo or upload your doctor's prescription for immediate verification and doorstep delivery dispatch.
        </p>
      </div>

      <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between">
        <span className="text-[11px] text-emerald-200/90 font-medium flex items-center gap-1">
          <FileText size={13} className="text-[#C5E86C]" /> 15-Minute Review
        </span>
        <Link
          to="/prescription"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#C5E86C] hover:bg-[#b5d85c] text-[#033D2E] text-xs font-bold rounded-lg transition-all active:scale-95 shadow-sm"
        >
          <span>Upload Rx</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}

export default PrescriptionAssistanceCard;
