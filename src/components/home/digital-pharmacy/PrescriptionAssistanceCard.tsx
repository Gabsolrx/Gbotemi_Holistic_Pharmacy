import React from 'react';
import { Link } from 'react-router-dom';
import { FileUp, ArrowRight, ShieldCheck } from 'lucide-react';

interface PrescriptionAssistanceCardProps {
  className?: string;
}

export function PrescriptionAssistanceCard({ className = '' }: PrescriptionAssistanceCardProps) {
  return (
    <div
      className={`bg-gradient-to-br from-[#064E3B] to-[#087F5B] text-white rounded-2xl p-4 sm:p-5 shadow-md shadow-emerald-950/20 border border-emerald-700/40 relative overflow-hidden flex flex-col justify-between ${className}`}
    >
      {/* Background glow & watermark */}
      <div className="absolute -bottom-8 -right-8 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />

      <div className="relative z-10 flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center shrink-0 text-[#DDF5E8] shadow-inner">
          <FileUp size={20} />
        </div>
        <div>
          <span className="text-[10px] uppercase font-semibold text-[#DDF5E8]/80 tracking-wider block">
            Digital Rx Review
          </span>
          <h4 className="text-sm sm:text-base font-bold text-white tracking-tight mt-0.5">
            Need help with a prescription?
          </h4>
          <p className="text-xs text-emerald-100/90 mt-1 leading-relaxed">
            Upload your prescription for pharmacist review and assistance.
          </p>
        </div>
      </div>

      <div className="relative z-10 mt-3 pt-3 border-t border-white/15 flex items-center justify-between">
        <span className="text-[11px] text-[#DDF5E8]/80 font-medium flex items-center gap-1">
          <ShieldCheck size={12} /> Confidential & Secure
        </span>
        <Link
          to="/prescription"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-[#064E3B] hover:bg-[#FAF8F0] text-xs font-bold rounded-lg shadow-xs transition-colors active:scale-95"
        >
          <span>Upload Prescription</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}
