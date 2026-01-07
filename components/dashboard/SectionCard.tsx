import Link from 'next/link';
import { ReactNode } from 'react';

interface SectionCardProps {
  title: string;
  subtitle?: string;
  actionLink?: {
    href: string;
    text: string;
  };
  children: ReactNode;
  className?: string;
}

export function SectionCard({
  title,
  subtitle,
  actionLink,
  children,
  className = '',
}: SectionCardProps) {
  return (
    <div className={`rounded-2xl bg-[#1C3D5B] border border-white/10 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">{title}</h2>
          {subtitle && <p className="text-white/70 text-sm">{subtitle}</p>}
        </div>
        {actionLink && (
          <Link
            href={actionLink.href}
            className="text-[#69E6A6] hover:text-[#5dd195] text-sm font-medium transition-colors"
          >
            {actionLink.text} →
          </Link>
        )}
      </div>
      {children}
    </div>
  );
}

