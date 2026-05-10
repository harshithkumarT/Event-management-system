import { cn } from '../../utils/cn';
import { forwardRef } from 'react';

export const Input = forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <label className="block space-y-2">
      {label ? <span className="text-sm font-medium text-slate-200">{label}</span> : null}
      <input
        ref={ref}
        className={cn(
          'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 placeholder:text-slate-400 outline-none transition focus:border-accent-400 focus:ring-2 focus:ring-accent-400/20',
          className,
          error && 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/20',
        )}
        {...props}
      />
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
    </label>
  );
});

Input.displayName = 'Input';