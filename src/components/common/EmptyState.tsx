import React from 'react';
import * as Icons from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import Button from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  iconName?: keyof typeof Icons;
  actionText?: string;
  onActionClick?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  iconName = 'Inbox',
  actionText,
  onActionClick,
}) => {
  const IconComponent = (Icons[iconName] as LucideIcon) || Icons.Inbox;

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-200 rounded-2xl bg-white max-w-lg mx-auto my-6 animate-in fade-in duration-300">
      <div className="bg-emerald-50 text-emerald-600 p-4 rounded-full mb-4 border border-emerald-100">
        <IconComponent className="h-10 w-10" />
      </div>
      <h3 className="text-lg font-bold text-slate-800 tracking-tight">{title}</h3>
      <p className="text-sm text-slate-500 mt-2 leading-relaxed max-w-sm">{description}</p>
      {actionText && onActionClick && (
        <div className="mt-6">
          <Button variant="primary" onClick={onActionClick}>
            {actionText}
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
