import { Link } from 'react-router-dom';
import { Package, Heart, Upload, PhoneCall, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function AccountDashboard() {
  const { user } = useAuth();

  const quickLinks = [
    {
      title: 'My Orders',
      description: 'Track ongoing orders and view previous order receipts.',
      link: '/account/orders',
      icon: Package,
      actionText: 'View Orders',
      color: 'emerald',
    },
    {
      title: 'Wishlist',
      description: 'Saved medicines and wellness items for later purchase.',
      link: '/account/wishlist',
      icon: Heart,
      actionText: 'View Wishlist',
      color: 'orange',
    },
    {
      title: 'Upload Prescription',
      description: 'Fast verification and direct dispensing guidance from our pharmacists.',
      link: '/prescription',
      icon: Upload,
      actionText: 'Upload Doctor Rx',
      color: 'blue',
    },
    {
      title: 'Pharmacist Consultation',
      description: 'Book a confidential clinical consultation or chat with our healthcare team.',
      link: '/consultation',
      icon: PhoneCall,
      actionText: 'Book Session',
      color: 'teal',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Intro banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-900 rounded-2xl p-6 sm:p-8 text-white shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700/60 text-emerald-200 text-xs font-semibold mb-3 border border-emerald-600/40">
            <ShieldCheck size={14} /> Certified Holistics & Telepharmacy
          </span>
          <h2 className="text-2xl font-bold text-white mb-2">
            Welcome to Your Health Portal
          </h2>
          <p className="text-emerald-100 text-sm leading-relaxed mb-6">
            Manage your prescriptions, track fast deliveries across Nigeria, and stay connected with our licensed pharmacists.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-emerald-900 font-bold text-xs sm:text-sm hover:bg-emerald-50 transition-colors shadow-sm"
            >
              Browse Shop <ArrowRight size={16} />
            </Link>
            <Link
              to="/prescription"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs sm:text-sm transition-colors border border-emerald-500/30"
            >
              Upload Prescription
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickLinks.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                  <Icon size={24} />
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-1">{card.title}</h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-4">
                  {card.description}
                </p>
              </div>
              <Link
                to={card.link}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
              >
                <span>{card.actionText}</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
