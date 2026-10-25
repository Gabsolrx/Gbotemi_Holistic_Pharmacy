import { Link } from 'react-router-dom';

export default function AccountDashboard() {
  const quickLinks = [
    {
      title: 'My Orders',
      description: 'Track ongoing orders and view previous order receipts.',
      link: '/account/orders',
      actionText: 'View Orders',
    },
    {
      title: 'Wishlist',
      description: 'Saved medicines and wellness items for later purchase.',
      link: '/account/wishlist',
      actionText: 'View Wishlist',
    },
    {
      title: 'Upload Prescription',
      description: 'Fast verification and direct dispensing guidance from our pharmacists.',
      link: '/prescription',
      actionText: 'Upload Doctor Rx',
    },
    {
      title: 'Pharmacist Consultation',
      description: 'Book a confidential clinical consultation or chat with our healthcare team.',
      link: '/consultation',
      actionText: 'Book Session',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Intro banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-900 rounded-2xl p-6 sm:p-8 text-white shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-700/60 text-emerald-200 text-xs font-semibold mb-3 border border-emerald-600/40">
            Certified Holistics & Telepharmacy
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
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-white text-emerald-900 font-bold text-xs sm:text-sm hover:bg-emerald-50 transition-colors shadow-sm touch-manipulation"
            >
              Browse Shop
            </Link>
            <Link
              to="/prescription"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs sm:text-sm transition-colors border border-emerald-500/30 touch-manipulation"
            >
              Upload Prescription
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickLinks.map((card) => (
          <div
            key={card.title}
            className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <span className="inline-block px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
                {card.title}
              </span>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-5">
                {card.description}
              </p>
            </div>
            <div>
              <Link
                to={card.link}
                className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-bold transition-colors touch-manipulation"
              >
                {card.actionText}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
