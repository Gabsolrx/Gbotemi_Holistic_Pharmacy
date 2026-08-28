const fs = require('fs');
let footer = fs.readFileSync('src/components/layout/Footer.tsx', 'utf8');

// Icons import
footer = footer.replace(
  "import { MapPin, Phone, Mail, Globe, MessageCircle } from 'lucide-react';",
  "import { MapPin, Phone, Mail, Globe, MessageCircle, Facebook, Instagram, Twitter } from 'lucide-react';"
);

// Links
footer = footer.replace(
  '<li><Link to="/services/health-screening" className="hover:text-white hover:underline transition-colors">Health Screening</Link></li>',
  '<li><Link to="/services" className="hover:text-white hover:underline transition-colors">Health Screening</Link></li>'
);

footer = footer.replace(
  '<li><Link to="/shop?category=Personal%20Care" className="hover:text-white hover:underline transition-colors">Personal Care</Link></li>',
  ''
);

// Admin portal link
footer = footer.replace(
  '<li className="pt-2"><Link to="/admin/login" className="text-primary-400 hover:text-white transition-colors text-xs opacity-50 hover:opacity-100">Admin Portal</Link></li>',
  ''
);

// Social icons
footer = footer.replace(
  /FB\s*<\/a>/,
  '<Facebook size={20} /></a>'
);
footer = footer.replace(
  /IG\s*<\/a>/,
  '<Instagram size={20} /></a>'
);
footer = footer.replace(
  /X\s*<\/a>/,
  '<Twitter size={20} /></a>'
);

fs.writeFileSync('src/components/layout/Footer.tsx', footer);
