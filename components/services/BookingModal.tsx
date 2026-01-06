'use client';

import { useState, useEffect } from 'react';
import { Service } from '@/lib/api/services.api';

interface BookingModalProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (bookingData: {
    serviceId: string;
    date: string;
    time: string;
    area: string;
  }) => void;
}

export function BookingModal({ service, isOpen, onClose, onConfirm }: BookingModalProps) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [area, setArea] = useState('');
  const [errors, setErrors] = useState<{ date?: string; time?: string; area?: string }>({});

  // Get tomorrow's date as minimum date
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setDate('');
      setTime('');
      setArea('');
      setErrors({});
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { date?: string; time?: string; area?: string } = {};

    if (!date) {
      newErrors.date = 'Please select a date';
    }
    if (!time) {
      newErrors.time = 'Please select a time';
    }
    if (!area.trim()) {
      newErrors.area = 'Please enter your location';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onConfirm({
      serviceId: service!.id,
      date,
      time,
      area: area.trim(),
    });
  };

  if (!isOpen || !service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div className="relative w-full max-w-md bg-[#1C3D5B] rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Book Service</h2>
              <p className="text-white/70 text-sm">{service.name}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Date Picker */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Select Date
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                type="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  if (errors.date) setErrors({ ...errors, date: undefined });
                }}
                min={getMinDate()}
                className={`w-full rounded-lg border bg-[#0A2640] py-3 pl-10 pr-4 text-white focus:border-[#69E6A6] focus:outline-none focus:ring-2 focus:ring-[#69E6A6]/20 transition-all ${
                  errors.date ? 'border-red-500' : 'border-white/20'
                }`}
              />
            </div>
            {errors.date && <p className="mt-1 text-sm text-red-400">{errors.date}</p>}
          </div>

          {/* Time Picker */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Select Time
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <input
                type="time"
                value={time}
                onChange={(e) => {
                  setTime(e.target.value);
                  if (errors.time) setErrors({ ...errors, time: undefined });
                }}
                className={`w-full rounded-lg border bg-[#0A2640] py-3 pl-10 pr-4 text-white focus:border-[#69E6A6] focus:outline-none focus:ring-2 focus:ring-[#69E6A6]/20 transition-all ${
                  errors.time ? 'border-red-500' : 'border-white/20'
                }`}
              />
            </div>
            {errors.time && <p className="mt-1 text-sm text-red-400">{errors.time}</p>}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Location
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={area}
                  onChange={(e) => {
                    setArea(e.target.value);
                    if (errors.area) setErrors({ ...errors, area: undefined });
                  }}
                  placeholder="Enter your location"
                  className={`w-full rounded-lg border bg-[#0A2640] py-3 pl-10 pr-4 text-white placeholder-white/50 focus:border-[#69E6A6] focus:outline-none focus:ring-2 focus:ring-[#69E6A6]/20 transition-all ${
                    errors.area ? 'border-red-500' : 'border-white/20'
                  }`}
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  // Placeholder for location functionality
                  console.log('Location button clicked');
                }}
                className="px-4 py-3 rounded-lg bg-[#69E6A6]/20 hover:bg-[#69E6A6]/30 border border-[#69E6A6]/50 text-[#69E6A6] transition-all hover:scale-105"
                title="Use current location"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </button>
            </div>
            {errors.area && <p className="mt-1 text-sm text-red-400">{errors.area}</p>}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-lg border border-white/20 bg-[#0A2640] text-white hover:bg-white/10 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-[#69E6A6] to-[#5dd195] hover:from-[#5dd195] hover:to-[#4fb882] text-[#0A2640] font-semibold transition-all hover:scale-105 shadow-lg shadow-[#69E6A6]/30"
            >
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

