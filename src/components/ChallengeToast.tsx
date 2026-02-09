import { useEffect } from 'react';
import { X, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'error' | 'success' | 'warning';
  onClose: () => void;
  duration?: number;
}

const ChallengeToast = ({ message, type, onClose, duration = 4000 }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    error: <AlertCircle className="w-5 h-5" />,
    success: <CheckCircle className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
  };

  const colors = {
    error: 'bg-red-500/90 text-white border-red-600',
    success: 'bg-green-500/90 text-white border-green-600',
    warning: 'bg-yellow-500/90 text-white border-yellow-600',
  };

  return (
    <div 
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-lg border-2 shadow-2xl backdrop-blur-sm animate-in slide-in-from-right-full ${colors[type]}`}
      style={{ minWidth: '300px', maxWidth: '500px' }}
    >
      <div className="flex-shrink-0">
        {icons[type]}
      </div>
      <p className="flex-1 font-medium text-sm">{message}</p>
      <button
        onClick={onClose}
        className="flex-shrink-0 hover:opacity-70 transition-opacity"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ChallengeToast;
