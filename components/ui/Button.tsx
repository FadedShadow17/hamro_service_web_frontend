import { ButtonHTMLAttributes, ReactNode } from 'react';
import Link from 'next/link';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  href?: string;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  href,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseClasses =
    'px-6 py-3 rounded-full font-medium text-sm transition-colors inline-flex items-center justify-center';
  
  const variantClasses = {
    primary: 'bg-[#69E6A6] text-[#0A2640] hover:bg-[#5dd195]',
    secondary: 'bg-white text-[#0A2640] hover:bg-white/90',
    outline: 'border-2 border-white text-white hover:bg-white/10',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

