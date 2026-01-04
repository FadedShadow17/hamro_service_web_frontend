'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema, type ContactFormData } from '@/lib/contact/contact.schemas';
import { createContact } from '@/lib/contact/contact.api';
import { getUser } from '@/lib/auth/auth.storage';
import { HttpError } from '@/lib/api/http';

interface ContactFormProps {
  onSuccess?: () => void;
}

export function ContactForm({ onSuccess }: ContactFormProps) {
  const user = getUser();
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      category: 'General',
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      await createContact(data);
      setSuccess('Your message has been submitted successfully! We will get back to you soon.');
      reset();
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      if (err instanceof HttpError) {
        if (err.status === 401) {
          setError('Please log in to submit a contact message');
        } else if (err.errors) {
          // Handle validation errors
          const firstError = Object.values(err.errors)[0]?.[0];
          setError(firstError || err.message);
        } else {
          setError(err.message || 'Failed to submit message');
        }
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const messageMaxLength = 5000;
  const [messageLength, setMessageLength] = useState(0);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {success && (
        <div className="rounded-xl bg-[#69E6A6]/20 border border-[#69E6A6]/50 p-4 text-sm text-[#69E6A6] flex items-start space-x-3">
          <svg
            className="w-5 h-5 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="rounded-xl bg-red-500/20 border border-red-500/50 p-4 text-sm text-red-400 flex items-start space-x-3">
          <svg
            className="w-5 h-5 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* User Info (Read-only) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-white mb-2 flex items-center">
            <svg
              className="w-4 h-4 mr-2 text-white/60"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Name
          </label>
          <input
            type="text"
            value={user?.name || ''}
            disabled
            className="w-full rounded-lg border border-white/20 bg-[#0A2640]/60 py-3 px-4 text-white/70 cursor-not-allowed backdrop-blur-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-white mb-2 flex items-center">
            <svg
              className="w-4 h-4 mr-2 text-white/60"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Email
          </label>
          <input
            type="email"
            value={user?.email || ''}
            disabled
            className="w-full rounded-lg border border-white/20 bg-[#0A2640]/60 py-3 px-4 text-white/70 cursor-not-allowed backdrop-blur-sm"
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category" className="block text-sm font-semibold text-white mb-2 flex items-center">
          <svg
            className="w-4 h-4 mr-2 text-white/60"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
            />
          </svg>
          Category <span className="text-red-400 ml-1">*</span>
        </label>
        <select
          id="category"
          {...register('category')}
          className={`w-full rounded-lg border bg-[#0A2640]/80 backdrop-blur-sm py-3 px-4 text-white focus:border-[#69E6A6] focus:outline-none focus:ring-2 focus:ring-[#69E6A6]/20 transition-all ${
            errors.category ? 'border-red-500' : 'border-white/20 hover:border-white/30'
          }`}
        >
          <option value="General">General Inquiry</option>
          <option value="Booking">Booking Related</option>
          <option value="Payments">Payment Issues</option>
          <option value="Technical">Technical Support</option>
          <option value="Other">Other</option>
        </select>
        {errors.category && (
          <p className="mt-1 text-sm text-red-400 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {errors.category.message}
          </p>
        )}
      </div>

      {/* Subject */}
      <div>
        <label htmlFor="subject" className="block text-sm font-semibold text-white mb-2 flex items-center">
          <svg
            className="w-4 h-4 mr-2 text-white/60"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
            />
          </svg>
          Subject <span className="text-red-400 ml-1">*</span>
        </label>
        <input
          id="subject"
          type="text"
          placeholder="What is this regarding?"
          {...register('subject')}
          className={`w-full rounded-lg border bg-[#0A2640]/80 backdrop-blur-sm py-3 px-4 text-white placeholder-white/40 focus:border-[#69E6A6] focus:outline-none focus:ring-2 focus:ring-[#69E6A6]/20 transition-all ${
            errors.subject ? 'border-red-500' : 'border-white/20 hover:border-white/30'
          }`}
        />
        {errors.subject && (
          <p className="mt-1 text-sm text-red-400 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {errors.subject.message}
          </p>
        )}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-white mb-2 flex items-center">
          <svg
            className="w-4 h-4 mr-2 text-white/60"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          Message <span className="text-red-400 ml-1">*</span>
        </label>
        <textarea
          id="message"
          rows={6}
          placeholder="Tell us more about your inquiry..."
          {...register('message', {
            onChange: (e) => setMessageLength(e.target.value.length),
          })}
          className={`w-full rounded-lg border bg-[#0A2640]/80 backdrop-blur-sm py-3 px-4 text-white placeholder-white/40 focus:border-[#69E6A6] focus:outline-none focus:ring-2 focus:ring-[#69E6A6]/20 resize-none transition-all ${
            errors.message ? 'border-red-500' : 'border-white/20 hover:border-white/30'
          }`}
        />
        <div className="mt-2 flex justify-between items-center">
          {errors.message && (
            <p className="text-sm text-red-400 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {errors.message.message}
            </p>
          )}
          <p className={`text-xs ml-auto font-medium ${
            messageLength > messageMaxLength * 0.9
              ? 'text-yellow-400'
              : messageLength > messageMaxLength * 0.8
              ? 'text-white/70'
              : 'text-white/50'
          }`}>
            {messageLength} / {messageMaxLength}
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-xl bg-gradient-to-r from-[#69E6A6] to-[#5dd195] py-4 font-semibold text-[#0A2640] transition-all hover:shadow-lg hover:shadow-[#69E6A6]/30 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center space-x-2"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Submitting...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <span>Send Message</span>
          </>
        )}
      </button>
    </form>
  );
}

