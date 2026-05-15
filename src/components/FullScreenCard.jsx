import { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Check, XCircle, ChevronRight } from 'lucide-react';
import { formatMoney } from '../utils/format';

const FullScreenCard = ({ product, onAdd, onSectionChange, sections, activeSection, index, total, onOpenInfo }) => {
  const [added, setAdded] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showNextCat, setShowNextCat] = useState(false);
  const catScrollRef = useRef(null);

  const isOutOfStock = (product.stock ?? 0) <= 0;
  const DESC_LIMIT = 75;
  const isLong = product.description?.length > DESC_LIMIT;

  useEffect(() => {
    setIsExpanded(false);
    setAdded(false);
  }, [product.id]);

  const checkCatScroll = () => {
    const el = catScrollRef.current;
    if (!el) return;
    setShowNextCat(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    checkCatScroll();
    const el = catScrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkCatScroll, { passive: true });
    window.addEventListener('resize', checkCatScroll);
    return () => {
      el.removeEventListener('scroll', checkCatScroll);
      window.removeEventListener('resize', checkCatScroll);
    };
  }, [sections]);

  const handleAdd = () => {
    if (added || isOutOfStock) return;
    onAdd(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div className="absolute inset-0 bg-[#0a0806]">
        <img
          src={Array.isArray(product.image) ? product.image[0] : (product.image || '/img/placeholder.png')}
          alt={product.name}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 image-entry ${isOutOfStock ? 'opacity-30 grayscale' : ''}`}
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0806] via-[#0a0806]/30 to-transparent" />
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
              {total > 1 && (
                <span className="ml-auto text-[9px] font-bold text-white/20 uppercase tracking-widest">
                  {index + 1} / {total}
                </span>
              )}
            </div>
            <h2 className="display text-3xl md:text-4xl text-white leading-none uppercase tracking-tighter">{product.name}</h2>
          </div>
          <div className="text-right pl-4">
            <p className="display text-2xl md:text-3xl text-amber-400">${formatMoney(product.price)}</p>
          </div>
        </div>

        <div className="relative mb-4">
          <p className={`text-xs leading-snug text-white/60 transition-all duration-300 ${!isExpanded && isLong ? 'line-clamp-2' : ''}`}>
            {product.description}
          </p>
          {isLong && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[9px] font-bold uppercase tracking-widest text-amber-400 mt-1.5 hover:text-amber-300 transition-colors"
            >
              {isExpanded ? 'Ver menos' : 'Ver más'}
            </button>
          )}
        </div>

        <div className="space-y-2">
          <button
            onClick={handleAdd}
            disabled={isOutOfStock}
            className="w-full py-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 active:scale-95 disabled:opacity-50 hover:brightness-110 cursor-pointer disabled:cursor-not-allowed"
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

          <div className="relative flex items-center gap-1" data-cat-bar>
            <div
              ref={catScrollRef}
              className="flex gap-1.5 overflow-x-auto scrollbar-hide flex-1 pb-1"
              style={{ touchAction: 'pan-x', WebkitOverflowScrolling: 'touch' }}
            >
              {sections.map(s => (
                <button
                  key={s.key}
                  onClick={() => onSectionChange(s.key)}
                  className="flex-shrink-0 py-3 px-4 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all border hover:brightness-110 cursor-pointer"
                  style={activeSection === s.key
                    ? { background: 'var(--accent)', color: 'var(--bg)', borderColor: 'var(--accent)' }
                    : { background: 'rgba(255,255,255,0.02)', color: 'rgba(255,255,255,0.3)', borderColor: 'rgba(255,255,255,0.05)' }
                  }
                >
                  {s.label}
                </button>
              ))}
            </div>

            <button
              className={`flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-all ${showNextCat ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            >
              <ChevronRight size={14} />
            </button>
          </div>

          <button
            onClick={onOpenInfo}
            className="w-full py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all hover:bg-white/5 active:scale-95"
            style={{ color: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            Información del negocio
          </button>
        </div>
      </div>
    </div>
  );
};

export default FullScreenCard;