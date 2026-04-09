import { Trash2, ArrowRight } from 'lucide-react';
import Modal from './ui/Modal';
import { useShop } from '../context/ShopContext';
import { formatMoney } from '../utils/format';

const CartModal = ({ isOpen, onClose, onCheckout }) => {
  const { cart, updateCartQty, removeFromCart } = useShop();
  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tu Pedido">
      {cart.length === 0 ? (
        <div className="text-center py-10" style={{ color: 'var(--text-muted)' }}>
          <p className="mb-1">Tu pedido está vacío.</p>
          <button onClick={onClose} className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>
            Ver menú
          </button>
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="max-h-[320px] overflow-y-auto pr-1 space-y-3 mb-4">
            {cart.map(item => (
              <div
                key={item.id}
                className="flex gap-3 items-center p-3 rounded-2xl"
                style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}
              >
                <img
                  src={Array.isArray(item.image) ? item.image[0] : (item.image || '/img/placeholder.png')}
                  alt={item.name}
                  className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate" style={{ color: 'var(--text)' }}>{item.name}</p>
                  <p className="price-tag text-base">${formatMoney(item.price * item.qty)}</p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => updateCartQty(item.id, -1)}
                    className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-lg"
                    style={{ background: 'var(--border)', color: 'var(--text)' }}
                  >
                    -
                  </button>
                  <span className="w-5 text-center font-bold text-sm">{item.qty}</span>
                  <button
                    onClick={() => updateCartQty(item.id, 1)}
                    className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-lg"
                    style={{ background: 'var(--border)', color: 'var(--text)' }}
                  >
                    +
                  </button>
                  <button onClick={() => removeFromCart(item.id)} className="ml-1 p-1 rounded-full transition-colors" style={{ color: 'var(--text-muted)' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4" style={{ borderTop: '1px solid var(--border)' }}>
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold" style={{ color: 'var(--text-muted)' }}>Total</span>
              <span className="display text-3xl" style={{ color: 'var(--accent)' }}>${formatMoney(total)}</span>
            </div>
            <button
              onClick={() => { onClose(); onCheckout(); }}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <span>Confirmar Pedido</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default CartModal;
