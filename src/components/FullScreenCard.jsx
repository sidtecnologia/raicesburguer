import { useState, useEffect } from 'react';
import { ShoppingBag, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { formatMoney } from '../utils/format';

const FullScreenCard = ({ product, onAdd, index, total, onSectionChange, sections, activeSection }) => {
  const [added, setAdded] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [imgKey, setImgKey] = useState(0);

  const DESC_LIMIT = 85;
  const isLong = product.description?.length > DESC_LIMIT;

  useEffect(() => {
    // Al cambiar de producto, cambiamos el key de la imagen para que solo ella se anime
    setImgKey(prev => prev + 1);
    setIsExpanded(false);
  }, [product.id]);

  const handleAdd = () => {
    if (added) return;
    onAdd(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* CAPA DE IMAGEN: Única con animación */}
      <div className="absolute inset-0 bg-[#0a0806]">
        <img
          key={imgKey}
          src={Array.isArray(product.image) ? product.image[0] : (product.image || '/img/placeholder.png')}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover animate-image-entry"
        />
      </div>

      {/* OVERLAY ESTÁTICO */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0806] via-[#0a0806]/40 to-transparent" />

      {/* CONTENIDO TEXTUAL: Sin animaciones de transición de entrada para mantenerlo fijo */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-6 pb-8">
        <div className="mb-4">
          <h2 className="display text-4xl leading-tight mb-1 text-white">{product.name}</h2>
          <p className="display text-3xl" style={{ color: 'var(--accent)' }}>${formatMoney(product.price)}</p>
        </div>

        <div className="mb-5">
          <p className="text-sm text-white/70 leading-relaxed inline">
            {isExpanded ? product.description : `${product.description.substring(0, DESC_LIMIT)}${isLong ? '...' : ''}`}
          </p>
          {isLong && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="ml-2 text-xs font-bold uppercase tracking-widest inline-flex items-center gap-1 text-amber-400"
            >
              {isExpanded ? <>Menos <ChevronUp size={12}/></> : <>Ver más <ChevronDown size={12}/></>}
            </button>
          )}
        </div>

        <button
          onClick={handleAdd}
          className="w-full py-4 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 active:scale-95 shadow-xl"
          style={{ background: added ? '#22c55e' : 'var(--accent)', color: 'var(--bg)', fontWeight: '800' }}
        >
          {added ? <><Check size={20} /> ¡Añadido!</> : <><ShoppingBag size={20} /> Añadir al pedido</>}
        </button>

        <div className="flex gap-2 mt-4">
          {sections.map(s => (
            <button
              key={s.key}
              onClick={() => onSectionChange(s.key)}
              className="flex-1 py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all"
              style={activeSection === s.key 
                ? { background: 'var(--accent)', color: 'var(--bg)' } 
                : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(10px)' }
              }
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes imageEntry {
          from { opacity: 0; transform: scale(1.1); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-image-entry {
          animation: imageEntry 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}} />
    </div>
  );
};

export default FullScreenCard;