import { Link } from 'react-router-dom';
import { FileText, MessageSquare } from 'lucide-react';
import { Button } from '../ui/Button';

export function HomeCTAs() {
  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Prescription CTA */}
          <div className="bg-primary-800 rounded-3xl overflow-hidden relative shadow-lg group">
            <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-20 transition-opacity">
              <FileText size={160} className="text-white transform rotate-12" />
            </div>
            <div className="relative p-8 md:p-12 z-10 flex flex-col h-full justify-center">
              <Badge>Upload Prescription</Badge>
              <h2 className="text-3xl font-bold text-white mt-4 mb-4">Have a Prescription?</h2>
              <p className="text-primary-100 mb-8 max-w-md text-lg">
                Send your prescription to our pharmacy and let a qualified pharmacist review it and prepare your medications.
              </p>
              <div className="flex flex-wrap gap-4 mt-auto">
                <Link to="/prescription">
                  <Button variant="secondary" size="lg">Upload Now</Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Telepharmacy CTA */}
          <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden relative shadow-sm group">
            <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
              <MessageSquare size={160} className="text-primary-800 transform -rotate-12" />
            </div>
            <div className="relative p-8 md:p-12 z-10 flex flex-col h-full justify-center">
              <Badge variant="success" className="bg-primary-50">Consultation</Badge>
              <h2 className="text-3xl font-bold text-gray-900 mt-4 mb-4">Need Professional Advice?</h2>
              <p className="text-gray-600 mb-8 max-w-md text-lg">
                Speak with a qualified pharmacist from the comfort of your home. Get the right guidance for your health needs.
              </p>
              <div className="flex flex-wrap gap-4 mt-auto">
                <Link to="/consultation">
                  <Button variant="primary" size="lg">Talk to a Pharmacist</Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" size="lg">WhatsApp Us</Button>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// Temporary inline Badge just for this file if not exported properly yet, though we have a UI badge. Let's just use regular HTML for the tag to avoid import issues.
function Badge({ children, variant = 'default', className = '' }: any) {
  const base = "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold w-fit";
  const variants: any = {
    default: "bg-white/20 text-white backdrop-blur-sm",
    success: "bg-primary-100 text-primary-800",
  };
  return <span className={`${base} ${variants[variant]} ${className}`}>{children}</span>;
}
