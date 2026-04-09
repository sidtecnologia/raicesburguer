import { useState } from 'react';
import { Trash2, ArrowRight, ClipboardList } from 'lucide-react';
import Modal from './ui/Modal';
import { useShop } from '../context/ShopContext';
import { formatMoney } from '../utils/format';

const CartModal = ({ isOpen, onClose, onCheckout }) => {
  const { cart, updateCartQty, removeFromCart } = useShop();
  const [observation, setObservation] = useState('');
  
  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handleCheckout = () => {
    onClose();
    onCheckout(observation);
  };

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
          <div className="max-h-[280px] overflow-y-auto pr-1 space-y-3 mb-4">
            {cart.map(item => (
              <div
                key={item.id}
                className="flex gap-3 items-center p-3 rounded-2xl"
                style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}
              >
                <img
                  src={Array.isArray(item.image) ? item.image[0] : (item.image || '/img/placeholder.png')}
                  alt={item.name}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm truncate" style={{ color: 'var(--text)' }}>{item.name}</h4>
                  <p className="text-xs font-medium" style={{ color: 'var(--accent)' }}>${formatMoney(item.price)}</p>
                </div>
                
                <div className="flex items-center gap-2">
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
                  <button onClick={() => removeFromCart(item.id)} className="ml-1 p-1 rounded-full transition-colors" style={{ color: 'var(--text-muted)' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-4 space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Observaciones del pedido</p>
            <div className="relative">
              <textarea
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                className="w-full p-4 pl-11 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-400/50 transition-colors resize-none text-sm"
                placeholder="Ej: Sin cebolla, salsas aparte, portería..."
                rows="2"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              />
              <ClipboardList size={18} className="absolute top-4 left-4 text-white/20" />
            </div>
          </div>

          <div className="pt-4" style={{ borderTop: '1px solid var(--border)' }}>
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold" style={{ color: 'var(--text-muted)' }}>Total</span>
              <span className="display text-3xl" style={{ color: 'var(--accent)' }}>${formatMoney(total)}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="btn-primary w-full flex items-center justify-center gap-2 py-4 bg-amber-400 text-black font-black uppercase tracking-widest rounded-2xl transition-transform active:scale-95"
            >
              <span>Ir a datos de entrega</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default CartModal;