import { ReactNode } from 'react';

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A2640] px-4 py-12">
      {/* Subtle gradient shapes */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#69E6A6]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#4A9EFF]/10 rounded-full blur-3xl"></div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="rounded-2xl bg-[#1C3D5B] p-8 shadow-2xl border border-white/10">
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#69E6A6] flex items-center justify-center">
                <span className="text-[#0A2640] font-bold text-xl">H</span>
              </div>
              <span className="text-white text-2xl font-bold">Hamro Service</span>
            </div>
            <h1 className="text-3xl font-bold text-white">{title}</h1>
            {subtitle && (
              <p className="mt-2 text-sm text-white/70">{subtitle}</p>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

