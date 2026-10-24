import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';
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

  const supportPhone = cmsConfig?.storeSettings?.supportPhone || '08029660153';
  const cleanPhone = supportPhone.replace(/[\s+-]/g, '');
  const supportEmail = cmsConfig?.storeSettings?.supportEmail || 'gbotemihpharmacy@gmail.com';

  return (
    <footer className="bg-primary-900 text-primary-50 pt-16 pb-8 border-t-4 border-accent-orange font-sans">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1: About & Contact */}
          <div>
            <Link to="/" className="inline-block mb-6 bg-white p-2 rounded-lg">
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
              <li><Link to="/shop?category=Analgesics" className="hover:text-white hover:underline transition-colors">Analgesics</Link></li>
              <li><Link to="/shop?category=Anti-infectives" className="hover:text-white hover:underline transition-colors">Anti-infectives</Link></li>
              <li><Link to="/shop?category=Supplements" className="hover:text-white hover:underline transition-colors">Supplements</Link></li>
              <li><Link to="/shop?category=Fertility%20%26%20Reproductive%20Health" className="hover:text-white hover:underline transition-colors">Reproductive Health</Link></li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white uppercase tracking-wider">Services</h3>
            <ul className="space-y-3 text-sm text-primary-100">
              <li><Link to="/consultation" className="hover:text-white hover:underline transition-colors">Talk to a Pharmacist</Link></li>
              <li><Link to="/prescription" className="hover:text-white hover:underline transition-colors">Prescription Assistance</Link></li>
              <li><Link to="/services" className="hover:text-white hover:underline transition-colors">Pharmacy Services</Link></li>
              <li><Link to="/services" className="hover:text-white hover:underline transition-colors">Health Screening</Link></li>
              <li><Link to="/health-tools" className="hover:text-white hover:underline transition-colors">Health Calculators</Link></li>
            </ul>
          </div>

          {/* Column 4: Information */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white uppercase tracking-wider">Information</h3>
            <ul className="space-y-3 text-sm text-primary-100">
              <li><Link to="/about" className="hover:text-white hover:underline transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white hover:underline transition-colors">Contact Us</Link></li>
              <li><Link to="/delivery-information" className="hover:text-white hover:underline transition-colors">Delivery Information</Link></li>
              <li><Link to="/payment-information" className="hover:text-white hover:underline transition-colors">Payment Information</Link></li>
              <li><Link to="/faq" className="hover:text-white hover:underline transition-colors">FAQs</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-white hover:underline transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white hover:underline transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/refund-policy" className="hover:text-white hover:underline transition-colors font-semibold text-emerald-200">Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Newsletter & Bottom */}
        <div className="border-t border-primary-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-sm text-primary-200 text-center md:text-left">
            &copy; 2026 Gbotemi Holistic Pharmacy. All Right Reserved. GabsolTeck
          </div>
          
          <div className="flex items-center gap-3">
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
            <a 
              href={`https://wa.me/${cleanPhone.startsWith('0') ? '234' + cleanPhone.substring(1) : cleanPhone || '2348029660153'}?text=Hello%20Gbotemi%20Holistic%20Pharmacy`}
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="WhatsApp"
              className="w-10 h-10 rounded-full bg-primary-800 flex items-center justify-center hover:bg-[#25D366] transition-colors text-white text-sm font-bold cursor-pointer"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
