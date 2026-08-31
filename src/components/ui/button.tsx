import React, { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-2xl font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 disabled:pointer-events-none disabled:opacity-50 active:scale-95 select-none',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_20px_40px_hsl(var(--primary)/0.3)]',
        secondary: 'bg-secondary text-primary-foreground hover:bg-secondary/90 shadow-xl',
        accent: 'bg-accent text-primary-foreground hover:bg-accent/90 shadow-xl',
        ghost: 'bg-transparent text-foreground hover:bg-white/5',
        outline: 'border border-border/50 bg-transparent hover:bg-white/5 hover:border-primary/50',
        destructive: 'bg-red-500 text-white hover:bg-red-600 shadow-xl shadow-red-500/20',
      },
      size: {
        sm: 'h-12 px-6 text-sm',
        md: 'h-16 px-10 text-base',
        lg: 'h-24 px-16 text-2xl',
        icon: 'h-12 w-12',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'ghost' | 'outline' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
export default Button;
