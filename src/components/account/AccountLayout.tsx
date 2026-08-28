import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { LayoutDashboard, ShoppingBag, FileText, User, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

export function AccountLayout() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Signed out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/account', icon: LayoutDashboard, exact: true },
    { name: 'My Orders', path: '/account/orders', icon: ShoppingBag },
    { name: 'Profile Settings', path: '/account/profile', icon: User },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:sticky md:top-24">
              <div className="w-16 h-16 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xl font-bold mb-4">
                {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </div>
              <h2 className="text-lg font-bold text-gray-900 truncate">
                {user?.firstName ? `${user.firstName} ${user.lastName}` : 'User'}
              </h2>
              <p className="text-sm text-gray-500 truncate mb-6">{user?.email}</p>

              <nav className="space-y-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    end={item.exact}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                        isActive
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`
                    }
                  >
                    <item.icon size={18} />
                    {item.name}
                  </NavLink>
                ))}
                
                <button 
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-2.5 mt-4 text-red-600 hover:bg-red-50 rounded-lg font-medium text-sm transition-colors text-left"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-grow">
            <Outlet />
          </div>

        </div>
      </div>
    </div>
  );
}
