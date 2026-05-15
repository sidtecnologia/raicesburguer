import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import FullScreenCard from './FullScreenCard';
import { Droplets, ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight } from 'lucide-react';

const MenuFeed = ({ products, onAdd }) => {
  const [activeSection, setActiveSection] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showUpsell, setShowUpsell] = useState(false);
  const [hasNavigated, setHasNavigated] = useState(false);
  const [upsellDisabled, setUpsellDisabled] = useState(false);
  const containerRef = useRef(null);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

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

  const currentProducts = activeSection && groupedProducts[activeSection]
    ? groupedProducts[activeSection]
    : [];

  const navigate = useCallback((dir) => {
    if (currentProducts.length === 0) return;
    setCurrentIndex(prev => (prev + dir + currentProducts.length) % currentProducts.length);
    setHasNavigated(true);
  }, [currentProducts.length]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onStart = (e) => {
      if (e.target.closest('[data-cat-bar]')) return;
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    };

    const onEnd = (e) => {
      if (touchStartX.current === null) return;
      const dx = touchStartX.current - e.changedTouches[0].clientX;
      const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
      if (Math.abs(dx) > 50 && Math.abs(dx) > dy) {
        navigate(dx > 0 ? 1 : -1);
      }
      touchStartX.current = null;
      touchStartY.current = null;
    };

    el.addEventListener('touchstart', onStart, { passive: true });
    el.addEventListener('touchend', onEnd, { passive: true });
    return () => {
      el.removeEventListener('touchstart', onStart);
      el.removeEventListener('touchend', onEnd);
    };
  }, [navigate]);

  const handleAddWithUpsell = (product) => {
    onAdd(product);
    const isDrink = /bebida|jugo|gaseosa|tomar/i.test(product.category);
    if (!isDrink && !upsellDisabled) {
      setTimeout(() => setShowUpsell(true), 2100);
    }
  };

  const handleDeclineUpsell = () => {
    setShowUpsell(false);
    setUpsellDisabled(true);
  };

  if (currentProducts.length === 0) return null;

  return (
    <div ref={containerRef} className="relative w-full h-full">
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

      {currentProducts.length > 1 && (
        <>
          <button
            onClick={() => navigate(-1)}
            aria-label="Anterior"
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 items-center justify-center rounded-full bg-black/40 border border-white/10 backdrop-blur-md text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={() => navigate(1)}
            aria-label="Siguiente"
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 items-center justify-center rounded-full bg-black/40 border border-white/10 backdrop-blur-md text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}

      {!hasNavigated && (
        <div className="absolute bottom-36 left-0 right-0 flex justify-center pointer-events-none z-20">
          <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-black/40 border border-white/10 backdrop-blur-md">
            <ChevronsLeft className="text-amber-400 animate-pulse" size={16} />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white md:hidden">Desliza</span>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white hidden md:block">← → para navegar</span>
            <ChevronsRight className="text-amber-400 animate-pulse" size={16} />
          </div>
        </div>
      )}

      {showUpsell && (
        <div className="absolute inset-0 z-[150] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-5">
          <div className="w-full max-w-sm pb-8 animate-pop-in text-center">
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
                className="w-full py-4 bg-amber-400 rounded-2xl font-black text-black uppercase tracking-widest text-xs transition-all hover:brightness-110 active:scale-95"
              >
                Ver Bebidas
              </button>
              <button
                onClick={handleDeclineUpsell}
                className="w-full py-2 text-[9px] font-bold text-white/20 uppercase tracking-[0.3em] hover:text-white/40 transition-colors active:opacity-60"
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