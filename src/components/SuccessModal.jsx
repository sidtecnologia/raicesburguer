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

  const buildMessage = () => {
    const lines = [
      `*Nuevo Pedido - ${BUSINESS_CONFIG.name}*`,
      ``,
      `*Cliente:* ${orderDetails.name}`,
      `*Dirección:* ${orderDetails.address}`,
      `*Pago:* ${orderDetails.payment}`
    ];
    
    if (orderDetails.observation) {
      lines.push(`*Notas:* ${orderDetails.observation}`);
    }

    lines.push(``, `*Pedido:*`);
    orderDetails.items.forEach((item, idx) => {
      lines.push(`${idx + 1}. ${item.qty}x ${item.name} - $${formatMoney(item.price * item.qty)}`);
    });
    
    lines.push(``, `*Total: $${formatMoney(orderDetails.total)}*`);
    return lines.join('\n');
  };

  const handleWhatsApp = async () => {
    const text = encodeURIComponent(buildMessage());
    const num = BUSINESS_CONFIG.whatsappNumber;
    const link = /Android|iPhone/i.test(navigator.userAgent) ? `whatsapp://send?phone=${num}&text=${text}` : `https://wa.me/${num}?text=${text}`;
    
    window.open(link, '_blank');
    setLoading(true);
    try {
      await confirmOrder(orderDetails);
      if (onClose) onClose();
      setTimeout(() => window.location.reload(), 1000);
    } catch {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="¡Pedido Listo!">
      <div className="text-center space-y-5">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.1)' }}>
            <CheckCircle className="text-green-400 w-12 h-12" />
          </div>
        </div>
        <h3 className="display text-3xl text-white">¡Casi listo!</h3>
        {orderDetails.observation && (
          <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-left">
             <p className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-1">Tus notas:</p>
             <p className="text-xs italic text-white/70">"{orderDetails.observation}"</p>
          </div>
        )}
        <button
          onClick={handleWhatsApp}
          disabled={loading}
          className="w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2 bg-[#25D366]"
        >
          {loading ? 'Confirmando...' : 'Enviar a WhatsApp'}
        </button>
      </div>
    </Modal>
  );
};

export default SuccessModal;