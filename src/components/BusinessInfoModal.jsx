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

        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
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
                <span>Ver en Google Maps</span>
                <ExternalLink size={11} />
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

        <div className="flex justify-center gap-4">
          {BUSINESS_CONFIG.social?.instagram && (
            <a
              href={BUSINESS_CONFIG.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="igGrad" x1="2" y1="22" x2="22" y2="2" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#f9ce34" />
                    <stop offset="0.4" stopColor="#ee2a7b" />
                    <stop offset="1" stopColor="#6228d7" />
                  </linearGradient>
                </defs>
                <rect x="2" y="2" width="20" height="20" rx="5.5" stroke="url(#igGrad)" strokeWidth="1.8" />
                <circle cx="12" cy="12" r="4.5" stroke="url(#igGrad)" strokeWidth="1.8" />
                <circle cx="17.5" cy="6.5" r="1" fill="url(#igGrad)" />
              </svg>
            </a>
          )}

          {BUSINESS_CONFIG.social?.facebook && (
            <a
              href={BUSINESS_CONFIG.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
              </svg>
            </a>
          )}

          {BUSINESS_CONFIG.social?.tiktok && (
            <a
              href={BUSINESS_CONFIG.social.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <svg width="20" height="22" viewBox="0 0 24 27" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.54V6.79a4.85 4.85 0 01-1.02-.1z" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default BusinessInfoModal;