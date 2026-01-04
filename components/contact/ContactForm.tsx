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
        <div className="rounded-lg bg-[#69E6A6]/20 border border-[#69E6A6]/50 p-4 text-sm text-[#69E6A6]">
          {success}
        </div>
      )}
      {error && (
        <div className="rounded-lg bg-red-500/20 border border-red-500/50 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* User Info (Read-only) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Name</label>
          <input
            type="text"
            value={user?.name || ''}
            disabled
            className="w-full rounded-lg border border-white/20 bg-[#0A2640]/50 py-3 px-4 text-white/70 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Email</label>
          <input
            type="email"
            value={user?.email || ''}
            disabled
            className="w-full rounded-lg border border-white/20 bg-[#0A2640]/50 py-3 px-4 text-white/70 cursor-not-allowed"
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-white/80 mb-2">
          Category <span className="text-red-400">*</span>
        </label>
        <select
          id="category"
          {...register('category')}
          className={`w-full rounded-lg border bg-[#0A2640] py-3 px-4 text-white focus:border-[#69E6A6] focus:outline-none focus:ring-2 focus:ring-[#69E6A6]/20 ${
            errors.category ? 'border-red-500' : 'border-white/20'
          }`}
        >
          <option value="General">General</option>
          <option value="Booking">Booking</option>
          <option value="Payments">Payments</option>
          <option value="Technical">Technical</option>
          <option value="Other">Other</option>
        </select>
        {errors.category && (
          <p className="mt-1 text-sm text-red-400">{errors.category.message}</p>
        )}
      </div>

      {/* Subject */}
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-white/80 mb-2">
          Subject <span className="text-red-400">*</span>
        </label>
        <input
          id="subject"
          type="text"
          placeholder="Enter subject"
          {...register('subject')}
          className={`w-full rounded-lg border bg-[#0A2640] py-3 px-4 text-white placeholder-white/50 focus:border-[#69E6A6] focus:outline-none focus:ring-2 focus:ring-[#69E6A6]/20 ${
            errors.subject ? 'border-red-500' : 'border-white/20'
          }`}
        />
        {errors.subject && (
          <p className="mt-1 text-sm text-red-400">{errors.subject.message}</p>
        )}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-white/80 mb-2">
          Message <span className="text-red-400">*</span>
        </label>
        <textarea
          id="message"
          rows={6}
          placeholder="Enter your message..."
          {...register('message', {
            onChange: (e) => setMessageLength(e.target.value.length),
          })}
          className={`w-full rounded-lg border bg-[#0A2640] py-3 px-4 text-white placeholder-white/50 focus:border-[#69E6A6] focus:outline-none focus:ring-2 focus:ring-[#69E6A6]/20 resize-none ${
            errors.message ? 'border-red-500' : 'border-white/20'
          }`}
        />
        <div className="mt-2 flex justify-between items-center">
          {errors.message && (
            <p className="text-sm text-red-400">{errors.message.message}</p>
          )}
          <p className={`text-xs ml-auto ${
            messageLength > messageMaxLength * 0.9
              ? 'text-yellow-400'
              : 'text-white/50'
          }`}>
            {messageLength} / {messageMaxLength} characters
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-full bg-[#69E6A6] py-3 font-semibold text-[#0A2640] transition-colors hover:bg-[#5dd195] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? 'Submitting...' : 'Submit Message'}
      </button>
    </form>
  );
}

