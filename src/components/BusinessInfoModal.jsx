import Modal from './ui/Modal';
import { MapPin, Phone, Clock, ExternalLink } from 'lucide-react';
import { BUSINESS_CONFIG, isBusinessOpen } from '../config/businessConfig';

const BusinessInfoModal = ({ isOpen, onClose }) => {
  const open = isBusinessOpen();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Información">
      <div className="space-y-6 pb-2">
        <div className="flex flex-col items-center gap-3 pt-2">
          <img
            src={BUSINESS_CONFIG.logo}
            alt={BUSINESS_CONFIG.name}
            className="w-20 h-20 rounded-2xl object-cover"
            style={{ border: '2px solid var(--border)' }}
          />
          <div className="text-center">
            <h2 className="display text-4xl text-white leading-none">
              {BUSINESS_CONFIG.nameParts.main}
              <span style={{ color: 'var(--accent)' }}>{BUSINESS_CONFIG.nameParts.accent}</span>
            </h2>
            <p className="text-xs text-white/40 uppercase tracking-[0.2em] mt-1">{BUSINESS_CONFIG.slogan}</p>
          </div>
          <span
            className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"
            style={{
              background: open ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
              color: open ? '#4ade80' : '#f87171',
              border: `1px solid ${open ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'}`
            }}
          >
            {open ? '● Abierto ahora' : '● Cerrado ahora'}
          </span>
        </div>

        <div
          className="rounded-2xl overflow-hidden divide-y"
          style={{ border: '1px solid var(--border)', divideColor: 'var(--border)' }}
        >
          <div className="flex items-start gap-3 px-4 py-4">
            <Clock size={16} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--accent)' }} />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-0.5">Horario</p>
              <p className="text-sm text-white/80">{BUSINESS_CONFIG.schedule.days}</p>
              <p className="text-sm font-bold text-white">{BUSINESS_CONFIG.schedule.label}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 px-4 py-4" style={{ borderTop: '1px solid var(--border)' }}>
            <MapPin size={16} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--accent)' }} />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-0.5">Dirección</p>
              <p className="text-sm text-white/80">{BUSINESS_CONFIG.addressLabel}</p>
              <a
                href={BUSINESS_CONFIG.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold mt-1 transition-opacity hover:opacity-80"
                style={{ color: 'var(--accent)' }}
              >
                Ver en Google Maps <ExternalLink size={11} />
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3 px-4 py-4" style={{ borderTop: '1px solid var(--border)' }}>
            <Phone size={16} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--accent)' }} />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-0.5">Teléfono</p>
              <a
                href={`tel:${BUSINESS_CONFIG.phoneRaw}`}
                className="text-sm font-bold text-white hover:opacity-80 transition-opacity"
              >
                {BUSINESS_CONFIG.phone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default BusinessInfoModal;
