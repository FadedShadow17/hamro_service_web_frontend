import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  withWindowDots?: boolean;
  variant?: 'dark' | 'light';
}

export function Card({ 
  children, 
  className = '', 
  withWindowDots = false,
  variant = 'light'
}: CardProps) {
  const baseClasses = 'rounded-lg p-6 shadow-lg';
  const variantClasses = {
    dark: 'bg-[#1C3D5B]',
    light: 'bg-white border border-gray-200',
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {withWindowDots && (
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
      )}
      {children}
    </div>
  );
}

