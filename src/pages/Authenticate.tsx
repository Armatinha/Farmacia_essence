import { useState } from 'react';
import { ScanLine, CheckCircle2, AlertTriangle, XCircle, Search, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

type StatusType = 'idle' | 'loading' | 'success' | 'warning' | 'error';

export default function Authenticate() {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<StatusType>('idle');
  const { t } = useTranslation();

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setStatus('loading');
    
    // Simulate API call for the MVP demonstration
    setTimeout(() => {
      const upperCode = code.toUpperCase();
      if (upperCode === 'VALIDO1') {
        setStatus('success'); // Primeira vez
      } else if (upperCode === 'USADO2') {
        setStatus('warning'); // Já verificado
      } else {
        setStatus('error'); // Inválido
      }
    }, 1500);
  };

  return (
    <div className="bg-veltrix-light-1 min-h-[calc(100vh-200px)]">
      <div className="container-v py-12 md:py-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="eyebrow gold-text mb-4">{t('auth.eyebrow')}</p>
          <h1 className="font-display text-4xl md:text-5xl tracking-tighter text-veltrix-dark-3 mb-4">
            {t('auth.title')}
          </h1>
          <p className="text-veltrix-text-dark max-w-xl mx-auto font-display text-lg">
            {t('auth.description')}
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-veltrix-light-3 border border-veltrix-border-2 p-8 md:p-12 shadow-sm">
            <form onSubmit={handleVerify} className="relative">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                  <ScanLine className="absolute left-4 top-1/2 -translate-y-1/2 text-veltrix-text-muted" size={20} />
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder={t('auth.placeholder')}
                    className="input-premium pl-12 text-lg uppercase tracking-widest text-veltrix-dark-3 placeholder:text-veltrix-text-muted"
                    maxLength={15}
                    disabled={status === 'loading'}
                  />
                </div>
                <button 
                  type="submit" 
                  className="btn-gold"
                  disabled={status === 'loading' || !code.trim()}
                >
                  {status === 'loading' ? <Loader2 className="animate-spin" size={16} /> : <Search size={16} />}
                  {t('auth.btn')}
                </button>
              </div>
            </form>

            {/* Feedback Area (Accessible) */}
            <div className="mt-10" aria-live="polite" aria-atomic="true">
              {status === 'idle' && (
                <div className="p-6 bg-veltrix-light-2 border border-veltrix-border-1 text-center text-veltrix-text-gray text-sm font-mono">
                  {t('auth.info')}
                </div>
              )}

              {status === 'success' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="p-8 bg-[#f0fdf4] border border-[#bbf7d0] flex flex-col items-center text-center"
                >
                  <CheckCircle2 size={40} className="text-[#15803d] mb-4" />
                  <h3 className="font-display text-2xl text-[#166534] mb-2">{t('auth.successTitle')}</h3>
                  <p className="text-[#166534] text-sm leading-relaxed">
                    {t('auth.successDesc')} <strong className="font-mono">1ª vez</strong>. {t('auth.successDesc2')}
                  </p>
                  <div className="mt-5 px-4 py-2 bg-white/80 border border-[#bbf7d0] text-[#166534] text-xs font-mono uppercase tracking-wider">
                    {t('auth.verifyTime')} {new Date().toLocaleString()}
                  </div>
                </motion.div>
              )}

              {status === 'warning' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="p-8 bg-[#fffbeb] border border-[#fde68a] flex flex-col items-center text-center"
                >
                  <AlertTriangle size={40} className="text-[#b45309] mb-4" />
                  <h3 className="font-display text-2xl text-[#92400e] mb-2">{t('auth.warnTitle')}</h3>
                  <p className="text-[#92400e] text-sm mb-4 leading-relaxed">
                    {t('auth.warnDesc')} <strong className="font-mono">3 vezes</strong> {t('auth.warnDesc2')}
                  </p>
                  <p className="text-[#b45309] text-xs">
                    {t('auth.warnHelp')}
                  </p>
                </motion.div>
              )}

              {status === 'error' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="p-8 bg-[#fef2f2] border border-[#fecaca] flex flex-col items-center text-center"
                >
                  <XCircle size={40} className="text-[#b91c1c] mb-4" />
                  <h3 className="font-display text-2xl text-[#991b1b] mb-2">{t('auth.errTitle')}</h3>
                  <p className="text-[#991b1b] text-sm leading-relaxed">
                    {t('auth.errDesc')}
                  </p>
                </motion.div>
              )}
            </div>
          </div>

          {/* Demo notes */}
          <div className="mt-8 text-center text-[10px] uppercase tracking-widest text-veltrix-text-muted">
            <p>Dica MVP: Teste com <code className="bg-veltrix-light-2 border border-veltrix-border-2 px-1.5 py-0.5 ml-1 mr-1">VALIDO1</code>, <code className="bg-veltrix-light-2 border border-veltrix-border-2 px-1.5 py-0.5 ml-1 mr-1">USADO2</code>.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
