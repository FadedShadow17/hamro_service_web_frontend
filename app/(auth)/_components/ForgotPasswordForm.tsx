'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from '@/lib/auth/auth.schemas';
import { forgotPassword } from '@/lib/auth/auth.api';
import { HttpError } from '@/lib/api/http';
import { AuthCard } from './AuthCard';

export function ForgotPasswordForm() {
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      await forgotPassword(data);
      setSuccess('Password reset instructions have been sent to your email.');
    } catch (err) {
      if (err instanceof HttpError) {
        if (err.status === 404) {
          setError('Feature coming soon');
        } else {
          setError(err.message || 'Request failed');
        }
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard title="Forgot Password" subtitle="Enter your email to reset password">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="rounded-lg bg-red-500/20 border border-red-500/50 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-lg bg-[#69E6A6]/20 border border-[#69E6A6]/50 p-3 text-sm text-[#69E6A6]">
            {success}
          </div>
        )}

        <div>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="h-5 w-5 text-white/50"
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
            </div>
            <input
              type="email"
              placeholder="E-mail"
              className={`w-full rounded-lg border bg-[#0A2640] py-3 pl-10 pr-4 text-white placeholder-white/50 focus:border-[#69E6A6] focus:outline-none focus:ring-2 focus:ring-[#69E6A6]/20 ${
                errors.email ? 'border-red-500' : 'border-white/20'
              }`}
              {...register('email')}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-full bg-[#69E6A6] py-3 font-semibold text-[#0A2640] transition-colors hover:bg-[#5dd195] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? 'Sending...' : 'SEND RESET LINK'}
        </button>

        <p className="mt-6 text-center text-sm text-white/70">
          Remember your password?{' '}
          <a href="/login" className="font-medium text-[#69E6A6] hover:text-[#5dd195]">
            Sign in
          </a>
        </p>
      </form>
    </AuthCard>
  );
}

