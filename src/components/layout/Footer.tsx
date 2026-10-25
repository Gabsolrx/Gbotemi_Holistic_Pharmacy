import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, ArrowUp } from 'lucide-react';
import { cmsService, CmsConfig } from '../../services/cmsService';

export default function Footer() {
  const [cmsConfig, setCmsConfig] = useState<CmsConfig | null>(null);

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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
    }
    if (document.body) {
      document.body.scrollTop = 0;
    }
  };

  const smoothScrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  };

  const supportPhone = cmsConfig?.storeSettings?.supportPhone || '08029660153';
  const cleanPhone = supportPhone.replace(/[\s+-]/g, '');
  const supportEmail = cmsConfig?.storeSettings?.supportEmail || 'gbotemihpharmacy@gmail.com';

  return (
    <footer className="bg-primary-900 text-primary-50 pt-16 pb-8 border-t-4 border-accent-orange font-sans">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1: About & Contact */}
          <div>
            <Link to="/" onClick={scrollToTop} className="inline-block mb-6 bg-white p-2 rounded-lg hover:opacity-95 transition-opacity">
              <img 
                src="https://i.ibb.co/zTFJJDTK/file-00000000b0e481f4b6ccab5978b7caec.png" 
                alt="Gbotemi Holistic Pharmacy" 
                className="h-10 object-contain"
              />
            </Link>
            <p className="text-primary-100 text-sm mb-6 leading-relaxed">
              Your trusted partner for genuine medicines, professional healthcare guidance, and convenient online pharmacy services in Nigeria.
            </p>
            <div className="space-y-3 text-sm">
              <p className="flex items-start gap-3">
                <MapPin size={18} className="flex-shrink-0 mt-0.5 text-accent-mustard" />
                <span>No 59, Lokore Junction, Ifewara Road, Ile Ife, Osun State, Nigeria</span>
              </p>
              <p className="flex items-center gap-3">
                <Phone size={18} className="flex-shrink-0 text-accent-mustard" />
                <a href={`tel:${cleanPhone || '08029660153'}`} className="hover:text-white hover:underline transition-colors">
                  {supportPhone}
                </a>
              </p>
              <p className="flex items-center gap-3">
                <Mail size={18} className="flex-shrink-0 text-accent-mustard" />
                <a href={`mailto:${supportEmail}`} className="hover:text-white hover:underline transition-colors">
                  {supportEmail}
                </a>
              </p>
            </div>
          </div>

          {/* Column 2: Shop & Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white uppercase tracking-wider">Shop</h3>
            <ul className="space-y-3 text-sm text-primary-100">
              <li><Link to="/shop?category=Analgesics" onClick={scrollToTop} className="hover:text-white hover:underline transition-colors block py-0.5">Analgesics</Link></li>
              <li><Link to="/shop?category=Anti-infectives" onClick={scrollToTop} className="hover:text-white hover:underline transition-colors block py-0.5">Anti-infectives</Link></li>
              <li><Link to="/shop?category=Supplements" onClick={scrollToTop} className="hover:text-white hover:underline transition-colors block py-0.5">Supplements</Link></li>
              <li><Link to="/shop?category=Fertility%20%26%20Reproductive%20Health" onClick={scrollToTop} className="hover:text-white hover:underline transition-colors block py-0.5">Reproductive Health</Link></li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white uppercase tracking-wider">Services</h3>
            <ul className="space-y-3 text-sm text-primary-100">
              <li><Link to="/consultation" onClick={scrollToTop} className="hover:text-white hover:underline transition-colors block py-0.5">Talk to a Pharmacist</Link></li>
              <li><Link to="/prescription" onClick={scrollToTop} className="hover:text-white hover:underline transition-colors block py-0.5">Prescription Assistance</Link></li>
              <li><Link to="/services" onClick={scrollToTop} className="hover:text-white hover:underline transition-colors block py-0.5">Pharmacy Services</Link></li>
              <li><Link to="/services" onClick={scrollToTop} className="hover:text-white hover:underline transition-colors block py-0.5">Health Screening</Link></li>
              <li><Link to="/health-tools" onClick={scrollToTop} className="hover:text-white hover:underline transition-colors block py-0.5">Health Calculators</Link></li>
            </ul>
          </div>

          {/* Column 4: Information */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white uppercase tracking-wider">Information</h3>
            <ul className="space-y-3 text-sm text-primary-100">
              <li><Link to="/about" onClick={scrollToTop} className="hover:text-white hover:underline transition-colors block py-0.5">About Us</Link></li>
              <li><Link to="/contact" onClick={scrollToTop} className="hover:text-white hover:underline transition-colors block py-0.5">Contact Us</Link></li>
              <li><Link to="/delivery-information" onClick={scrollToTop} className="hover:text-white hover:underline transition-colors block py-0.5">Delivery Information</Link></li>
              <li><Link to="/payment-information" onClick={scrollToTop} className="hover:text-white hover:underline transition-colors block py-0.5">Payment Information</Link></li>
              <li><Link to="/faq" onClick={scrollToTop} className="hover:text-white hover:underline transition-colors block py-0.5">FAQs</Link></li>
              <li><Link to="/privacy-policy" onClick={scrollToTop} className="hover:text-white hover:underline transition-colors block py-0.5">Privacy Policy</Link></li>
              <li><Link to="/terms" onClick={scrollToTop} className="hover:text-white hover:underline transition-colors block py-0.5">Terms & Conditions</Link></li>
              <li><Link to="/refund-policy" onClick={scrollToTop} className="hover:text-white hover:underline transition-colors font-semibold text-emerald-200 block py-0.5">Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Newsletter & Bottom */}
        <div className="border-t border-primary-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-sm text-primary-200 text-center md:text-left">
            &copy; 2026 Gbotemi Holistic Pharmacy. All Right Reserved. GabsolTeck
          </div>
          
          <div className="flex items-center gap-4">
            {/* Direct Jump to Top Button */}
            <button
              type="button"
              onClick={smoothScrollToTop}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-800 hover:bg-primary-700 text-primary-100 hover:text-white border border-primary-700 text-xs font-semibold transition-all cursor-pointer shadow-sm active:scale-95"
              title="Scroll directly to top of page"
            >
              <ArrowUp size={15} className="text-accent-mustard" />
              <span>Back to Top</span>
            </button>

            <div className="flex items-center gap-2.5">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Facebook"
                className="w-10 h-10 rounded-full bg-primary-800 flex items-center justify-center hover:bg-primary-700 transition-colors text-white text-sm font-bold cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Instagram"
                className="w-10 h-10 rounded-full bg-primary-800 flex items-center justify-center hover:bg-primary-700 transition-colors text-white text-sm font-bold cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="X (Twitter)"
                className="w-10 h-10 rounded-full bg-primary-800 flex items-center justify-center hover:bg-primary-700 transition-colors text-white text-sm font-bold cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
            </div>
        </div>
      </div>
    </div>
  </footer>
  );
}
