import { useState } from 'react';
import Modal from './ui/Modal';
import { useShop } from '../context/ShopContext';
import { PrivacyContent } from './privacy';
import { ArrowLeft, Wallet, Banknote } from 'lucide-react';

const CheckoutModal = ({ isOpen, onClose, onSuccess, observation }) => {
  const { processOrder } = useShop();
  const [loading, setLoading] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    payment: 'Efectivo',
    terms: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.terms) {
      alert('Debes aceptar el tratamiento de datos para continuar');
      return;
    }
    setLoading(true);
    try {
      const details = await processOrder({ ...formData, observation });
      onClose();
      onSuccess(details);
    } catch (error) {
      alert(error.message || 'Error procesando la orden');
    } finally {
      setLoading(false);
    }
  };

  const field = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));

  return (
    <>
      <Modal isOpen={isOpen && !showPrivacy} onClose={onClose} title="Datos de Entrega">
        <form onSubmit={handleSubmit} className="space-y-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
          <input
            className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white outline-none"
            placeholder="Nombre completo"
            required
            onChange={e => field('name', e.target.value)}
          />
          <input
            className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white outline-none"
            placeholder="Dirección de entrega"
            required
            onChange={e => field('address', e.target.value)}
          />
          <input
            className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white outline-none"
            placeholder="Teléfono"
            required
            type="tel"
            onChange={e => field('phone', e.target.value)}
          />

          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Método de pago</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => field('payment', 'Efectivo')}
                className="flex items-center justify-center gap-2 p-4 rounded-xl border transition-all"
                style={{
                  background: formData.payment === 'Efectivo' ? 'var(--accent)' : 'rgba(255,255,255,0.05)',
                  borderColor: formData.payment === 'Efectivo' ? 'var(--accent)' : 'rgba(255,255,255,0.1)',
                  color: formData.payment === 'Efectivo' ? 'var(--bg)' : 'white'
                }}
              >
                <Banknote size={18} />
                <span className="text-sm font-bold">Efectivo</span>
              </button>
              <button
                type="button"
                onClick={() => field('payment', 'Transferencia')}
                className="flex items-center justify-center gap-2 p-4 rounded-xl border transition-all"
                style={{
                  background: formData.payment === 'Transferencia' ? 'var(--accent)' : 'rgba(255,255,255,0.05)',
                  borderColor: formData.payment === 'Transferencia' ? 'var(--accent)' : 'rgba(255,255,255,0.1)',
                  color: formData.payment === 'Transferencia' ? 'var(--bg)' : 'white'
                }}
              >
                <Wallet size={18} />
                <span className="text-sm font-bold">Transferencia</span>
              </button>
            </div>
          </div>

          <div className="flex items-start gap-3 py-2">
            <button
              type="button"
              onClick={() => field('terms', !formData.terms)}
              className="w-5 h-5 mt-0.5 rounded flex items-center justify-center flex-shrink-0 transition-all"
              style={{
                background: formData.terms ? 'var(--accent)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${formData.terms ? 'var(--accent)' : 'rgba(255,255,255,0.2)'}`,
              }}
            >
              {formData.terms && <span style={{ color: 'var(--bg)', fontSize: 12, fontWeight: 900 }}>✓</span>}
            </button>
            <span className="text-xs leading-relaxed text-white/60">
              Acepto el <button 
                type="button" 
                onClick={() => setShowPrivacy(true)}
                className="underline font-bold text-amber-400"
              >
                tratamiento de mis datos
              </button> para procesar el pedido.
            </span>
          </div>

          <button type="submit" disabled={loading} className="w-full py-4 rounded-2xl bg-amber-400 text-black font-black uppercase tracking-widest active:scale-95 transition-transform">
            {loading ? 'Procesando...' : 'Confirmar Pedido'}
          </button>
        </form>
      </Modal>

      {showPrivacy && (
        <div className="fixed inset-0 z-[100] bg-[#0a0806] p-8 overflow-y-auto">
          <div className="max-w-md mx-auto">
            <button 
              onClick={() => setShowPrivacy(false)}
              className="flex items-center gap-2 mb-10 font-bold text-xs uppercase tracking-widest text-amber-400"
            >
              <ArrowLeft size={18} /> Regresar al Checkout
            </button>
            
            <PrivacyContent />

            <button 
              onClick={() => setShowPrivacy(false)}
              className="w-full mt-10 py-4 rounded-2xl font-bold uppercase tracking-widest text-sm bg-white/5 border border-white/10 text-white"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CheckoutModal;