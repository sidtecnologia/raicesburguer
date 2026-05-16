import { useState, useMemo } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import MenuFeed from './components/MenuFeed';
import CartModal from './components/CartModal';
import CheckoutModal from './components/CheckoutModal';
import SuccessModal from './components/SuccessModal';
import BusinessInfoModal from './components/BusinessInfoModal';
import Toasts from './components/Toast';
import InstallPrompt from './components/InstallPrompt';
import { ShoppingBag, Loader2 } from 'lucide-react';
import { BUSINESS_CONFIG, isBusinessOpen } from './config/businessConfig';

const StoreContent = () => {
  const { products, loading, error, addToCart, cart } = useShop();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [successOrder, setSuccessOrder] = useState(null);
  const [orderObservation, setOrderObservation] = useState('');

  const targetProductId = useMemo(() => {
    const p = new URLSearchParams(window.location.search).get('p');
    return p || null;
  }, []);

  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);
  const open = isBusinessOpen();

  if (loading) return (
    <div className="h-dvh flex items-center justify-center bg-[#0a0806]">
      <Loader2 className="animate-spin text-amber-400 w-10 h-10" />
    </div>
  );

  if (error) return (
    <div className="h-dvh flex flex-col items-center justify-center bg-[#0a0806] gap-4 px-8 text-center">
      <div className="w-16 h-16 rounded-full flex items-center justify-center bg-red-500/10 border border-red-500/20">
        <span className="text-red-400 text-2xl">!</span>
      </div>
      <h2 className="display text-3xl text-white">Sin conexión</h2>
      <p className="text-sm text-white/40 max-w-xs">No se pudo cargar el menú. Revisa tu conexión a internet e intenta de nuevo.</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-2 px-6 py-3 rounded-xl bg-amber-400 text-black font-black text-xs uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all cursor-pointer"
      >
        Reintentar
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#0a0806]">
      <header
        className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-6 pt-6 pb-6 md:px-10 md:pt-8"
        style={{ background: 'linear-gradient(to bottom, rgba(10,8,6,1) 0%, rgba(10,8,6,0) 100%)' }}
      >
        <div className="flex flex-col">
          <h1 className="display text-4xl md:text-5xl leading-none text-white tracking-tighter">
            {BUSINESS_CONFIG.nameParts.main}
            <span style={{ color: 'var(--accent)' }}>{BUSINESS_CONFIG.nameParts.accent}</span>
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">{BUSINESS_CONFIG.slogan}</span>
            <span
              className="px-1.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest"
              style={{
                background: open ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
                color: open ? '#4ade80' : '#f87171',
                border: `1px solid ${open ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`
              }}
            >
              {open ? '● Abierto' : '● Cerrado'}
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl transition-all hover:bg-white/10 hover:border-white/20 active:scale-90 cursor-pointer"
          aria-label={`Ver carrito${cartCount > 0 ? `, ${cartCount} productos` : ''}`}
        >
          <ShoppingBag size={24} className="text-white -translate-x-0.5" />
          {cartCount > 0 && (
            <span
              className="absolute -top-1.5 -right-1.5 w-7 h-7 flex items-center justify-center rounded-full text-xs font-black shadow-2xl animate-pulse"
              style={{ background: 'var(--accent)', color: 'var(--bg)' }}
            >
              {cartCount}
            </span>
          )}
        </button>
      </header>

      <div className="absolute inset-0 z-10">
        <MenuFeed
          products={products}
          onAdd={(p) => addToCart(p, 1, '')}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenInfo={() => setIsInfoOpen(true)}
          targetProductId={targetProductId}
        />
      </div>

      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={(obs) => {
          setOrderObservation(obs);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSuccess={setSuccessOrder}
        observation={orderObservation}
      />

      <SuccessModal
        isOpen={!!successOrder}
        onClose={() => setSuccessOrder(null)}
        orderDetails={successOrder}
      />

      <BusinessInfoModal
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
      />

      <InstallPrompt />
      <Toasts />
    </div>
  );
};

const App = () => {
  return (
    <ShopProvider>
      <StoreContent />
    </ShopProvider>
  );
};

export default App;