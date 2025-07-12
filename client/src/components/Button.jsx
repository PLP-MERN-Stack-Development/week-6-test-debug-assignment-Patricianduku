// Button.jsx - Reusable Button component
import React from 'react';

const Button = ({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'base',
  className = '',
  ...props
}) => {
  const baseClasses =
    'px-4 py-2 font-semibold rounded focus:outline-none';
  const variantClasses = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-500 text-white hover:bg-gray-600',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    disabled: 'bg-gray-300 text-gray-700 cursor-not-allowed',
  };
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    base: 'text-base',
  };

  const finalClassName = [
    baseClasses,
    disabled ? variantClasses['disabled'] : variantClasses[variant],
    sizeClasses[size],
    className,
  ].join(' ');

  return (
    <button
      className={finalClassName}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
