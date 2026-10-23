import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, ArrowRight, MapPin, Clock } from 'lucide-react';

interface DeliveryOptionsCardProps {
  className?: string;
}

export function DeliveryOptionsCard({ className = '' }: DeliveryOptionsCardProps) {
  return (
    <div
      className={`bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-emerald-900/10 relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow ${className}`}
    >
      <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-[#FAF8F0] rounded-full blur-xl pointer-events-none" />

      <div className="relative z-10 flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#FAF8F0] flex items-center justify-center shrink-0 text-[#087F5B] border border-emerald-900/10">
          <Truck size={20} />
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-[#65776D] tracking-wider block">
            Express Care Logistics
          </span>
          <h4 className="text-sm sm:text-base font-bold text-[#17231E] tracking-tight mt-0.5">
            Healthcare, made convenient
          </h4>
          <p className="text-xs text-[#65776D] mt-1 leading-relaxed">
            Explore ordering and delivery options available in your area.
          </p>
        </div>
      </div>

      <div className="relative z-10 mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
        <span className="text-[11px] text-[#65776D] font-medium flex items-center gap-1">
          <Clock size={13} className="text-[#087F5B]" /> Same-day & Dispatch
        </span>
        <Link
          to="/delivery-information"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF8F0] hover:bg-[#DDF5E8] text-[#064E3B] border border-emerald-900/15 text-xs font-bold rounded-lg transition-all active:scale-95"
        >
          <span>View Delivery Options</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}
