'use client';

import { Service } from '@/lib/api/services.api';

interface ServiceDetailsModalProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
  onBookNow?: () => void;
}

export function ServiceDetailsModal({ service, isOpen, onClose, onBookNow }: ServiceDetailsModalProps) {
  if (!isOpen || !service) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div className="relative w-full max-w-md bg-[#1C3D5B] rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Service Details</h2>
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

        {/* Content - Scrollable */}
        <div className="overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="p-6 space-y-6">
            {/* Service Icon */}
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#69E6A6]/20 to-[#4A9EFF]/20 flex items-center justify-center">
                <span className="text-5xl">{service.icon || '🔧'}</span>
              </div>
            </div>

            {/* Price - Prominent */}
            <div className="text-center">
              <p className="text-white/60 text-sm mb-1">Starting from</p>
              <p className="text-3xl font-bold text-[#69E6A6]">
                {formatPrice(service.basePrice)}
              </p>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-white font-semibold mb-2">About this service</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                {service.description || 'No description available for this service.'}
              </p>
            </div>

            {/* Service Info - Combined */}
            <div className="p-4 rounded-lg bg-[#0A2640] border border-white/10 space-y-3">
              {/* Service ID */}
              <div className="flex items-center justify-between">
                <span className="text-white/70 text-sm">Service ID</span>
                <span className="text-white/90 text-sm font-mono">{service.id}</span>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-white/70 text-sm">Status</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    service.isActive
                      ? 'bg-[#69E6A6]/20 text-[#69E6A6] border border-[#69E6A6]/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}
                >
                  {service.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-white/10">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-lg border border-white/20 bg-[#0A2640] text-white hover:bg-white/10 transition-colors font-medium"
            >
              Close
            </button>
            {onBookNow && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onBookNow();
                }}
                className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-[#69E6A6] to-[#5dd195] hover:from-[#5dd195] hover:to-[#4fb882] text-[#0A2640] font-semibold transition-all hover:scale-105 shadow-lg shadow-[#69E6A6]/30"
              >
                Book Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

