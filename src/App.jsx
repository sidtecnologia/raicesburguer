import { useState, useMemo, useEffect } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import CartModal from './components/CartModal';
import CheckoutModal from './components/CheckoutModal';
import SuccessModal from './components/SuccessModal';
import BusinessModal from './components/BusinessModal';
import InstallPrompt from './components/InstallPrompt';
import BannerCarousel from './components/BannerCarousel';
import Toasts from './components/Toast';
import { Loader2 } from 'lucide-react';

const shuffleArray = (arr) => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const Categories = ({ categories, selected, onSelect }) => (
  <div className="flex gap-3 overflow-x-auto pb-4 pt-2 px-4 scrollbar-hide">
  <button
  onClick={() => onSelect('Todo')}
  className={`flex-shrink-0 flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm transition-all ${selected === 'Todo' ? 'bg-primary text-white border-primary shadow-md' : 'bg-white border-gray-200'}`}
  >
  <span className="font-semibold">Todo</span>
  </button>
  {categories.map(cat => (
    <button
    key={cat}
    onClick={() => onSelect(cat)}
    className={`flex-shrink-0 flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm transition-all ${selected === cat ? 'bg-primary text-white border-primary shadow-md' : 'bg-white border-gray-200'}`}
    >
    <span className="font-semibold whitespace-nowrap">{cat}</span>
    </button>
  ))}
  </div>
);

const StoreContent = () => {
  const { products, loading, error } = useShop();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todo');
  const [activeProduct, setActiveProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [successOrder, setSuccessOrder] = useState(null);

  useEffect(() => {
    const pendingId = localStorage.getItem('pending_product_id');
    if (pendingId) {
      setTimeout(() => {
        const element = document.getElementById(`product-${pendingId}`);
        if (element) element.click();
        localStorage.removeItem('pending_product_id');
      }, 1000);
    }
  }, [products]);

  const categories = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category))];
    return cats.filter(Boolean);
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'Todo' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const featuredBase = useMemo(() => products.filter(p => p.featured), [products]);
  const [featured, setFeatured] = useState(() => shuffleArray(featuredBase));

  useMemo(() => {
    setFeatured(shuffleArray(featuredBase));
  }, [products.length]);

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'Todo') {
      setFeatured(prev => shuffleArray(featuredBase));
    }
  };

  const offers = useMemo(() => products.filter(p => p.isOffer), [products]);

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center gap-4 text-primary">
    <Loader2 className="animate-spin w-12 h-12" />
    <p className="font-semibold animate-pulse">Cargando menú...</p>
    </div>
  );

  if (error) return <div className="p-8 text-center text-red-500 font-bold">Error: {error}</div>;

  const showSections = searchTerm === '' && selectedCategory === 'Todo';

  return (
    <div className="min-h-screen pb-20">
    <Navbar onSearch={setSearchTerm} onOpenCart={() => setIsCartOpen(true)} />

    <main className="max-w-6xl mx-auto px-3 py-4">
    <BannerCarousel images={['...']} />

    <Categories
    categories={categories}
    selected={selectedCategory}
    onSelect={handleSelectCategory}
    />

    <div className="mt-4">
    {showSections ? (
      <>
      {featured.length > 0 && (
        <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
        <span className="w-1.5 h-6 bg-primary rounded-full"></span>
        Destacados
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {featured.map(p => (
          <div id={`product-${p.id}`} key={p.id}>
            <ProductCard product={p} onClick={setActiveProduct} />
          </div>
        ))}
        </div>
        </section>
      )}

      {offers.length > 0 && (
        <section>
        <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
        <span className="w-1.5 h-6 bg-yellow-400 rounded-full"></span>
        Ofertas
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {offers.map(p => (
          <div id={`product-${p.id}`} key={p.id}>
            <ProductCard product={p} onClick={setActiveProduct} />
          </div>
        ))}
        </div>
        </section>
      )}
      </>
    ) : (
      <section>
      <h2 className="text-lg font-bold mb-4 text-gray-700">Resultados ({filteredProducts.length})</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {filteredProducts.map(p => (
        <div id={`product-${p.id}`} key={p.id}>
          <ProductCard product={p} onClick={setActiveProduct} />
        </div>
      ))}
      </div>
      </section>
    )}
    </div>
    </main>

    <ProductModal
    product={activeProduct}
    isOpen={!!activeProduct}
    onClose={() => setActiveProduct(null)}
    />
    
    {/* Resto de modales... */}
    </div>
  );
};

const App = () => (
  <ShopProvider>
  <StoreContent />
  </ShopProvider>
);

export default App;