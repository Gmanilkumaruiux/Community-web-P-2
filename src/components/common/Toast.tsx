import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNotification } from '../../context/NotificationContext';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastNotification: React.FC = () => {
  const { toasts, removeToast } = useNotification();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-rose-600 shrink-0" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />;
      default:
        return <Info className="h-5 w-5 text-blue-500 shrink-0" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-emerald-50 border-emerald-100 text-emerald-930';
      case 'error':
        return 'bg-rose-50 border-rose-100 text-rose-930';
      case 'warning':
        return 'bg-amber-50 border-amber-100 text-amber-930';
      default:
        return 'bg-blue-50 border-blue-100 text-blue-930';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm px-4 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.15 } }}
            className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg pointer-events-auto ${getBgColor(toast.type)}`}
          >
            {getIcon(toast.type)}
            <div className="flex-1 text-sm font-medium pr-2 whitespace-pre-line leading-relaxed">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 rounded-md hover:bg-slate-100/50 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastNotification;
