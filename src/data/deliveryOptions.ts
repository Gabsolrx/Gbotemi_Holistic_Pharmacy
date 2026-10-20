export interface DeliveryOption {
  id: string;
  name: string;
  area: string;
  timeframe: string;
  category: 'osun' | 'interstate';
  badge: string;
  description: string;
  paymentTerms: string;
}

export const DELIVERY_OPTIONS: DeliveryOption[] = [
  // OSUN STATE DELIVERIES
  {
    id: 'osun_intracity',
    name: 'Intra-City Express Rider (Osogbo, Ede & Environs)',
    area: 'Osogbo, Ede, and immediate environs',
    timeframe: 'Same-Day Delivery (1 - 4 Hours)',
    category: 'osun',
    badge: 'Express Doorstep',
    description: 'Fast doorstep delivery for your drug via pharmacy dispatch rider.',
    paymentTerms: 'Pay driver or rider directly upon delivery',
  },
  {
    id: 'osun_intertown',
    name: 'Inter-Town Osun State Dispatch (Ife, Ilesa, Ikirun, etc.)',
    area: 'Ile-Ife, Ilesa, Ikirun, Ejigbo, and other Osun towns',
    timeframe: 'Same-Day or Next-Day Arrival',
    category: 'osun',
    badge: 'Osun Intra-State',
    description: 'Direct transit dispatch for your drug across Osun State towns.',
    paymentTerms: 'Pay driver or rider directly upon delivery',
  },
  {
    id: 'osun_pickup',
    name: 'In-Store Counter Pickup (Gbotemi Holistic Pharmacy)',
    area: 'Gbotemi Holistic Pharmacy counter, Osun State',
    timeframe: 'Ready in 1 - 2 Hours',
    category: 'osun',
    badge: 'Store Pickup',
    description: 'Pick up your drug directly in-store. Bring your order confirmation reference.',
    paymentTerms: 'Free In-Store Collection (₦0)',
  },

  // INTERSTATE DELIVERIES (OUTSIDE OSUN STATE)
  {
    id: 'interstate_park',
    name: 'Commercial Motor Park Waybill (Fast Transit)',
    area: 'Lagos, Ibadan/Oyo, Ogun, Ondo, Ekiti, Kwara, Abuja (FCT), Edo, Port Harcourt & Nationwide',
    timeframe: '24 - 48 Hours',
    category: 'interstate',
    badge: 'Fastest Interstate',
    description: 'Express interstate waybill for your drug via commercial transit bus to your city central motor park.',
    paymentTerms: 'Pay driver or rider directly upon delivery',
  },
  {
    id: 'interstate_doorstep',
    name: 'Interstate Doorstep Courier Service (Nationwide)',
    area: 'All 36 States & FCT (Home or Office Delivery)',
    timeframe: '3 - 5 Business Days',
    category: 'interstate',
    badge: 'Door-to-Door Courier',
    description: 'Direct doorstep delivery for your drug via national courier service.',
    paymentTerms: 'Pay driver or rider directly upon delivery',
  },
];
