import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  id?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className = '', id }) => {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div id={id} className={`flex justify-center items-center ${className}`}>
      <div
        className={`${sizes[size]} animate-spin rounded-full border-slate-250 border-t-emerald-600`}
        style={{ borderRightColor: 'transparent' }}
      ></div>
    </div>
  );
};

export default Spinner;
