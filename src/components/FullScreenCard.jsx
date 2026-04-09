import { useState, useEffect } from 'react';
import { ShoppingBag, Check, XCircle } from 'lucide-react';
import { formatMoney } from '../utils/format';

const FullScreenCard = ({ product, onAdd, onSectionChange, sections, activeSection }) => {
  const [added, setAdded] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [imgKey, setImgKey] = useState(0);

  const isOutOfStock = (product.stock ?? 0) <= 0;
  const DESC_LIMIT = 75;
  const isLong = product.description?.length > DESC_LIMIT;

  useEffect(() => {
    setImgKey(prev => prev + 1);
    setIsExpanded(false);
    setAdded(false);
  }, [product.id]);

  const handleAdd = () => {
    if (added || isOutOfStock) return;
    onAdd(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <div className="absolute inset-0 bg-[#0a0806]">
        <img
          key={imgKey}
          src={Array.isArray(product.image) ? product.image[0] : (product.image || '/img/placeholder.png')}
          alt={product.name}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${isOutOfStock ? 'opacity-30 grayscale' : 'opacity-90'}`}
          style={{ animation: 'imageEntry 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0806] via-[#0a0806]/60 to-transparent" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-5 pb-6">
        <div className="flex justify-between items-end mb-1">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="px-1.5 py-0.5 rounded bg-amber-400/10 border border-amber-400/20 text-amber-400 text-[9px] font-black uppercase tracking-widest">
                {product.category}
              </span>
              {isOutOfStock && (
                <span className="px-1.5 py-0.5 rounded bg-red-500/20 border border-red-500/30 text-red-400 text-[9px] font-black uppercase tracking-widest">
                  Agotado
                </span>
              )}
            </div>
            <h2 className="display text-3xl text-white leading-none uppercase tracking-tighter">{product.name}</h2>
          </div>
          <div className="text-right pl-4">
            <p className="display text-2xl text-amber-400">${formatMoney(product.price)}</p>
          </div>
        </div>

        <div className="relative mb-4">
          <p className={`text-xs leading-snug text-white/60 transition-all duration-300 ${!isExpanded && isLong ? 'line-clamp-2' : ''}`}>
            {product.description}
          </p>
          {isLong && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[9px] font-bold uppercase tracking-widest text-amber-400 mt-1.5"
            >
              {isExpanded ? 'Ver menos' : 'Ver más'}
            </button>
          )}
        </div>

        <div className="space-y-2">
          <button
            onClick={handleAdd}
            disabled={isOutOfStock}
            className="w-full py-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 active:scale-95 disabled:opacity-50"
            style={{ 
              background: isOutOfStock ? '#222' : (added ? '#15803d' : 'var(--accent)'), 
              color: isOutOfStock ? '#555' : 'var(--bg)', 
              fontWeight: '900',
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.15em'
            }}
          >
            {isOutOfStock ? (
              <><XCircle size={16} /> Agotado</>
            ) : added ? (
              <><Check size={16} /> ¡Agregado!</>
            ) : (
              <><ShoppingBag size={16} /> Agregar al pedido</>
            )}
          </button>

          <div className="flex gap-1.5">
            {sections.map(s => (
              <button
                key={s.key}
                onClick={() => onSectionChange(s.key)}
                className="flex-1 py-3 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all border"
                style={activeSection === s.key 
                  ? { background: 'var(--accent)', color: 'var(--bg)', borderColor: 'var(--accent)' } 
                  : { background: 'rgba(255,255,255,0.02)', color: 'rgba(255,255,255,0.3)', borderColor: 'rgba(255,255,255,0.05)' }
                }
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes imageEntry {
          from { opacity: 0; transform: scale(1.05); }
          to { opacity: 0.9; transform: scale(1); }
        }
      `}} />
    </div>
  );
};

export default FullScreenCard;