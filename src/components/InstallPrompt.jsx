import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
      setTimeout(() => setAnimating(true), 50);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        close();
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  const close = () => {
    setAnimating(false);
    setTimeout(() => setVisible(false), 500);
  };

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
    close();
  };

  if (!visible) return null;

  return (
    <div
      className="fixed top-[95px] left-6 z-[200] w-full max-w-[280px]"
      style={{
        transform: `translateY(${animating ? '0' : '-10px'})`,
        opacity: animating ? 1 : 0,
        transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        fontFamily: "'Poppins', sans-serif"
      }}
    >
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-black/80 border border-white/10 backdrop-blur-md shadow-2xl">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-amber-400/20">
          <Download size={18} className="text-amber-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-bold text-white leading-tight mb-2">Acceso rápido</p>
          <button 
            onClick={handleInstall}
            className="w-full py-1.5 px-3 rounded-lg bg-amber-400 text-black text-[10px] font-black uppercase tracking-wider active:scale-95 transition-transform"
          >
            Instalar App
          </button>
        </div>
        <button onClick={close} className="text-white/30 ml-1 p-1 self-start"><X size={14} /></button>
      </div>
    </div>
  );
};

export default InstallPrompt;