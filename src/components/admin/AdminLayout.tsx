import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  FileText, 
  Users, 
  LogOut, 
  ShieldCheck,
  Home,
  MessageSquare,
  Newspaper,
  LayoutTemplate,
  Menu,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

export function AdminLayout() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile drawer when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

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
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Blog Posts', path: '/admin/blog', icon: Newspaper },
    { name: 'CMS / Site', path: '/admin/cms', icon: LayoutTemplate },
    { name: 'Customers', path: '/admin/customers', icon: Users },
  ];

  return (
    <div className="bg-slate-100 min-h-screen flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <header className="md:hidden bg-slate-900 text-white px-4 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <Link to="/admin" className="flex items-center gap-2 text-white">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
            <ShieldCheck size={20} className="text-white" />
          </div>
          <span className="font-bold text-base tracking-tight">Admin Portal</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link 
            to="/" 
            className="px-2.5 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 rounded-lg flex items-center gap-1.5"
          >
            <Home size={14} /> Storefront
          </Link>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          className="md:hidden fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Sidebar (Desktop pinned, Mobile slide-over drawer) */}
      <aside 
        className={`fixed md:static inset-y-0 left-0 z-50 w-72 md:w-64 bg-slate-900 text-white flex-shrink-0 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 flex-1 overflow-y-auto">
          {/* Brand header on desktop */}
          <div className="hidden md:flex items-center justify-between mb-8">
            <Link to="/" className="flex items-center gap-2.5 text-white">
              <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center shadow-sm">
                <ShieldCheck size={22} className="text-white" />
              </div>
              <div>
                <span className="font-bold text-lg tracking-tight block leading-tight">Admin Portal</span>
                <span className="text-[11px] text-slate-400 font-medium">Pharmacy Operations</span>
              </div>
            </Link>
          </div>

          {/* User info */}
          <div className="mb-6 p-3.5 bg-slate-800/90 border border-slate-700/50 rounded-2xl">
            <div className="text-[11px] text-primary-400 uppercase font-bold tracking-wider mb-1">
              Logged in as Admin
            </div>
            <div className="font-semibold text-sm truncate text-white">
              {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Administrator'}
            </div>
            <div className="text-xs text-slate-400 truncate mt-0.5">{user?.email}</div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.exact}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-primary-600 text-white shadow-sm font-semibold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <item.icon size={18} />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
        
        <div className="p-5 border-t border-slate-800 space-y-2 flex-shrink-0 bg-slate-900/90">
          <Link 
            to="/" 
            className="flex items-center gap-3 px-3.5 py-2.5 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl font-medium text-sm transition-colors"
          >
            <Home size={18} />
            Storefront
          </Link>
          <button 
            type="button"
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl font-medium text-sm transition-colors text-left"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-4 sm:p-6 md:p-8 overflow-x-hidden min-w-0">
        <Outlet />
      </main>
    </div>
  );
}

