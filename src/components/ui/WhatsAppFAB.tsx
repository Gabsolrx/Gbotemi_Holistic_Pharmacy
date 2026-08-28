import { MessageCircle } from 'lucide-react';

export function WhatsAppFAB() {
  // Use VITE_WHATSAPP_NUMBER or fallback to a placeholder number (international format without +)
  let whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '2348029660153';
  whatsappNumber = whatsappNumber.replace(/[\s+-]/g, '');
  if (whatsappNumber.startsWith('0')) {
    whatsappNumber = '234' + whatsappNumber.substring(1);
  }
  const defaultMessage = encodeURIComponent("Hello Gbotemi Holistic Pharmacy, I would like to make an inquiry.");

  return (
    <a
      href={`https://wa.me/${whatsappNumber}?text=${defaultMessage}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:bg-[#20bd5a] hover:scale-110 hover:shadow-xl transition-all duration-300 group"
      aria-label="Chat with us on WhatsApp"
    >
      <MessageCircle size={28} />
      
      {/* Tooltip */}
      <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-sm">
        Chat with a Pharmacist
      </span>
      
      {/* Pulse effect */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20"></span>
    </a>
  );
}
