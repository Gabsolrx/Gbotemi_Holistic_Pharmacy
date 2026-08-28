import { ShieldCheck, CheckCircle2, Lock, Truck } from 'lucide-react';

const INDICATORS = [
  {
    icon: ShieldCheck,
    title: 'Licensed Pharmacy',
    description: 'Verified professional healthcare'
  },
  {
    icon: CheckCircle2,
    title: 'Genuine Products',
    description: '100% authentic medicines'
  },
  {
    icon: Lock,
    title: 'Secure Payments',
    description: 'Safe and encrypted checkout'
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Reliable nationwide shipping'
  }
];

export function TrustIndicators() {
  return (
    <div className="bg-white border-b border-gray-100 py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {INDICATORS.map((indicator, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
                <indicator.icon className="text-primary-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{indicator.title}</h3>
                <p className="text-sm text-gray-500">{indicator.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
