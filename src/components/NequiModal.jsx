import { useState } from 'react';
import Modal from './ui/Modal';
import { Copy, Check } from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/businessConfig';
import { formatMoney } from '../utils/format';

const NequiModal = ({ isOpen, onClose, total, onContinue }) => {
  const [copied, setCopied] = useState(false);
  const { number, qrImage, holderName } = BUSINESS_CONFIG.payment.nequi;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Pago por Nequi">
      <div className="space-y-5 pb-2">
        <div className="text-center space-y-1">
          <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Total a transferir</p>
          <p className="display text-5xl" style={{ color: 'var(--accent)' }}>${formatMoney(total)}</p>
        </div>

        <div
          className="rounded-2xl p-4 flex flex-col items-center gap-3"
          style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}
        >
          <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Escanea el QR con Nequi</p>
          <div className="w-48 h-48 rounded-2xl overflow-hidden bg-white p-2">
            <img
              src={qrImage}
              alt="QR Nequi"
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#f0f0f0;border-radius:12px;"><span style="color:#999;font-size:11px;text-align:center;padding:8px">QR no<br/>disponible</span></div>`;
              }}
            />
          </div>
          <p className="text-xs text-white/40">o transfiere al número</p>
        </div>

        <div
          className="rounded-2xl px-4 py-3 flex items-center justify-between gap-3"
          style={{ background: 'rgba(232,184,75,0.06)', border: '1.5px solid rgba(232,184,75,0.2)' }}
        >
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-0.5">Número Nequi — {holderName}</p>
            <p className="text-xl font-black tracking-widest text-white">{number}</p>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
            style={{
              background: copied ? 'rgba(34,197,94,0.15)' : 'rgba(232,184,75,0.15)',
              color: copied ? '#4ade80' : 'var(--accent)',
              border: `1px solid ${copied ? 'rgba(34,197,94,0.3)' : 'rgba(232,184,75,0.3)'}`
            }}
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? 'Copiado' : 'Copiar'}
          </button>
        </div>

        <p className="text-[11px] text-white/30 text-center leading-relaxed px-2">
          Después de transferir, toca <strong className="text-white/50">Confirmar pago</strong> para enviar tu pedido por WhatsApp con el comprobante.
        </p>

        <button
          onClick={onContinue}
          className="w-full py-4 rounded-2xl font-black text-black uppercase tracking-widest text-sm active:scale-95 transition-transform hover:brightness-110"
          style={{ background: 'var(--accent)' }}
        >
          Ya transferí — Confirmar pedido
        </button>
      </div>
    </Modal>
  );
};

export default NequiModal;
