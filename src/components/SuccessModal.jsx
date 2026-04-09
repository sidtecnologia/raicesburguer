import { useState } from 'react';
import Modal from './ui/Modal';
import { CheckCircle } from 'lucide-react';
import { formatMoney } from '../utils/format';
import { useShop } from '../context/ShopContext';
import { BUSINESS_CONFIG } from '../config/businessConfig';

const SuccessModal = ({ isOpen, onClose, orderDetails }) => {
  const { confirmOrder, addToast } = useShop();
  const [loading, setLoading] = useState(false);

  if (!orderDetails) return null;

  const isMobile = () => /Android|iPhone|iPad|iPod|Windows Phone|IEMobile|Opera Mini/i.test(navigator.userAgent || '');

  const buildMessage = () => {
    const lines = [];
    lines.push(`*Nuevo Pedido - ${BUSINESS_CONFIG.name}*`);
    lines.push(``);
    lines.push(`*Cliente:* ${orderDetails.name}`);
    lines.push(`*Dirección:* ${orderDetails.address}`);
    lines.push(`*Método de Pago:* ${orderDetails.payment}`);
    
    if (orderDetails.observation) {
      lines.push(`*Notas:* ${orderDetails.observation}`);
    }

    lines.push(``);
    lines.push(`*Pedido:*`);
    orderDetails.items.forEach((item, idx) => {
      lines.push(`${idx + 1}. ${item.qty}x ${item.name} - $${formatMoney(item.price * item.qty)}`);
    });
    
    lines.push(``);
    lines.push(`*Total: $${formatMoney(orderDetails.total)}*`);
    return lines.join('\n');
  };

  const buildLink = () => {
    const text = encodeURIComponent(buildMessage());
    const num = BUSINESS_CONFIG.whatsappNumber;
    return isMobile() ? `whatsapp://send?phone=${num}&text=${text}` : `https://wa.me/${num}?text=${text}`;
  };

  const handleWhatsApp = async () => {
    window.open(buildLink(), '_blank', 'noopener,noreferrer');
    setLoading(true);
    try {
      await confirmOrder(orderDetails);
      addToast('Pedido confirmado. Continúa en WhatsApp.', 'Pedido confirmado');
      if (onClose) onClose();
      setTimeout(() => window.location.reload(), 800);
    } catch {
      addToast('No se pudo confirmar el pedido.', 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="¡Pedido Listo!">
      <div className="text-center space-y-5">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.12)' }}>
            <CheckCircle className="text-green-400 w-12 h-12" />
          </div>
        </div>

        <div>
          <h3 className="display text-3xl mb-1" style={{ color: 'var(--text)' }}>¡Casi listo!</h3>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Confirma tu pedido por WhatsApp para que empecemos a prepararlo.
          </p>
        </div>

        {orderDetails.observation && (
          <div className="px-4 py-2 rounded-xl bg-amber-400/5 border border-amber-400/10 text-left">
             <p className="text-[10px] font-black uppercase tracking-widest text-amber-400/60 mb-1">Tus notas:</p>
             <p className="text-xs italic text-white/80">"{orderDetails.observation}"</p>
          </div>
        )}

        <div className="p-4 rounded-2xl text-left space-y-2" style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}>
          <div className="flex justify-between items-center opacity-60">
            <span className="text-xs font-bold uppercase tracking-widest">Pago</span>
            <span className="text-xs font-bold">{orderDetails.payment}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Total a pagar</span>
            <span className="display text-3xl" style={{ color: 'var(--accent)' }}>${formatMoney(orderDetails.total)}</span>
          </div>
        </div>

        <button
          onClick={handleWhatsApp}
          disabled={loading}
          className="w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-green-500/10"
          style={{ background: '#25D366', fontFamily: "'Poppins', sans-serif" }}
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WA" className="w-5 h-5" />
          {loading ? 'Procesando...' : 'Enviar a WhatsApp'}
        </button>

        <button onClick={onClose} className="text-xs uppercase tracking-widest font-bold opacity-40 transition-opacity hover:opacity-100">
          Cerrar
        </button>
      </div>
    </Modal>
  );
};

export default SuccessModal;