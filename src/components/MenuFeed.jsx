import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import FullScreenCard from './FullScreenCard';
import { Droplets, ChevronsLeft, ChevronsRight } from 'lucide-react';

const MenuFeed = ({ products, onAdd }) => {
  const [activeSection, setActiveSection] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showUpsell, setShowUpsell] = useState(false);
  const [hasSwiped, setHasSwiped] = useState(false);
  const [upsellDisabled, setUpsellDisabled] = useState(false);
  const touchStartX = useRef(null);

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

  useEffect(() => {
    if (sections.length > 0 && !activeSection) {
      setActiveSection(sections[0].key);
    }
  }, [sections, activeSection]);

  const currentProducts = activeSection && groupedProducts[activeSection] ? groupedProducts[activeSection] : [];

  const navigate = useCallback((dir) => {
    if (currentProducts.length === 0) return;
    setCurrentIndex(prev => (prev + dir + currentProducts.length) % currentProducts.length);
    setHasSwiped(true);
  }, [currentProducts.length]);

  const handleAddWithUpsell = (product) => {
    onAdd(product);
    const isDrink = /bebida|jugo|gaseosa|tomar/i.test(product.category);
    
    if (!isDrink && !upsellDisabled) {
      setTimeout(() => {
        setShowUpsell(true);
      }, 2100);
    }
  };

  const handleDeclineUpsell = () => {
    setShowUpsell(false);
    setUpsellDisabled(true);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 50) {
      navigate(diff > 0 ? 1 : -1);
    }
    touchStartX.current = null;
  };

  if (currentProducts.length === 0) return null;

  return (
    <div className="relative w-full h-full" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <FullScreenCard
        key={currentProducts[currentIndex].id}
        product={currentProducts[currentIndex]}
        onAdd={handleAddWithUpsell}
        index={currentIndex}
        total={currentProducts.length}
        sections={sections}
        activeSection={activeSection}
        onSectionChange={(key) => {
          setActiveSection(key);
          setCurrentIndex(0);
        }}
      />

      {!hasSwiped && (
        <div className="absolute bottom-36 left-0 right-0 flex justify-center pointer-events-none">
          <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-black/40 border border-white/10 backdrop-blur-md">
            <ChevronsLeft className="text-amber-400 animate-pulse" size={16} />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white">Desliza</span>
            <ChevronsRight className="text-amber-400 animate-pulse" size={16} />
          </div>
        </div>
      )}

      {showUpsell && (
        <div className="absolute inset-0 z-[150] bg-black/95 backdrop-blur-2xl flex items-end p-5">
          <div className="w-full pb-8 animate-in slide-in-from-bottom-10 duration-500 text-center">
            <Droplets size={42} className="text-amber-400 mx-auto mb-3" />
            <h3 className="display text-3xl text-white mb-1 uppercase tracking-tight">¿Algo de tomar?</h3>
            <p className="text-xs text-white/40 mb-8 max-w-[200px] mx-auto">Acompaña tu elección con una bebida fría.</p>
            <div className="space-y-3">
              <button 
                onClick={() => { 
                  setShowUpsell(false); 
                  const drinksSection = sections.find(s => /bebida/i.test(s.key))?.key;
                  if (drinksSection) {
                    setActiveSection(drinksSection);
                    setCurrentIndex(0);
                  }
                }}
                className="w-full py-4 bg-amber-400 rounded-2xl font-black text-black uppercase tracking-widest text-xs active:scale-95 transition-transform"
              >
                Ver Bebidas
              </button>
              <button 
                onClick={handleDeclineUpsell} 
                className="w-full py-2 text-[9px] font-bold text-white/20 uppercase tracking-[0.3em] active:opacity-60"
              >
                No, gracias
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuFeed;