import { cn } from '../../utils/cn';

const variantClasses = {
  primary: 'bg-accent-500 text-white hover:bg-accent-400 shadow-lg shadow-accent-500/25',
  secondary: 'bg-white/10 text-slate-100 hover:bg-white/15 border border-white/10',
  ghost: 'bg-transparent text-slate-200 hover:bg-white/10',
  danger: 'bg-rose-500 text-white hover:bg-rose-400',
};

export const Button = ({ as: Component = 'button', className = '', variant = 'primary', size = 'md', ...props }) => {
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3 text-base',
  };

  return (
    <Component
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-400 disabled:cursor-not-allowed disabled:opacity-60',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  );
};