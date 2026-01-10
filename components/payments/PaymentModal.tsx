'use client';

import { useState } from 'react';
import { useToastContext } from '@/providers/ToastProvider';
import { payForBooking } from '@/lib/api/payments.api';
import { type Booking } from '@/lib/api/bookings.api';
import { HttpError } from '@/lib/api/http';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking;
  onSuccess: () => void;
}

type PaymentMethod = 'COD' | 'ESEWA' | 'FONEPAY';

export function PaymentModal({ isOpen, onClose, booking, onSuccess }: PaymentModalProps) {
  const toast = useToastContext();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pin, setPin] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!isOpen) return null;

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setPhoneNumber('');
    setPin('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedMethod === 'COD') {
      // COD doesn't need verification
      await processPayment('COD');
      return;
    }

    // Validate phone number (10 digits for Nepali numbers)
    if (!/^[0-9]{10}$/.test(phoneNumber)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    // Validate PIN (4 digits)
    if (!/^[0-9]{4}$/.test(pin)) {
      toast.error('Please enter a valid 4-digit PIN');
      return;
    }

    await processPayment(selectedMethod!);
  };

  const processPayment = async (method: PaymentMethod) => {
    setIsProcessing(true);
    try {
      await payForBooking(booking.id, method);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onSuccess();
        onClose();
        // Reset form
        setSelectedMethod(null);
        setPhoneNumber('');
        setPin('');
      }, 2000);
    } catch (err) {
      if (err instanceof HttpError) {
        if (err.status === 403 && err.code === 'UNAUTHORIZED_USER') {
          toast.error('This booking does not belong to you');
        } else if (err.status === 400 && err.code === 'INVALID_BOOKING_STATUS') {
          toast.error('Only confirmed bookings can be paid');
        } else if (err.status === 400 && err.code === 'ALREADY_PAID') {
          toast.error('This booking is already paid');
          onSuccess(); // Refresh to update UI
        } else {
          toast.error(err.message || 'Failed to process payment. Please try again.');
        }
      } else {
        console.error('Unexpected error processing payment:', err);
        toast.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      setSelectedMethod(null);
      setPhoneNumber('');
      setPin('');
      setShowSuccess(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-gradient-to-br from-[#1C3D5B] via-[#0F2A47] to-[#0A2640] border border-white/10 shadow-2xl">
        {/* Close button */}
        <button
          onClick={handleClose}
          disabled={isProcessing}
          className="absolute top-4 right-4 p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8">
          {showSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#69E6A6]/20 flex items-center justify-center">
                <svg className="w-10 h-10 text-[#69E6A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Payment Confirmed!</h3>
              <p className="text-white/70">Your payment has been processed successfully.</p>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-white mb-2">Make Payment</h2>
              <p className="text-white/70 mb-6">
                Booking #{booking.id.slice(-8)} • Rs. {booking.service?.basePrice?.toLocaleString() || 'N/A'}
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Payment Method Selection */}
                <div>
                  <label className="block text-white/80 text-sm font-semibold mb-3">
                    Select Payment Method
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    <button
                      type="button"
                      onClick={() => handleMethodSelect('COD')}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        selectedMethod === 'COD'
                          ? 'border-[#69E6A6] bg-[#69E6A6]/10'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedMethod === 'COD' ? 'border-[#69E6A6]' : 'border-white/30'
                        }`}>
                          {selectedMethod === 'COD' && (
                            <div className="w-3 h-3 rounded-full bg-[#69E6A6]"></div>
                          )}
                        </div>
                        <div>
                          <div className="text-white font-semibold">Cash on Delivery (COD)</div>
                          <div className="text-white/60 text-xs">Pay when service is completed</div>
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleMethodSelect('ESEWA')}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        selectedMethod === 'ESEWA'
                          ? 'border-[#69E6A6] bg-[#69E6A6]/10'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedMethod === 'ESEWA' ? 'border-[#69E6A6]' : 'border-white/30'
                        }`}>
                          {selectedMethod === 'ESEWA' && (
                            <div className="w-3 h-3 rounded-full bg-[#69E6A6]"></div>
                          )}
                        </div>
                        <div>
                          <div className="text-white font-semibold">eSewa</div>
                          <div className="text-white/60 text-xs">Pay with your eSewa account</div>
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleMethodSelect('FONEPAY')}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        selectedMethod === 'FONEPAY'
                          ? 'border-[#69E6A6] bg-[#69E6A6]/10'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedMethod === 'FONEPAY' ? 'border-[#69E6A6]' : 'border-white/30'
                        }`}>
                          {selectedMethod === 'FONEPAY' && (
                            <div className="w-3 h-3 rounded-full bg-[#69E6A6]"></div>
                          )}
                        </div>
                        <div>
                          <div className="text-white font-semibold">Fonepay</div>
                          <div className="text-white/60 text-xs">Pay with your Fonepay account</div>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Phone Number Input (for eSewa/Fonepay) */}
                {(selectedMethod === 'ESEWA' || selectedMethod === 'FONEPAY') && (
                  <div>
                    <label className="block text-white/80 text-sm font-semibold mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="98XXXXXXXX"
                      maxLength={10}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#69E6A6] focus:ring-2 focus:ring-[#69E6A6]/20 transition-all"
                      required
                    />
                    <p className="text-white/50 text-xs mt-1.5">Enter your 10-digit phone number</p>
                  </div>
                )}

                {/* PIN Input (for eSewa/Fonepay) */}
                {(selectedMethod === 'ESEWA' || selectedMethod === 'FONEPAY') && (
                  <div>
                    <label className="block text-white/80 text-sm font-semibold mb-2">
                      4-Digit PIN
                    </label>
                    <input
                      type="password"
                      value={pin}
                      onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="••••"
                      maxLength={4}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#69E6A6] focus:ring-2 focus:ring-[#69E6A6]/20 transition-all text-center text-2xl tracking-widest"
                      required
                    />
                    <p className="text-white/50 text-xs mt-1.5">Enter your 4-digit PIN</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!selectedMethod || isProcessing}
                  className="w-full py-3.5 rounded-xl bg-[#69E6A6] hover:bg-[#5dd195] text-[#0A2640] font-bold text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Confirm Payment'
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
