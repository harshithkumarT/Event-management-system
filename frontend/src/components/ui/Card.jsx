import { cn } from '../../utils/cn';

export const Card = ({ className = '', children }) => (
  <div className={cn('glass-card rounded-3xl p-6', className)}>{children}</div>
);