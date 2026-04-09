import { ShoppingBag } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const Navbar = ({ onOpenCart }) => {
  const { cart } = useShop();
  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);

  return (
    <nav
      className="sticky top-0 z-40 px-4 py-3 flex items-center justify-between"
      style={{
        background: 'rgba(15,13,11,0.92)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl overflow-hidden" style={{ background: 'var(--surface2)' }}>
          <img
            src="/img/favicon.png"
            alt="Logo"
            className="w-full h-full object-cover"
            onError={e => e.target.style.display = 'none'}
          />
        </div>
        <span className="display text-2xl" style={{ color: 'var(--accent)' }}>Raíces Burger</span>
      </div>

      <button
        onClick={onOpenCart}
        className="relative p-2.5 rounded-full transition-all active:scale-90"
        style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}
      >
        <ShoppingBag size={20} style={{ color: 'var(--text)' }} />
        {cartCount > 0 && (
          <span
            className="absolute -top-1 -right-1 text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full"
            style={{ background: 'var(--accent)', color: 'var(--bg)' }}
          >
            {cartCount}
          </span>
        )}
      </button>
    </nav>
  );
};

export default Navbar;
