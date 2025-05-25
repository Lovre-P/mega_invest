import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full font-semibold transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-slate-100 text-slate-800 hover:bg-slate-200",
        primary: "bg-blue-100 text-blue-800 hover:bg-blue-200",
        secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200",
        success: "bg-green-100 text-green-800 hover:bg-green-200",
        warning: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
        danger: "bg-red-100 text-red-800 hover:bg-red-200",
        info: "bg-blue-100 text-blue-800 hover:bg-blue-200",
        outline: "border-2 border-slate-200 text-slate-600 hover:border-slate-300",
        gradient: "bg-gradient-to-r from-blue-500 to-purple-600 text-white",
        glass: "glass text-slate-700",
        // Risk-specific variants
        "risk-low": "risk-badge-low",
        "risk-moderate": "risk-badge-moderate", 
        "risk-high": "risk-badge-high"
      },
      size: {
        sm: "px-2 py-1 text-xs",
        default: "px-3 py-1.5 text-sm",
        lg: "px-4 py-2 text-base",
        xl: "px-5 py-2.5 text-lg"
      },
      rounded: {
        default: "rounded-full",
        sm: "rounded-md",
        lg: "rounded-xl",
        none: "rounded-none"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default"
    }
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ 
    className, 
    variant, 
    size, 
    rounded,
    icon,
    iconPosition = 'left',
    children,
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant, size, rounded, className }))}
        {...props}
      >
        {icon && iconPosition === 'left' && (
          <span className="mr-1">{icon}</span>
        )}
        {children}
        {icon && iconPosition === 'right' && (
          <span className="ml-1">{icon}</span>
        )}
      </div>
    );
  }
);

Badge.displayName = "Badge";

// Risk Badge Component
export interface RiskBadgeProps extends Omit<BadgeProps, 'variant'> {
  risk: 'Low' | 'Moderate' | 'High';
}

const RiskBadge = React.forwardRef<HTMLDivElement, RiskBadgeProps>(
  ({ risk, ...props }, ref) => {
    const variant = risk === 'Low' ? 'risk-low' : 
                   risk === 'Moderate' ? 'risk-moderate' : 
                   'risk-high';
    
    return (
      <Badge
        ref={ref}
        variant={variant}
        size="sm"
        {...props}
      >
        {risk}
      </Badge>
    );
  }
);

RiskBadge.displayName = "RiskBadge";

export { Badge, RiskBadge, badgeVariants };
