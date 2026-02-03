// ============================================
// REUSABLE BUTTON COMPONENT
// Demonstrates: Component Reusability with variants
// ============================================

import React from 'react';

const variants = {
  primary: {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
  },
  secondary: {
    backgroundColor: '#e5e7eb',
    color: '#374151',
    border: 'none',
  },
  danger: {
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
  },
  outline: {
    backgroundColor: 'transparent',
    color: '#3b82f6',
    border: '1px solid #3b82f6',
  },
};

const sizes = {
  sm: { padding: '4px 8px', fontSize: '12px' },
  md: { padding: '8px 16px', fontSize: '14px' },
  lg: { padding: '12px 24px', fontSize: '16px' },
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  style = {},
  ...props
}) => {
  const baseStyle = {
    borderRadius: '6px',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.6 : 1,
    transition: 'all 0.2s',
    fontWeight: 500,
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    ...variants[variant],
    ...sizes[size],
    ...style,
  };

  return (
    <button
      type={type}
      style={baseStyle}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span>⏳</span>}
      {children}
    </button>
  );
};

export default Button;
