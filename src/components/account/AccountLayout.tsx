import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

export function AccountLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  const navItems = [
    { to: '/account', end: true, label: 'Dashboard' },
    { to: '/account/orders', end: false, label: 'My Orders' },
    { to: '/account/wishlist', end: false, label: 'Wishlist' },
    { to: '/account/profile', end: false, label: 'Profile Details' },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Greeting */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 mb-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xl border border-emerald-100 shadow-2xs">
              {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Welcome back, {user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Customer'}!
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">
                {user?.email}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 text-xs sm:text-sm font-semibold transition-all cursor-pointer self-start sm:self-auto touch-manipulation"
          >
            Sign Out
          </button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Nav */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-3 sm:p-4 shadow-sm space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all touch-manipulation ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-800 font-bold shadow-2xs'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          </aside>

          {/* Main Outlet Area */}
          <main className="lg:col-span-3">
            <Outlet />
          </main>
        </div>

      </div>
    </div>
  );
}

export default AccountLayout;
