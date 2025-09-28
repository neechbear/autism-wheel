import React, { forwardRef } from 'react';
import clsx from 'clsx';
import styles from './Button.module.css';

// As per style guide: primary, secondary, tertiary (ghost)
// Adding destructive and link variants for common use cases.
export type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'ghost' | 'link';
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean; // For Radix UI composition
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'default', asChild = false, ...props }, ref) => {
    const Comp = asChild ? 'div' : 'button'; // Render a div if asChild is true for Radix

    return (
      <Comp
        className={clsx(
          styles.button,
          styles[variant],
          styles[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };