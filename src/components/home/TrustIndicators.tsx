const INDICATORS = [
  {
    title: 'Licensed Pharmacy',
    description: 'Verified professional healthcare'
  },
  {
    title: 'Genuine Products',
    description: '100% authentic medicines'
  },
  {
    title: 'Secure Payments',
    description: 'Safe and encrypted checkout'
  },
  {
    title: 'Fast Delivery',
    description: 'Pay driver or rider directly upon delivery'
  }
];

export function TrustIndicators() {
  return (
    <div className="bg-white border-b border-gray-100 py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {INDICATORS.map((indicator, index) => (
            <div key={index} className="flex flex-col justify-center">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{indicator.title}</h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{indicator.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
