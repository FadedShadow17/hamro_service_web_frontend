'use client';

import { useState } from 'react';
import { Service } from '@/lib/api/services.api';
import Link from 'next/link';
import Image from 'next/image';
import { BookingModal } from './BookingModal';
import { useToastContext } from '@/providers/ToastProvider';
import { HttpError } from '@/lib/api/http';

interface ServicesGridProps {
  services: Service[];
}

export function ServicesGrid({ services }: ServicesGridProps) {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const toast = useToastContext();

  const handleBookService = (service: Service) => {
    setSelectedService(service);
    setIsBookingModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsBookingModalOpen(false);
    setSelectedService(null);
  };

  const handleConfirmBooking = async (bookingData: {
    serviceId: string;
    providerId: string;
    date: string;
    time: string;
    area: string;
  }) => {
    try {
      const { createBooking } = await import('@/lib/api/bookings.api');
      await createBooking({
        serviceId: bookingData.serviceId,
        providerId: bookingData.providerId,
        date: bookingData.date,
        timeSlot: bookingData.time,
        area: bookingData.area,
      });
      handleCloseModal();
      toast.success('Booking created successfully!');
      // Refresh the page after a short delay to show the toast
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Failed to create booking:', error);
      if (error instanceof HttpError) {
        toast.error(error.message || 'Failed to create booking. Please try again.');
      } else {
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
            className="group relative rounded-2xl bg-[#1C3D5B] border border-white/10 overflow-hidden hover:border-[#69E6A6]/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#69E6A6]/20"
          >
            {/* Service Icon/Image */}
            <div className="relative h-48 bg-gradient-to-br from-[#69E6A6]/20 to-[#4A9EFF]/20 overflow-hidden">
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-6xl opacity-50 group-hover:opacity-70 transition-opacity">
                  {service.icon || '🔧'}
                </div>
              </div>
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C3D5B] via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
            </div>

            {/* Service Info */}
            <div className="p-5">
              <h3 className="text-white font-bold text-lg mb-2 group-hover:text-[#69E6A6] transition-colors">
                {service.name}
              </h3>
              <p className="text-white/70 text-sm line-clamp-2 mb-4">
                {service.description}
              </p>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleBookService(service)}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#69E6A6] to-[#5dd195] hover:from-[#5dd195] hover:to-[#4fb882] text-[#0A2640] font-semibold text-sm transition-all hover:scale-105 shadow-lg shadow-[#69E6A6]/30"
                >
                  Book Now
                </button>
                <Link
                  href={`/services/${service.id}`}
                  className="px-4 py-2.5 rounded-lg border border-white/20 bg-[#0A2640] text-white hover:bg-white/10 hover:border-[#69E6A6]/50 transition-all font-medium text-sm"
                >
                  Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      <BookingModal
        service={selectedService}
        isOpen={isBookingModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmBooking}
      />
    </>
  );
}
