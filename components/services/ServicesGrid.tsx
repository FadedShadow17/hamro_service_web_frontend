'use client';

import { useState } from 'react';
import { Service } from '@/lib/api/services.api';
import { BookingModal } from './BookingModal';
import { ServiceDetailsModal } from './ServiceDetailsModal';
import { useToastContext } from '@/providers/ToastProvider';
import { HttpError } from '@/lib/api/http';
import { getServiceIcon } from './serviceIcons';

interface ServicesGridProps {
  services: Service[];
}

// Map service names to cool, descriptive taglines
const getServiceTagline = (serviceName: string): string => {
  const taglines: Record<string, string> = {
    'Appliance Repair': 'Fix it fast, fix it right',
    'Carpentry': 'Crafting your vision into reality',
    'Cleaning': 'Sparkling clean, every time',
    'Electrical': 'Power up your home safely',
    'Gardening': 'Transform your outdoor space',
    'HVAC': 'Perfect climate, perfect comfort',
    'Painting': 'Bring color to your world',
    'Pest Control': 'Protect your home, protect your family',
    'Plumbing': 'Flowing solutions for your home',
    'Water Tank Cleaning': 'Pure water, healthy living',
    'Roofing': 'Shelter that stands the test of time',
    'Flooring': 'Step into elegance',
    'Tiling': 'Beautiful surfaces, lasting quality',
    'Welding': 'Strong connections, strong results',
    'Locksmith': 'Security you can trust',
    'Moving': 'Your journey, our care',
    'Interior Design': 'Design your dream space',
    'Landscaping': 'Nature meets design',
  };

  // Try exact match first
  if (taglines[serviceName]) {
    return taglines[serviceName];
  }

  // Try case-insensitive match
  const lowerName = serviceName.toLowerCase();
  for (const [key, value] of Object.entries(taglines)) {
    if (key.toLowerCase() === lowerName) {
      return value;
    }
  }

  // Default tagline based on service name pattern
  if (lowerName.includes('repair') || lowerName.includes('fix')) {
    return 'Expert solutions for your needs';
  }
  if (lowerName.includes('clean')) {
    return 'Professional care for your space';
  }
  if (lowerName.includes('electrical') || lowerName.includes('electric')) {
    return 'Powering your home safely';
  }
  if (lowerName.includes('paint')) {
    return 'Color your world beautifully';
  }
  if (lowerName.includes('garden') || lowerName.includes('landscape')) {
    return 'Nature perfected by design';
  }

  // Generic fallback
  return 'Professional service, exceptional results';
};

export function ServicesGrid({ services }: ServicesGridProps) {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const toast = useToastContext();

  const handleBookService = (service: Service) => {
    setSelectedService(service);
    setIsBookingModalOpen(true);
  };

  const handleShowDetails = (service: Service) => {
    setSelectedService(service);
    setIsDetailsModalOpen(true);
  };

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedService(null);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedService(null);
  };

  const handleBookFromDetails = () => {
    setIsDetailsModalOpen(false);
    setIsBookingModalOpen(true);
  };

  const handleConfirmBooking = async (bookingData: {
    serviceId: string;
    providerId?: string;
    date: string;
    time: string;
    area: string;
  }) => {
    try {
      const { createBooking } = await import('@/lib/api/bookings.api');
      const bookingPayload: any = {
        serviceId: bookingData.serviceId,
        date: bookingData.date,
        timeSlot: bookingData.time,
        area: bookingData.area,
      };
      // Only include providerId if it's not empty
      if (bookingData.providerId && bookingData.providerId.trim() !== '') {
        bookingPayload.providerId = bookingData.providerId;
      }
      await createBooking(bookingPayload);
      handleCloseBookingModal();
      toast.success('Booking created successfully!');
      // Refresh the page after a short delay to show the toast
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      if (error instanceof HttpError) {
        // Handle expected "no provider available" scenarios gracefully (don't show Next.js error overlay)
        if (error.code === 'NO_PROVIDER_AVAILABLE' || error.code === 'NO_PROVIDER_ASSIGNED') {
          toast.info(error.message || 'Booking created! A provider will be assigned soon.');
          handleCloseBookingModal();
          // Don't throw - prevent Next.js error overlay
          return;
        }
        // For other HttpErrors, show error toast
        toast.error(error.message || 'Failed to create booking. Please try again.');
      } else {
        // For unexpected errors, log and show generic message
        console.error('Failed to create booking:', error);
        toast.error('Failed to create booking. Please try again.');
      }
    }
  };

  if (services.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-white/70">No services available at the moment.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className="group relative rounded-2xl bg-[#1C3D5B] border border-white/10 overflow-hidden hover:border-[#69E6A6]/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#69E6A6]/20 cursor-pointer"
          >
            {/* Service Icon/Image */}
            <div 
              className="relative h-52 bg-gradient-to-br from-[#69E6A6]/20 via-[#4A9EFF]/20 to-[#69E6A6]/10 overflow-hidden"
              onClick={() => handleShowDetails(service)}
            >
              {/* Large Background Text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-8xl md:text-9xl font-black text-white/5 select-none pointer-events-none uppercase tracking-wider">
                  {service.name.split(' ')[0]}
                </span>
              </div>
              
              <div className="relative w-full h-full flex items-center justify-center z-10">
                <div className="text-white/60 group-hover:text-white/90 group-hover:scale-110 transition-all duration-300">
                  {getServiceIcon(service.name)}
                </div>
              </div>
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C3D5B] via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity z-0"></div>
              
              {/* Price Badge */}
              {service.basePrice && (
                <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-[#69E6A6]/90 backdrop-blur-sm border border-white/20 shadow-lg">
                  <span className="text-[#0A2640] font-bold text-sm">
                    Rs. {service.basePrice.toLocaleString()}
                  </span>
                </div>
              )}

              {/* Active Status Badge */}
              {service.isActive && (
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#69E6A6]/20 backdrop-blur-sm border border-[#69E6A6]/50">
                  <span className="text-[#69E6A6] text-xs font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-[#69E6A6] rounded-full animate-pulse"></span>
                    Available
                  </span>
                </div>
              )}
            </div>

            {/* Service Info */}
            <div className="p-5">
              <div onClick={() => handleShowDetails(service)} className="cursor-pointer mb-3">
                <h3 className="text-white font-bold text-lg mb-1.5 group-hover:text-[#69E6A6] transition-colors line-clamp-1">
                  {service.name}
                </h3>
                <p className="text-[#69E6A6] text-xs font-semibold mb-2 italic flex items-center gap-1.5">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {getServiceTagline(service.name)}
                </p>
              </div>
              <p className="text-white/70 text-sm line-clamp-2 mb-4 min-h-[2.5rem] leading-relaxed">
                {service.description || 'Professional service for your home'}
              </p>

              {/* Price Display (if not shown in badge) */}
              {!service.basePrice && (
                <div className="mb-4">
                  <span className="text-white/50 text-xs">Starting from</span>
                  <span className="text-[#69E6A6] font-semibold ml-2">Contact for pricing</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 mt-auto">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBookService(service);
                  }}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#69E6A6] to-[#5dd195] hover:from-[#5dd195] hover:to-[#4fb882] text-[#0A2640] font-semibold text-sm transition-all hover:scale-105 shadow-lg shadow-[#69E6A6]/30 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Book Now
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShowDetails(service);
                  }}
                  className="px-4 py-2.5 rounded-lg border border-white/20 bg-[#0A2640] text-white hover:bg-white/10 hover:border-[#69E6A6]/50 transition-all font-medium text-sm flex items-center justify-center"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      <BookingModal
        service={selectedService}
        isOpen={isBookingModalOpen}
        onClose={handleCloseBookingModal}
        onConfirm={handleConfirmBooking}
      />

      {/* Service Details Modal */}
      <ServiceDetailsModal
        service={selectedService}
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        onBookNow={handleBookFromDetails}
      />
    </>
  );
}
