'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterFormData } from '@/lib/auth/auth.schemas';
import { register } from '@/lib/auth/auth.api';
import { HttpError } from '@/lib/api/http';
import { AuthCard } from './AuthCard';
import { handlePhoneChange } from '@/lib/utils/phone-format';

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: '',
      phone: '+977-',
    },
  });

  const phoneValue = watch('phone') || '+977-';

  const onSubmit = async (data: RegisterFormData) => {
    setError('');
    setIsLoading(true);

    try {
      const { confirmPassword, ...registerData } = data;
      // Only include phone if it's provided and not just the prefix
      if (registerData.phone === '+977-' || !registerData.phone) {
        delete registerData.phone;
      }
      await register(registerData);
      router.push('/login?registered=true');
    } catch (err) {
      if (err instanceof HttpError) {
        if (err.status === 409) {
          setError('Email already exists');
        } else if (err.status === 422) {
          const errorMessages = err.errors
            ? Object.values(err.errors).flat().join(', ')
            : err.message;
          setError(errorMessages);
        } else {
          setError(err.message || 'Registration failed');
        }
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard title="Create Account" subtitle="Sign up to get started" illustration="register">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-500/20 border border-red-500/50 p-3 text-sm text-red-400">
            {error}
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Username"
              className={`w-full rounded-lg border bg-[#0A2640] py-3 pl-10 pr-4 text-white placeholder-white/50 focus:border-[#69E6A6] focus:outline-none focus:ring-2 focus:ring-[#69E6A6]/20 ${
                errors.name ? 'border-red-500' : 'border-white/20'
              }`}
              {...registerField('name')}
            />
          </div>
          {errors.name && (
            <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
          )}
        </div>

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
              {...registerField('email')}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
          )}
        </div>

        <div>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 z-10">
              <span className="text-white/70">+977-</span>
            </div>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-12">
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
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
            <input
              type="tel"
              placeholder="XXXXXXXXX"
              value={phoneValue.replace(/^\+977-/, '')}
              onChange={(e) => {
                const digitsOnly = e.target.value.replace(/[^\d]/g, '').slice(0, 10);
                setValue('phone', '+977-' + digitsOnly, { shouldValidate: true });
              }}
              onFocus={(e) => {
                // Move cursor to the end of the input after the prefix
                const input = e.target;
                setTimeout(() => {
                  input.setSelectionRange(input.value.length, input.value.length);
                }, 0);
              }}
              className={`w-full rounded-lg border bg-[#0A2640] py-3 pl-16 pr-4 text-white placeholder-white/50 focus:border-[#69E6A6] focus:outline-none focus:ring-2 focus:ring-[#69E6A6]/20 ${
                errors.phone ? 'border-red-500' : 'border-white/20'
              }`}
            />
          </div>
          {errors.phone && (
            <p className="mt-1 text-sm text-red-400">{errors.phone.message}</p>
          )}
          <p className="mt-1 text-xs text-white/60">Optional - Enter 9-10 digits (prefix +977- is fixed)</p>
        </div>

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
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className={`w-full rounded-lg border bg-[#0A2640] py-3 pl-10 pr-10 text-white placeholder-white/50 focus:border-[#69E6A6] focus:outline-none focus:ring-2 focus:ring-[#69E6A6]/20 ${
                errors.password ? 'border-red-500' : 'border-white/20'
              }`}
              {...registerField('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              {showPassword ? (
                <svg
                  className="h-5 w-5 text-white/50 hover:text-white/70"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5 text-white/50 hover:text-white/70"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
          )}
        </div>

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
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm password"
              className={`w-full rounded-lg border bg-[#0A2640] py-3 pl-10 pr-10 text-white placeholder-white/50 focus:border-[#69E6A6] focus:outline-none focus:ring-2 focus:ring-[#69E6A6]/20 ${
                errors.confirmPassword ? 'border-red-500' : 'border-white/20'
              }`}
              {...registerField('confirmPassword')}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              {showConfirmPassword ? (
                <svg
                  className="h-5 w-5 text-white/50 hover:text-white/70"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5 text-white/50 hover:text-white/70"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-400">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-white/80">
            I want to
          </label>
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
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <select
              className={`w-full rounded-lg border bg-[#0A2640] py-3 pl-10 pr-10 text-white appearance-none cursor-pointer transition-all focus:border-[#69E6A6] focus:outline-none focus:ring-2 focus:ring-[#69E6A6]/20 hover:border-white/40 ${
                errors.role ? 'border-red-500' : 'border-white/20'
              }`}
              {...registerField('role')}
              defaultValue=""
            >
              <option value="" disabled hidden className="bg-[#1C3D5B] text-white/70">
                Select a role
              </option>
              <option value="user" className="bg-[#1C3D5B] text-white">
                Book Services (User)
              </option>
              <option value="provider" className="bg-[#1C3D5B] text-white">
                Provide Services (Service Provider)
              </option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
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
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
          {errors.role && (
            <p className="mt-1 text-sm text-red-400">{errors.role.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-full bg-[#69E6A6] py-3 font-semibold text-[#0A2640] transition-colors hover:bg-[#5dd195] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? 'Creating account...' : 'SIGN UP'}
        </button>

        <p className="mt-6 text-center text-sm text-white/70">
          Already have an account?{' '}
          <a href="/login" className="font-medium text-[#69E6A6] hover:text-[#5dd195]">
            Sign in
          </a>
        </p>
      </form>
    </AuthCard>
  );
}

