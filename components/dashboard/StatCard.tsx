import Link from 'next/link';
import { ReactNode } from 'react';

interface StatCardProps {
  value: string | number;
  label: string;
  icon: ReactNode;
  color: 'green' | 'blue' | 'orange' | 'purple' | 'yellow';
  href?: string;
  onClick?: () => void;
  progress?: number; // 0-100 for progress bar
  className?: string;
  badge?: { text: string; color: 'yellow' | 'red' | 'blue' | 'green' };
}

const colorClasses = {
  green: {
    gradient: 'from-[#69E6A6]/30 via-[#69E6A6]/15 to-[#69E6A6]/5',
    border: 'border-[#69E6A6]/40 hover:border-[#69E6A6]/60',
    shadow: 'hover:shadow-[#69E6A6]/20',
    iconBg: 'from-[#69E6A6] to-[#5dd195]',
    iconColor: 'text-[#0A2640]',
    dot: 'bg-[#69E6A6]',
    text: 'text-[#69E6A6]',
    progress: 'bg-[#69E6A6]',
  },
  blue: {
    gradient: 'from-[#4A9EFF]/30 via-[#4A9EFF]/15 to-[#4A9EFF]/5',
    border: 'border-[#4A9EFF]/40 hover:border-[#4A9EFF]/60',
    shadow: 'hover:shadow-[#4A9EFF]/20',
    iconBg: 'from-[#4A9EFF] to-[#3a8eef]',
    iconColor: 'text-white',
    dot: 'bg-[#4A9EFF]',
    text: 'text-[#4A9EFF]',
    progress: 'bg-[#4A9EFF]',
  },
  orange: {
    gradient: 'from-[#FFA500]/30 via-[#FFA500]/15 to-[#FFA500]/5',
    border: 'border-[#FFA500]/40 hover:border-[#FFA500]/60',
    shadow: 'hover:shadow-[#FFA500]/20',
    iconBg: 'from-[#FFA500] to-[#ff9500]',
    iconColor: 'text-white',
    dot: 'bg-[#FFA500]',
    text: 'text-[#FFA500]',
    progress: 'bg-[#FFA500]',
  },
  purple: {
    gradient: 'from-[#9B59B6]/30 via-[#9B59B6]/15 to-[#9B59B6]/5',
    border: 'border-[#9B59B6]/40 hover:border-[#9B59B6]/60',
    shadow: 'hover:shadow-[#9B59B6]/20',
    iconBg: 'from-[#9B59B6] to-[#8e44ad]',
    iconColor: 'text-white',
    dot: 'bg-[#9B59B6]',
    text: 'text-[#9B59B6]',
    progress: 'bg-[#9B59B6]',
  },
  yellow: {
    gradient: 'from-yellow-500/30 via-yellow-500/15 to-yellow-500/5',
    border: 'border-yellow-500/40 hover:border-yellow-500/60',
    shadow: 'hover:shadow-yellow-500/20',
    iconBg: 'from-yellow-500 to-[#f59e0b]',
    iconColor: 'text-white',
    dot: 'bg-yellow-500',
    text: 'text-yellow-400',
    progress: 'bg-yellow-500',
  },
};

export function StatCard({
  value,
  label,
  icon,
  color,
  href,
  onClick,
  progress,
  className = '',
  badge,
}: StatCardProps) {
  const colors = colorClasses[color];
  const isClickable = href || onClick;

  const cardContent = (
    <>
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className={`absolute top-0 right-0 w-32 h-32 ${colors.dot} rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700`}></div>
        <div className={`absolute bottom-0 left-0 w-24 h-24 ${colors.dot} rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500`}></div>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="relative">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colors.iconBg} flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 shadow-lg ${colors.shadow.replace('hover:', '')}`}>
              <div className={colors.iconColor}>
                {icon}
              </div>
            </div>
            <div className={`absolute -top-1 -right-1 w-4 h-4 ${colors.dot} rounded-full animate-pulse`}></div>
          </div>
          {isClickable && (
            <svg className={`w-6 h-6 ${colors.text} group-hover:translate-x-2 transition-transform duration-300`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className={`text-white font-bold text-3xl mb-1 transition-colors ${
              color === 'green' ? 'group-hover:text-[#69E6A6]' :
              color === 'blue' ? 'group-hover:text-[#4A9EFF]' :
              color === 'orange' ? 'group-hover:text-[#FFA500]' :
              color === 'purple' ? 'group-hover:text-[#9B59B6]' :
              'group-hover:text-yellow-400'
            }`}>
              {value}
            </h3>
            {badge && (
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                badge.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50' :
                badge.color === 'red' ? 'bg-red-500/20 text-red-400 border border-red-500/50' :
                badge.color === 'blue' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' :
                'bg-[#69E6A6]/20 text-[#69E6A6] border border-[#69E6A6]/50'
              }`}>
                {badge.text}
              </span>
            )}
          </div>
          <p className="text-white/80 text-sm font-medium">{label}</p>
          {progress !== undefined && (
            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden mt-2">
              <div className={`h-full ${colors.progress} rounded-full`} style={{ width: `${Math.min(progress, 100)}%` }}></div>
            </div>
          )}
        </div>
      </div>
    </>
  );

  const baseClasses = `group relative overflow-hidden rounded-3xl bg-gradient-to-br ${colors.gradient} p-6 border ${colors.border} transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl ${colors.shadow} ${className}`;

  if (href) {
    return (
      <Link href={href} className={`${baseClasses} cursor-pointer`}>
        {cardContent}
      </Link>
    );
  }

  if (onClick) {
    const focusRingColor = color === 'green' ? 'focus:ring-[#69E6A6]/50' :
                           color === 'blue' ? 'focus:ring-[#4A9EFF]/50' :
                           color === 'orange' ? 'focus:ring-[#FFA500]/50' :
                           color === 'purple' ? 'focus:ring-[#9B59B6]/50' :
                           'focus:ring-yellow-500/50';
    return (
      <button
        onClick={onClick}
        className={`${baseClasses} cursor-pointer focus:outline-none focus:ring-2 ${focusRingColor} focus:ring-offset-2 focus:ring-offset-[#0A2640]`}
      >
        {cardContent}
      </button>
    );
  }

  return (
    <div className={baseClasses}>
      {cardContent}
    </div>
  );
}

