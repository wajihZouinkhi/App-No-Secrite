import React from 'react';
import { cn } from '@/lib/utils';

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-8 w-8 border-3',
};

export const Spinner: React.FC<SpinnerProps> = ({ 
  size = 'md', 
  className,
  ...props 
}) => {
  return (
    <div
      className={cn(
        'animate-spin rounded-full border-t-transparent border-primary',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}; 