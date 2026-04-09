import { useShop } from '../context/ShopContext';
import { CheckCircle2, XCircle, X } from 'lucide-react';

const Toasts = () => {
  const { toasts, removeToast } = useShop();
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-[90%] max-w-sm">
      {toasts.map(t => (
        <div
          key={t.id}
          className="flex items-center gap-3 px-4 py-3 rounded-2xl animate-slide-up"
          style={{
            background: 'var(--surface2)',
            border: '1px solid var(--border)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          }}
          role="status"
        >
          {t.type === 'error'
            ? <XCircle size={18} className="text-red-400 flex-shrink-0" />
            : <CheckCircle2 size={18} style={{ color: 'var(--accent)', flexShrink: 0 }} />
          }
          <p className="flex-1 text-sm font-medium" style={{ color: 'var(--text)' }}>{t.message}</p>
          <button
            onClick={() => removeToast(t.id)}
            className="p-1 rounded-full transition-colors"
            style={{ color: 'var(--text-muted)' }}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toasts;
