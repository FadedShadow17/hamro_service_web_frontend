import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, icon, className = '', ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <div className="text-white/50">{icon}</div>
          </div>
        )}
        <input
          ref={ref}
          className={`w-full rounded-lg border bg-[#0A2640] py-3 ${
            icon ? 'pl-10' : 'pl-4'
          } pr-4 text-white placeholder-white/50 focus:border-[#69E6A6] focus:outline-none focus:ring-2 focus:ring-[#69E6A6]/20 ${
            error ? 'border-red-500' : 'border-white/20'
          } ${className}`}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = 'Input';

