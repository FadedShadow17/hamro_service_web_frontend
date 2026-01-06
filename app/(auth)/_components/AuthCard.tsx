import { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  illustration?: 'login' | 'register' | 'forgot';
}

export function AuthCard({ title, subtitle, children, illustration = 'login' }: AuthCardProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#06243A] via-[#0A2640] to-[#0F2E4A] px-4 py-12 relative overflow-hidden">
      {/* Animated gradient shapes */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#69E6A6]/15 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#4A9EFF]/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#69E6A6]/5 rounded-full blur-2xl"></div>
      
      <div className="w-full max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-[#1C3D5B]/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
          {/* Left Side - Form */}
          <div className="p-8 lg:p-12 flex flex-col justify-center relative">
            {/* Home Button - Top Right */}
            <Link
              href="/"
              className="absolute top-4 right-4 flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-[#69E6A6]/20 border border-white/20 hover:border-[#69E6A6]/50 text-white hover:text-[#69E6A6] transition-all duration-300 hover:scale-110 z-10"
              title="Go to Home"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </Link>

            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-6">
                <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                  <div className="relative w-12 h-12 flex-shrink-0">
                    <Image
                      src="/images/hamro service.png"
                      alt="Hamro Service Logo"
                      width={48}
                      height={48}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-white text-2xl font-bold">Hamro Service</span>
                </Link>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-3">{title}</h1>
              {subtitle && (
                <p className="text-lg text-white/70">{subtitle}</p>
              )}
            </div>
            {children}
          </div>

          {/* Right Side - Illustration */}
          <div className="hidden lg:flex items-center justify-center p-12 bg-gradient-to-br from-[#69E6A6]/10 via-[#4A9EFF]/10 to-[#69E6A6]/5 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#69E6A6]/20 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#4A9EFF]/20 rounded-full blur-2xl"></div>
            
            <div className="relative z-10 text-center">
              {illustration === 'login' && (
                <div className="space-y-6">
                  <div className="w-32 h-32 mx-auto rounded-3xl bg-gradient-to-br from-[#69E6A6]/30 to-[#4A9EFF]/30 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl">
                    <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-white">Welcome Back!</h3>
                    <p className="text-white/70 max-w-sm mx-auto">
                      Sign in to access your account and continue managing your home services.
                    </p>
                  </div>
                  <div className="flex justify-center gap-4 mt-8">
                    <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                      <svg className="w-8 h-8 text-[#69E6A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                      <svg className="w-8 h-8 text-[#4A9EFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                      <svg className="w-8 h-8 text-[#69E6A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}
              
              {illustration === 'register' && (
                <div className="space-y-6">
                  <div className="w-32 h-32 mx-auto rounded-3xl bg-gradient-to-br from-[#69E6A6]/30 to-[#4A9EFF]/30 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl">
                    <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-white">Join Us Today!</h3>
                    <p className="text-white/70 max-w-sm mx-auto">
                      Create your account and start booking professional home services in minutes.
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mt-8">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-full h-20 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                        <svg className="w-8 h-8 text-[#69E6A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {illustration === 'forgot' && (
                <div className="space-y-6">
                  <div className="w-32 h-32 mx-auto rounded-3xl bg-gradient-to-br from-[#69E6A6]/30 to-[#4A9EFF]/30 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl">
                    <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-white">Reset Password</h3>
                    <p className="text-white/70 max-w-sm mx-auto">
                      Enter your email address and we'll send you instructions to reset your password.
                    </p>
                  </div>
                  <div className="flex justify-center mt-8">
                    <div className="w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                      <svg className="w-12 h-12 text-[#69E6A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

