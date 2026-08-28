import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Heart, Menu, Phone, Mail, ShieldCheck, X } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { cmsService, CmsConfig } from '../../services/cmsService';


export default function Header() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const cartItemsCount = useCart(state => state.getTotalItems());
  const { user } = useAuth();
  const location = useLocation();

  const [cmsConfig, setCmsConfig] = useState<CmsConfig | null>(null);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const fetchConfig = async () => {
      const data = await cmsService.getConfig();
      setCmsConfig(data);
    };
    fetchConfig();
    window.addEventListener('cms-updated', fetchConfig);
    return () => {
      window.removeEventListener('cms-updated', fetchConfig);
    };
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Categories', path: '/categories' },
    { name: 'Prescription', path: '/prescription', highlight: true },
    { name: 'Consultation', path: '/consultation' },
    { name: 'Services', path: '/services' },
    { name: 'Health Tools', path: '/health-tools' },
    { name: 'Blog', path: '/blog' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Announcement Bar */}
      {(!cmsConfig || cmsConfig.storeSettings.announcementEnabled) && (
        <div className="bg-primary-800 text-white text-xs sm:text-sm py-2 px-4">
          <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
            <p className="font-medium text-center sm:text-left">
              {cmsConfig?.storeSettings.announcementBar || 'Welcome to Gbotemi Holistic Pharmacy Online Store - We are here to help with your health needs'}
            </p>
            <div className="flex items-center gap-4 text-primary-100 hidden md:flex">
              <span className="flex items-center gap-1"><Phone size={14} /> {cmsConfig?.storeSettings.supportPhone || '08029660153'}</span>
              <span className="flex items-center gap-1"><Mail size={14} /> {cmsConfig?.storeSettings.supportEmail || 'gbotemihpharmacy@gmail.com'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-6">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0" onClick={() => setIsMobileMenuOpen(false)}>
            <img 
              src="https://i.ibb.co/zTFJJDTK/file-00000000b0e481f4b6ccab5978b7caec.png" 
              alt="Gbotemi Holistic Pharmacy" 
              className="h-10 sm:h-12 md:h-16 object-contain"
            />
          </Link>

          {/* Search Bar (Desktop) */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-grow max-w-2xl relative">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search medicines, vitamins, and healthcare products..." 
              className="w-full pl-4 pr-12 py-3 rounded-full border border-gray-200 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
            />
            <button type="submit" className="absolute right-1 top-1 bottom-1 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-full transition-colors flex items-center justify-center">
              <Search size={20} />
            </button>
          </form>

          {/* Action Icons */}
          <div className="flex items-center gap-4 sm:gap-6 text-gray-700">
            {(user?.role === 'admin' || user?.role === 'super_admin') && (
              <Link to="/admin" className="hidden sm:flex flex-col items-center text-primary-600 hover:text-primary-800 transition-colors">
                <ShieldCheck size={24} />
                <span className="text-xs mt-1 font-bold">Admin</span>
              </Link>
            )}
            <Link to="/account/wishlist" className="hidden sm:flex flex-col items-center hover:text-primary-700 transition-colors relative">
              <Heart size={24} />
              <span className="absolute -top-1 -right-1 bg-accent-orange text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">0</span>
              <span className="text-xs mt-1 font-medium">Wishlist</span>
            </Link>
            <Link to="/cart" className="flex flex-col items-center hover:text-primary-700 transition-colors relative">
              <ShoppingCart size={24} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-primary-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cartItemsCount > 99 ? '99+' : cartItemsCount}
                </span>
              )}
              <span className="text-xs mt-1 font-medium hidden sm:block">Cart</span>
            </Link>
            <Link to="/account" className="flex flex-col items-center hover:text-primary-700 transition-colors">
              <User size={24} />
              <span className="text-xs mt-1 font-medium hidden sm:block">Account</span>
            </Link>
            
            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden flex items-center text-gray-700 p-1 rounded-md hover:bg-gray-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Search Bar (Mobile) */}
        <form onSubmit={handleSearch} className="mt-4 md:hidden relative">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..." 
            className="w-full pl-4 pr-12 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          />
          <button type="submit" className="absolute right-0 top-0 bottom-0 px-4 text-primary-700 flex items-center justify-center">
            <Search size={20} />
          </button>
        </form>
      </div>

      {/* Desktop Navigation */}
      <nav className="border-t border-gray-100 hidden md:block bg-white">
        <div className="container mx-auto px-4">
          <ul className="flex items-center gap-8 py-3 text-sm font-medium text-gray-700">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link 
                  to={link.path} 
                  className={`transition-colors ${link.highlight ? 'text-primary-700 hover:text-primary-800 font-bold' : 'hover:text-primary-600'}`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full left-0 shadow-lg">
          <nav className="container mx-auto px-4 py-4 max-h-[70vh] overflow-y-auto">
            <ul className="flex flex-col space-y-4 text-base font-medium text-gray-800">
              {navLinks.map((link) => (
                <li key={link.path} className="border-b border-gray-50 pb-3">
                  <Link 
                    to={link.path} 
                    className={`block w-full ${link.highlight ? 'text-primary-700 font-bold' : 'hover:text-primary-600'}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              
              <li className="pt-2 flex flex-col space-y-4">
                <Link 
                  to="/account" 
                  className="flex items-center gap-3 text-gray-700 hover:text-primary-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User size={20} />
                  <span>My Account</span>
                </Link>
                <Link 
                  to="/account/wishlist" 
                  className="flex items-center gap-3 text-gray-700 hover:text-primary-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Heart size={20} />
                  <span>Wishlist</span>
                </Link>
                {(user?.role === 'admin' || user?.role === 'super_admin') && (
                  <Link 
                    to="/admin" 
                    className="flex items-center gap-3 text-primary-600 hover:text-primary-800"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <ShieldCheck size={20} />
                    <span>Admin Dashboard</span>
                  </Link>
                )}
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
