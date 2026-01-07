'use client';

import { useState, useEffect } from 'react';
import { Service, getAvailableProviders, type AvailableProvider } from '@/lib/api/services.api';
import { KathmanduMap } from './KathmanduMap';

interface BookingModalProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (bookingData: {
    serviceId: string;
    providerId?: string;
    date: string;
    time: string;
    area: string;
  }) => void;
}

export function BookingModal({ service, isOpen, onClose, onConfirm }: BookingModalProps) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [area, setArea] = useState('');
  const [selectedProviderId, setSelectedProviderId] = useState<string>('');
  const [availableProviders, setAvailableProviders] = useState<AvailableProvider[]>([]);
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [errors, setErrors] = useState<{ date?: string; time?: string; area?: string; provider?: string }>({});

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
      setSelectedProviderId('');
      setAvailableProviders([]);
      setErrors({});
    }
  }, [isOpen]);

  // Fetch available providers when date and area are set
  useEffect(() => {
    const fetchProviders = async () => {
      if (!service || !date || !area.trim()) {
        setAvailableProviders([]);
        setSelectedProviderId('');
        return;
      }

      try {
        setLoadingProviders(true);
        const providers = await getAvailableProviders(service.id, date, area.trim());
        setAvailableProviders(providers);
        // Auto-select first provider if available
        if (providers.length > 0) {
          setSelectedProviderId(providers[0].providerId);
        } else {
          setSelectedProviderId('');
        }
      } catch (error) {
        console.error('Failed to fetch providers:', error);
        setAvailableProviders([]);
        setSelectedProviderId('');
      } finally {
        setLoadingProviders(false);
      }
    };

    fetchProviders();
  }, [service, date, area]);

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

    const bookingData: any = {
      serviceId: service!.id,
      date,
      time,
      area: area.trim(),
    };
    // Only include providerId if a specific provider was selected
    if (selectedProviderId && selectedProviderId.trim() !== '') {
      bookingData.providerId = selectedProviderId;
    }
    onConfirm(bookingData);
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

        {/* Form - Scrollable */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Date Picker - Enhanced with Quick Dates */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Select Date
              </label>
              <div className="space-y-2">
                {/* Quick Date Buttons */}
                <div className="flex gap-2 flex-wrap">
                  {(() => {
                    const quickDates = [];
                    for (let i = 1; i <= 7; i++) {
                      const d = new Date();
                      d.setDate(d.getDate() + i);
                      quickDates.push(d);
                    }
                    return quickDates;
                  })().map((quickDate) => {
                    const dateStr = quickDate.toISOString().split('T')[0];
                    const isSelected = date === dateStr;
                    return (
                      <button
                        key={dateStr}
                        type="button"
                        onClick={() => {
                          setDate(dateStr);
                          if (errors.date) setErrors({ ...errors, date: undefined });
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-[#69E6A6] text-[#0A2640] shadow-lg shadow-[#69E6A6]/30'
                            : 'bg-[#0A2640] border border-white/20 text-white/80 hover:border-[#69E6A6]/50 hover:text-white'
                        }`}
                      >
                        {quickDate.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}
                      </button>
                    );
                  })}
                </div>
                
                {/* Date Input */}
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 z-10">
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
                    max={(() => {
                      const maxDate = new Date();
                      maxDate.setMonth(maxDate.getMonth() + 3);
                      return maxDate.toISOString().split('T')[0];
                    })()}
                    className={`w-full rounded-xl border bg-[#0A2640] py-2.5 pl-10 pr-4 text-white text-sm cursor-pointer focus:border-[#69E6A6] focus:outline-none focus:ring-2 focus:ring-[#69E6A6]/20 transition-all hover:border-white/40 ${
                      errors.date ? 'border-red-500' : 'border-white/20'
                    }`}
                  />
                </div>
              </div>
              {date && (
                <p className="mt-1 text-xs text-white/60">
                  {new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
              )}
              {errors.date && <p className="mt-1 text-sm text-red-400">{errors.date}</p>}
            </div>

            {/* Time Picker - Enhanced with Time Slots */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Select Time
              </label>
              <div className="space-y-2">
                {/* Quick Time Slots */}
                <div className="grid grid-cols-4 gap-2">
                  {['09:00', '12:00', '15:00', '18:00'].map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => {
                        setTime(slot);
                        if (errors.time) setErrors({ ...errors, time: undefined });
                      }}
                      className={`px-2 py-2 rounded-lg text-xs font-medium transition-all ${
                        time === slot
                          ? 'bg-[#69E6A6] text-[#0A2640] shadow-lg shadow-[#69E6A6]/30'
                          : 'bg-[#0A2640] border border-white/20 text-white/80 hover:border-[#69E6A6]/50 hover:text-white'
                      }`}
                    >
                      {(() => {
                        const [h, m] = slot.split(':');
                        const h12 = parseInt(h) % 12 || 12;
                        const ampm = parseInt(h) >= 12 ? 'PM' : 'AM';
                        return `${h12}:${m} ${ampm}`;
                      })()}
                    </button>
                  ))}
                </div>
                
                {/* Time Input */}
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 z-10">
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
                    step="900"
                    className={`w-full rounded-xl border bg-[#0A2640] py-2.5 pl-10 pr-4 text-white text-sm cursor-pointer focus:border-[#69E6A6] focus:outline-none focus:ring-2 focus:ring-[#69E6A6]/20 transition-all hover:border-white/40 ${
                      errors.time ? 'border-red-500' : 'border-white/20'
                    }`}
                  />
                </div>
              </div>
              {time && (
                <p className="mt-1 text-xs text-white/60">
                  {(() => {
                    const [hours, minutes] = time.split(':');
                    const hour12 = parseInt(hours) % 12 || 12;
                    const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
                    return `${hour12}:${minutes} ${ampm}`;
                  })()}
                </p>
              )}
              {errors.time && <p className="mt-1 text-sm text-red-400">{errors.time}</p>}
            </div>

            {/* Location - Map Selector */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Location (Choose your current location on the map)
              </label>
              <KathmanduMap
                selectedArea={area}
                onAreaSelect={(selectedArea) => {
                  setArea(selectedArea);
                  if (errors.area) setErrors({ ...errors, area: undefined });
                }}
              />
              {errors.area && <p className="mt-1 text-sm text-red-400">{errors.area}</p>}
            </div>

            {/* Provider Selection - Optional */}
            {date && area.trim() && (
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Select Provider (Optional)
              </label>
              {loadingProviders ? (
                <div className="rounded-lg border border-white/20 bg-[#0A2640] py-3 px-4 text-white/70 text-sm">
                  Loading available providers...
                </div>
              ) : availableProviders.length > 0 ? (
                <div className="space-y-2">
                  <label
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      !selectedProviderId
                        ? 'border-[#69E6A6] bg-[#69E6A6]/10'
                        : 'border-white/20 bg-[#0A2640] hover:border-white/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="provider"
                      value=""
                      checked={!selectedProviderId}
                      onChange={(e) => {
                        setSelectedProviderId('');
                        if (errors.provider) setErrors({ ...errors, provider: undefined });
                      }}
                      className="w-4 h-4 text-[#69E6A6] focus:ring-[#69E6A6]"
                    />
                    <div className="flex-1">
                      <div className="text-white font-medium">Auto-assign provider</div>
                      <div className="text-white/60 text-xs mt-1">
                        We'll assign an available provider for you
                      </div>
                    </div>
                  </label>
                  {availableProviders.map((provider) => (
                    <label
                      key={provider.providerId}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedProviderId === provider.providerId
                          ? 'border-[#69E6A6] bg-[#69E6A6]/10'
                          : 'border-white/20 bg-[#0A2640] hover:border-white/40'
                      }`}
                    >
                      <input
                        type="radio"
                        name="provider"
                        value={provider.providerId}
                        checked={selectedProviderId === provider.providerId}
                        onChange={(e) => {
                          setSelectedProviderId(e.target.value);
                          if (errors.provider) setErrors({ ...errors, provider: undefined });
                        }}
                        className="w-4 h-4 text-[#69E6A6] focus:ring-[#69E6A6]"
                      />
                      <div className="flex-1">
                        <div className="text-white font-medium">{provider.providerName || 'Provider'}</div>
                        <div className="text-white/60 text-xs mt-1">
                          {provider.area} • Rs. {provider.price?.toLocaleString() || 'N/A'}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-[#69E6A6]/30 bg-[#69E6A6]/5 py-3 px-4 text-white/80 text-sm">
                  No specific providers available. A provider will be automatically assigned when you confirm your booking.
                </div>
              )}
            </div>
            )}

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
    </div>
  );
}

