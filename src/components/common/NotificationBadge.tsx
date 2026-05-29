'use client';

interface NotificationBadgeProps {
  count: number;
  maxCount?: number;
  variant?: 'default' | 'error' | 'warning' | 'success';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const NotificationBadge = ({
  count,
  maxCount = 99,
  variant = 'error',
  size = 'md',
  className = '',
}: NotificationBadgeProps) => {
  if (count <= 0) return null;

  const displayCount = count > maxCount ? `${maxCount}+` : count;

  const variantClasses = {
    default: 'bg-primary text-primary-foreground',
    error: 'bg-error text-error-foreground',
    warning: 'bg-warning text-warning-foreground',
    success: 'bg-success text-success-foreground',
  };

  const sizeClasses = {
    sm: 'w-4 h-4 text-[10px]',
    md: 'w-5 h-5 text-xs',
    lg: 'w-6 h-6 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full font-caption font-medium ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      aria-label={`${count} notifications`}
    >
      {displayCount}
    </span>
  );
};

export default NotificationBadge;
