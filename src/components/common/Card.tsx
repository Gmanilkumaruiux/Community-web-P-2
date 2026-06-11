import React, { ReactNode, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  footer,
  className = '',
  id,
  ...props
}) => {
  return (
    <div
      id={id}
      className={`bg-white rounded-xl border border-slate-150 shadow-sm overflow-hidden flex flex-col ${className}`}
      {...props}
    >
      {(title || subtitle) && (
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          {title && <h3 className="text-base font-semibold text-slate-900">{title}</h3>}
          {subtitle && <p className="text-xs text-slate-500 mt-1 font-normal">{subtitle}</p>}
        </div>
      )}
      <div className="p-6 flex-1 flex flex-col">{children}</div>
      {footer && (
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
