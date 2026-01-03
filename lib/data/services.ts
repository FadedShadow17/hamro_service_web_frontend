export interface Service {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  category: string;
  icon: string;
  startingPrice?: number;
  duration?: string;
  features: string[];
}

export const services: Service[] = [
  {
    id: '1',
    title: 'Plumbing',
    slug: 'plumbing',
    category: 'repair',
    shortDescription: 'Expert plumbers for repairs, installations, and maintenance',
    longDescription: 'Our certified plumbers provide comprehensive plumbing services including leak repairs, pipe installations, drain cleaning, water heater services, and emergency plumbing solutions. Available 24/7 for urgent issues.',
    icon: '🔧',
    startingPrice: 1500,
    duration: '1-3 hours',
    features: [
      'Leak detection and repair',
      'Pipe installation and replacement',
      'Drain cleaning and unclogging',
      'Water heater installation',
      'Fixture installation',
      'Emergency plumbing services',
      '24/7 availability',
    ],
  },
  {
    id: '2',
    title: 'Electrical',
    slug: 'electrical',
    category: 'repair',
    shortDescription: 'Licensed electricians for all your electrical needs',
    longDescription: 'Professional electrical services by licensed electricians. We handle wiring, circuit installation, electrical panel upgrades, lighting installation, and all electrical repairs. Safety certified and insured.',
    icon: '⚡',
    startingPrice: 2000,
    duration: '2-4 hours',
    features: [
      'Electrical wiring and rewiring',
      'Circuit breaker installation',
      'Lighting installation',
      'Electrical panel upgrades',
      'Outlet and switch installation',
      'Safety inspections',
      'Emergency electrical repairs',
    ],
  },
  {
    id: '3',
    title: 'Cleaning',
    slug: 'cleaning',
    category: 'maintenance',
    shortDescription: 'Professional cleaning services for your home',
    longDescription: 'Comprehensive cleaning services including deep cleaning, regular maintenance cleaning, move-in/move-out cleaning, and specialized cleaning for kitchens and bathrooms. Eco-friendly products available.',
    icon: '🧹',
    startingPrice: 1200,
    duration: '2-5 hours',
    features: [
      'Deep cleaning services',
      'Regular maintenance cleaning',
      'Move-in/move-out cleaning',
      'Kitchen deep cleaning',
      'Bathroom sanitization',
      'Window cleaning',
      'Eco-friendly options available',
    ],
  },
  {
    id: '4',
    title: 'Carpentry',
    slug: 'carpentry',
    category: 'installation',
    shortDescription: 'Skilled carpenters for custom furniture and repairs',
    longDescription: 'Expert carpentry services for custom furniture, cabinet installation, door and window repairs, deck building, and all woodworking needs. Quality craftsmanship guaranteed.',
    icon: '🪚',
    startingPrice: 2500,
    duration: '3-6 hours',
    features: [
      'Custom furniture making',
      'Cabinet installation',
      'Door and window repairs',
      'Deck and patio construction',
      'Wood flooring installation',
      'Shelf and storage solutions',
      'Furniture repair and restoration',
    ],
  },
  {
    id: '5',
    title: 'Painting',
    slug: 'painting',
    category: 'renovation',
    shortDescription: 'Interior and exterior painting services',
    longDescription: 'Professional painting services for both interior and exterior surfaces. We provide color consultation, surface preparation, primer application, and high-quality paint finishes.',
    icon: '🎨',
    startingPrice: 3000,
    duration: '1-3 days',
    features: [
      'Interior painting',
      'Exterior painting',
      'Color consultation',
      'Surface preparation',
      'Primer application',
      'Wallpaper installation',
      'Texture and finish options',
    ],
  },
  {
    id: '6',
    title: 'HVAC',
    slug: 'hvac',
    category: 'repair',
    shortDescription: 'Heating, ventilation, and air conditioning services',
    longDescription: 'Complete HVAC services including installation, repair, maintenance, and air quality solutions. We service all major brands and provide energy-efficient solutions.',
    icon: '❄️',
    startingPrice: 3500,
    duration: '2-5 hours',
    features: [
      'AC installation and repair',
      'Heating system services',
      'Duct cleaning',
      'Air quality improvement',
      'Regular maintenance',
      'Energy efficiency upgrades',
      'Emergency HVAC repairs',
    ],
  },
  {
    id: '7',
    title: 'Appliance Repair',
    slug: 'appliance-repair',
    category: 'repair',
    shortDescription: 'Expert repair for all home appliances',
    longDescription: 'Professional appliance repair services for refrigerators, washing machines, dryers, ovens, dishwashers, and more. Same-day service available for most repairs.',
    icon: '🔌',
    startingPrice: 1800,
    duration: '1-2 hours',
    features: [
      'Refrigerator repair',
      'Washing machine service',
      'Oven and stove repair',
      'Dishwasher maintenance',
      'Microwave repair',
      'Same-day service available',
      'Warranty on repairs',
    ],
  },
  {
    id: '8',
    title: 'Gardening & Landscaping',
    slug: 'gardening',
    category: 'maintenance',
    shortDescription: 'Transform your outdoor space',
    longDescription: 'Complete gardening and landscaping services including lawn care, tree planting, garden design, irrigation installation, and regular maintenance. Create your dream outdoor space.',
    icon: '🌳',
    startingPrice: 2000,
    duration: '2-4 hours',
    features: [
      'Lawn care and maintenance',
      'Garden design and planting',
      'Tree and shrub care',
      'Irrigation system installation',
      'Landscape design',
      'Seasonal cleanup',
      'Organic gardening options',
    ],
  },
];

export const categories = [
  { value: 'all', label: 'All Services' },
  { value: 'repair', label: 'Repairs' },
  { value: 'installation', label: 'Installation' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'renovation', label: 'Renovation' },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}

export function getServicesByCategory(category: string): Service[] {
  if (category === 'all') return services;
  return services.filter((service) => service.category === category);
}

