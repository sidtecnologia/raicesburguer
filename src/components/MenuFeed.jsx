import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import FullScreenCard from './FullScreenCard';
import { Droplets, ChevronsLeft, ChevronsRight } from 'lucide-react';

const MenuFeed = ({ products, onAdd }) => {
  const groupedProducts = useMemo(() => {
    if (!products || products.length === 0) return {};
    return products.reduce((acc, product) => {
      const cat = product.category || 'Otros';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(product);
      return acc;
    }, {});
  }, [products]);

  const sections = useMemo(() => {
    return Object.keys(groupedProducts).map(cat => ({
      key: cat,
      label: cat.toUpperCase()
    }));
  }, [groupedProducts]);

  const [activeSection, setActiveSection] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showUpsell, setShowUpsell] = useState(false);
  const [hasSwiped, setHasSwiped] = useState(false);
  
  const lastScroll = useRef(0);
  const touchStartX = useRef(null);

  useEffect(() => {
    if (sections.length > 0 && !activeSection) {
      setActiveSection(sections[0].key);
    }
  }, [sections, activeSection]);

  const currentProducts = activeSection && groupedProducts[activeSection] ? groupedProducts[activeSection] : [];

  const navigate = useCallback((dir) => {
    if (currentProducts.length === 0) return;
    const now = Date.now();
    if (now - lastScroll.current < 600) return;
    lastScroll.current = now;
    setCurrentIndex(prev => (prev + dir + currentProducts.length) % currentProducts.length);
  }, [currentProducts.length]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (!touchStartX.current) return;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchStartX.current - touchEndX;
    
    if (deltaX > 50) {
      navigate(1);
      if(!hasSwiped) setHasSwiped(true);
    } else if (deltaX < -50) {
      navigate(-1);
      if(!hasSwiped) setHasSwiped(true);
    }
    touchStartX.current = null;
  };

  const handleAdd = (p) => {
    onAdd(p);
    const hasDrinks = sections.find(s => /bebida/i.test(s.key));
    if (hasDrinks && !/bebida/i.test(activeSection)) {
      setTimeout(() => setShowUpsell(true), 600);
    }
  };

  if (!currentProducts.length) return null;

  return (
    <div 
      className="relative w-full h-full"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <FullScreenCard
        product={currentProducts[currentIndex]}
        onAdd={handleAdd}
        index={currentIndex}
        total={currentProducts.length}
        onSectionChange={key => { setActiveSection(key); setCurrentIndex(0); }}
        sections={sections}
        activeSection={activeSection}
      />

      {!hasSwiped && currentProducts.length > 1 && (
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-center items-center pointer-events-none z-30 opacity-80">
          <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-black/60 backdrop-blur-md border border-white/10 animate-pulse">
            <ChevronsLeft className="text-amber-400" size={24} />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-white">Desliza</span>
            <ChevronsRight className="text-amber-400" size={24} />
          </div>
        </div>
      )}

      {showUpsell && (
        <div className="absolute inset-0 z-[150] bg-black/90 backdrop-blur-xl flex items-center justify-center p-10 text-center">
          <div className="animate-in zoom-in-95 duration-300">
            <Droplets size={60} className="text-amber-400 mx-auto mb-4 animate-bounce" />
            <h3 className="display text-3xl text-white mb-2">¿Algo para tomar?</h3>
            <p className="text-sm text-white/50 mb-8">Acompaña tu pedido con una bebida fría.</p>
            <button 
              onClick={() => { 
                setShowUpsell(false); 
                const drinksSection = sections.find(s => /bebida/i.test(s.key))?.key;
                if (drinksSection) {
                  setActiveSection(drinksSection);
                  setCurrentIndex(0);
                }
              }}
              className="w-full py-4 bg-amber-400 rounded-2xl font-bold text-black mb-4"
            >
              Ver Bebidas
            </button>
            <button onClick={() => setShowUpsell(false)} className="text-xs text-white/30 font-bold uppercase">Más adelante</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuFeed;