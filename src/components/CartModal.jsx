import { useState, useMemo } from 'react';
import { Trash2, ArrowRight, ClipboardList } from 'lucide-react';
import Modal from './ui/Modal';
import { useShop } from '../context/ShopContext';
import { formatMoney } from '../utils/format';

const EXTRAS_CATEGORIES = /^(adicional|adicionales|aderezo|aderezos)$/i;

const CartModal = ({ isOpen, onClose, onCheckout }) => {
  const { cart, updateCartQty, removeFromCart, addToCart, products } = useShop();
  const [observation, setObservation] = useState('');

  const extras = useMemo(() =>
    (products || []).filter(p => EXTRAS_CATEGORIES.test(p.category?.trim())),
    [products]
  );

  const extrasInCart = useMemo(() =>
    new Set(cart.filter(i => EXTRAS_CATEGORIES.test(i.category?.trim())).map(i => i.id)),
    [cart]
  );

  const mainCart = useMemo(() =>
    cart.filter(i => !EXTRAS_CATEGORIES.test(i.category?.trim())),
    [cart]
  );

  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handleToggleExtra = (extra) => {
    if (extrasInCart.has(extra.id)) {
      removeFromCart(extra.id);
    } else {
      addToCart(extra, 1);
    }
  };

  const handleCheckout = () => {
    onClose();
    onCheckout(observation);
  };

  const footer = (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="font-semibold text-sm" style={{ color: 'var(--text-muted)' }}>Total</span>
        <span className="display text-3xl" style={{ color: 'var(--accent)' }}>${formatMoney(total)}</span>
      </div>
      <button
        onClick={handleCheckout}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-black uppercase tracking-widest transition-transform active:scale-95 hover:brightness-110"
        style={{ background: 'var(--accent)' }}
      >
        <span>Ir a datos de entrega</span>
        <ArrowRight size={18} />
      </button>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tu Pedido" footer={cart.length > 0 ? footer : undefined}>
      {cart.length === 0 ? (
        <div className="text-center py-10" style={{ color: 'var(--text-muted)' }}>
          <p className="mb-1">Tu pedido está vacío.</p>
          <button onClick={onClose} className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>
            Ver menú
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="space-y-3">
            {mainCart.map(item => (
              <div
                key={item.id}
                className="flex gap-3 items-center p-3 rounded-2xl"
                style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}
              >
                <img
                  src={Array.isArray(item.image) ? item.image[0] : (item.image || '/img/placeholder.png')}
                  alt={item.name}
                  className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm truncate" style={{ color: 'var(--text)' }}>{item.name}</h4>
                  <p className="text-xs font-medium" style={{ color: 'var(--accent)' }}>${formatMoney(item.price)}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => updateCartQty(item.id, -1)}
                    className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-lg"
                    style={{ background: 'var(--border)', color: 'var(--text)' }}
                  >
                    -
                  </button>
                  <span className="w-5 text-center font-bold text-sm" style={{ color: 'var(--text)' }}>{item.qty}</span>
                  <button
                    onClick={() => updateCartQty(item.id, 1)}
                    className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-lg"
                    style={{ background: 'var(--border)', color: 'var(--text)' }}
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="ml-1 p-1 rounded-full transition-colors hover:text-red-400"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {extras.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">
                Adicionales y Aderezos
              </p>
              <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                {extras.map((extra, i) => {
                  const checked = extrasInCart.has(extra.id);
                  return (
                    <label
                      key={extra.id}
                      className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-white/5 select-none"
                      style={{
                        borderTop: i > 0 ? '1px solid var(--border)' : 'none',
                        background: checked ? 'rgba(232,184,75,0.06)' : 'transparent',
                      }}
                    >
                      <div
                        className="w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center transition-all"
                        style={{
                          background: checked ? 'var(--accent)' : 'rgba(255,255,255,0.05)',
                          border: `1.5px solid ${checked ? 'var(--accent)' : 'rgba(255,255,255,0.15)'}`,
                        }}
                      >
                        {checked && (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4L3.5 6.5L9 1" stroke="var(--bg)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleToggleExtra(extra)}
                        className="sr-only"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>{extra.name}</span>
                        {extra.description && (
                          <p className="text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>{extra.description}</p>
                        )}
                      </div>
                      <span className="text-sm font-black flex-shrink-0" style={{ color: extra.price > 0 ? 'var(--accent)' : 'var(--text-muted)' }}>
                        {extra.price > 0 ? `+$${formatMoney(extra.price)}` : 'Gratis'}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Observaciones del pedido</p>
            <div className="relative">
              <textarea
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                className="w-full p-4 pl-11 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-400/50 transition-colors resize-none text-sm"
                placeholder="Ej: Sin cebolla, salsas aparte, portería..."
                rows="2"
                style={{ WebkitOverflowScrolling: 'touch' }}
              />
              <ClipboardList size={18} className="absolute top-4 left-4 text-white/20" />
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default CartModal;