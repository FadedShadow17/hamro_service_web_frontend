'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '@/lib/auth/auth.schemas';
import { login } from '@/lib/auth/auth.api';
import { setToken, setUser } from '@/lib/auth/auth.storage';
import { HttpError } from '@/lib/api/http';
import { AuthCard } from './AuthCard';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setSuccess('Account created successfully! Please sign in.');
    }
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError('');
    setIsLoading(true);

    try {
      const response = await login(data);
      setToken(response.token);
      setUser(response.user);
      router.push('/dashboard');
    } catch (err) {
      if (err instanceof HttpError) {
        if (err.status === 401) {
          setError('Invalid email or password');
        } else {
          setError(err.message || 'Login failed');
        }
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard title="Welcome Back" subtitle="Sign in to continue">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {success && (
          <div className="rounded-lg bg-[#69E6A6]/20 border border-[#69E6A6]/50 p-3 text-sm text-[#69E6A6]">
            {success}
          </div>
        )}
        {error && (
          <div className="rounded-lg bg-red-500/20 border border-red-500/50 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="h-5 w-5 text-gray-400"
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
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              {showPassword ? (
                <svg
                  className="h-5 w-5 text-white/50 hover:text-white"
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
                  className="h-5 w-5 text-white/50 hover:text-white"
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

        <div className="flex items-center justify-end">
          <a
            href="/forgot-password"
            className="text-sm font-medium text-[#69E6A6] hover:text-[#5dd195]"
          >
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-full bg-[#69E6A6] py-3 font-semibold text-[#0A2640] transition-colors hover:bg-[#5dd195] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? 'Logging in...' : 'LOGIN'}
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/20"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-[#1C3D5B] px-2 text-white/50">OR</span>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            className="flex flex-1 items-center justify-center rounded-full border border-white/20 bg-[#0A2640] p-3 transition-colors hover:bg-white/10"
          >
            <span className="text-xl font-bold text-white">f</span>
          </button>
          <button
            type="button"
            className="flex flex-1 items-center justify-center rounded-full border border-white/20 bg-[#0A2640] p-3 transition-colors hover:bg-white/10"
          >
            <span className="text-xl font-bold text-white">G</span>
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-white/70">
          Don't have an account?{' '}
          <a href="/register" className="font-medium text-[#69E6A6] hover:text-[#5dd195]">
            Sign up
          </a>
        </p>
      </form>
    </AuthCard>
  );
}

