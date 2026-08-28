const fs = require('fs');

let services = fs.readFileSync('src/pages/Services.tsx', 'utf8');

services = services.replace(
  "id: 'chronic-care',\n    title: 'Chronic Disease Management',\n    description: 'Specialized ongoing care programs for managing hypertension, diabetes, and other chronic conditions through medication and lifestyle adjustments.',\n    icon: <HeartPulse size={32} />,\n    color: 'bg-red-50 text-red-600 border-red-100',\n    link: '/contact',",
  "id: 'chronic-care',\n    title: 'Chronic Disease Management',\n    description: 'Specialized ongoing care programs for managing hypertension, diabetes, and other chronic conditions through medication and lifestyle adjustments. Email us at gbotemihpharmacy@gmail.com for more details.',\n    icon: <HeartPulse size={32} />,\n    color: 'bg-red-50 text-red-600 border-red-100',\n    link: 'mailto:gbotemihpharmacy@gmail.com',"
);

// We should also replace the <Link> component to handle mailto correctly (since Link routes locally).
// Let's modify the map to use an <a> tag if link starts with mailto.

const linkBlock = `<Link \n                to={service.link} \n                className="inline-flex items-center font-bold text-primary-600 hover:text-primary-800 transition-colors mt-auto group"\n              >\n                {service.linkText}\n                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />\n              </Link>`;

const newLinkBlock = `{service.link.startsWith('mailto') ? (
              <a 
                href={service.link} 
                className="inline-flex items-center font-bold text-primary-600 hover:text-primary-800 transition-colors mt-auto group"
              >
                {service.linkText}
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            ) : (
              <Link 
                to={service.link} 
                className="inline-flex items-center font-bold text-primary-600 hover:text-primary-800 transition-colors mt-auto group"
              >
                {service.linkText}
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}`;

services = services.replace(linkBlock, newLinkBlock);
fs.writeFileSync('src/pages/Services.tsx', services);
