import React, { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  containerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, containerClassName = '', className = '', id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

    return (
      <div className={`flex flex-col w-full gap-1.5 ${containerClassName}`}>
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-slate-700 select-none"
        >
          {label}
        </label>
        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            className={`w-full px-3 py-2.5 bg-white border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
              error
                ? 'border-rose-500 focus:ring-rose-200 focus:border-rose-500'
                : 'border-slate-300 focus:ring-emerald-100 focus:border-emerald-500'
            } ${className}`}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-rose-600 font-medium animate-pulse">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
