import { useState } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import MenuFeed from './components/MenuFeed';
import CartModal from './components/CartModal';
import CheckoutModal from './components/CheckoutModal';
import SuccessModal from './components/SuccessModal';
import Toasts from './components/Toast';
import InstallPrompt from './components/InstallPrompt';
import { ShoppingBag, Loader2 } from 'lucide-react';
import { BUSINESS_CONFIG } from './config/businessConfig';

const StoreContent = () => {
  const { products, loading, addToCart, cart } = useShop();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [successOrder, setSuccessOrder] = useState(null);
  const [orderObservation, setOrderObservation] = useState('');

  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);

  if (loading) return (
    <div className="h-dvh flex items-center justify-center bg-[#0a0806]">
      <Loader2 className="animate-spin text-amber-400 w-10 h-10" />
    </div>
  );

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#0a0806]" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <header
        className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-6 pt-8 pb-6"
        style={{ background: 'linear-gradient(to bottom, rgba(10,8,6,1) 0%, rgba(10,8,6,0) 100%)' }}
      >
        <div className="flex flex-col">
          <h1 className="display text-4xl leading-none text-white tracking-tighter">
            {BUSINESS_CONFIG.name.split(' ')[0]}
            <span style={{ color: 'var(--accent)' }}>{BUSINESS_CONFIG.name.split(' ')[1]}</span>
          </h1>
          <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold mt-1">Cocina Oculta</span>
        </div>

        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl transition-all active:scale-90"
        >
          <ShoppingBag size={24} className="text-white -translate-x-1" />
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