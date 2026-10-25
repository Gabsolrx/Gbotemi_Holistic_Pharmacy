import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, ArrowRight, Clock } from 'lucide-react';

interface DeliveryOptionsCardProps {
  className?: string;
}

export function DeliveryOptionsCard({ className = '' }: DeliveryOptionsCardProps) {
  return (
    <div
      className={`bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-emerald-900/10 relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200/50">
          <Truck size={20} />
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-amber-700 tracking-wider block mb-0.5">
            Same-Day Dispatch
          </span>
          <h4 className="text-sm sm:text-base font-bold text-[#17231E] tracking-tight">
            Express Delivery Coverage
          </h4>
          <p className="text-xs text-[#65776D] mt-1 leading-relaxed">
            Same-day courier in Osogbo & Ede; secured interstate waybill across Nigeria.
          </p>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
        <span className="text-[11px] text-[#65776D] font-medium flex items-center gap-1">
          <Clock size={13} className="text-amber-600" /> Pay upon delivery
        </span>
        <Link
          to="/delivery-information"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF8F0] hover:bg-amber-50 text-[#17231E] border border-amber-200/60 text-xs font-bold rounded-lg transition-all active:scale-95"
        >
          <span>Delivery Details</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}

export default DeliveryOptionsCard;
