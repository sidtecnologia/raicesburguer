import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import FullScreenCard from './FullScreenCard';
import { Droplets } from 'lucide-react';

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
  const lastScroll = useRef(0);
  const touchStartY = useRef(null);

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
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (!touchStartY.current) return;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchStartY.current - touchEndY;
    
    if (deltaY > 50) {
      navigate(1);
    } else if (deltaY < -50) {
      navigate(-1);
    }
    touchStartY.current = null;
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
            <button onClick={() => setShowUpsell(false)} className="text-xs text-white/30 font-bold uppercase">Ahora no</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuFeed;