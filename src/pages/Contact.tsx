import { useState } from 'react';
import { Mail, MessageCircle, MapPin, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

export default function Contact() {
  const { t } = useTranslation();
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    // Reset form after 5 seconds
    setTimeout(() => setIsSuccess(false), 5000);
  };

  return (
    <div className="bg-veltrix-light-1 min-h-[calc(100vh-200px)]">
      <div className="container-v py-12 md:py-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
          className="mb-16 border-b border-veltrix-border-2 pb-12"
        >
          <p className="eyebrow gold-text mb-4">{t('contact.eyebrow')}</p>
          <h1 className="font-display text-5xl md:text-6xl tracking-tighter text-veltrix-dark-3">
            {t('contact.title')}
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col gap-12"
          >
            <p className="text-lg text-veltrix-text-dark font-display leading-relaxed">
              {t('contact.description')}
            </p>

            <div className="flex flex-col gap-8">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 bg-veltrix-dark-2 text-veltrix-gold-1 flex items-center justify-center flex-shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <h4 className="font-display text-xl tracking-tight text-veltrix-dark-3 mb-1">{t('contact.emailTitle')}</h4>
                  <a href="mailto:support@essencepharma.com" className="text-sm font-mono text-veltrix-text-gray hover:text-veltrix-gold-1 transition-colors">
                    support@essencepharma.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="w-12 h-12 bg-veltrix-dark-2 text-veltrix-gold-1 flex items-center justify-center flex-shrink-0">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <h4 className="font-display text-xl tracking-tight text-veltrix-dark-3 mb-1">{t('contact.wppTitle')}</h4>
                  <a href="#" className="text-sm font-mono text-veltrix-text-gray hover:text-veltrix-gold-1 transition-colors">
                    {t('contact.wppDesc')}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="w-12 h-12 bg-veltrix-dark-2 text-veltrix-gold-1 flex items-center justify-center flex-shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="font-display text-xl tracking-tight text-veltrix-dark-3 mb-1">{t('contact.addrTitle')}</h4>
                  <p className="text-sm font-mono text-veltrix-text-gray leading-relaxed">
                    {t('contact.addrDesc')}<br />
                    {t('contact.addrDesc2')}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-veltrix-dark-2 p-8 md:p-12 border border-veltrix-dark-4 relative overflow-hidden"
          >
            <h3 className="font-display text-3xl tracking-tight text-veltrix-light-5 mb-8">{t('contact.formTitle')}</h3>
            
            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.form 
                  key="form"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }}
                  onSubmit={handleSubmit} 
                  className="flex flex-col gap-5"
                >
                  <div>
                    <label htmlFor="name" className="block text-[10px] uppercase tracking-wider font-bold text-veltrix-text-muted mb-2">{t('contact.name')}</label>
                    <input type="text" id="name" required className="input-premium bg-veltrix-dark-1 border-veltrix-dark-4 text-veltrix-light-4 focus:bg-veltrix-dark-2 focus:border-veltrix-gold-1" />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-[10px] uppercase tracking-wider font-bold text-veltrix-text-muted mb-2">{t('contact.email')}</label>
                    <input type="email" id="email" required className="input-premium bg-veltrix-dark-1 border-veltrix-dark-4 text-veltrix-light-4 focus:bg-veltrix-dark-2 focus:border-veltrix-gold-1" />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-[10px] uppercase tracking-wider font-bold text-veltrix-text-muted mb-2">{t('contact.subject')}</label>
                    <select id="subject" className="input-premium bg-veltrix-dark-1 border-veltrix-dark-4 text-veltrix-light-4 focus:bg-veltrix-dark-2 focus:border-veltrix-gold-1">
                      <option>{t('contact.opt1')}</option>
                      <option>{t('contact.opt2')}</option>
                      <option>{t('contact.opt3')}</option>
                      <option>{t('contact.opt4')}</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-[10px] uppercase tracking-wider font-bold text-veltrix-text-muted mb-2">{t('contact.msg')}</label>
                    <textarea id="message" rows={4} required className="input-premium bg-veltrix-dark-1 border-veltrix-dark-4 text-veltrix-light-4 focus:bg-veltrix-dark-2 focus:border-veltrix-gold-1 resize-none"></textarea>
                  </div>
                  
                  <button type="submit" className="btn-gold mt-4 w-full justify-center py-4">
                    {t('contact.btn')}
                  </button>
                </motion.form>
              ) : (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="absolute inset-0 bg-veltrix-dark-2 flex flex-col items-center justify-center p-8 text-center"
                  aria-live="polite"
                >
                  <CheckCircle2 size={48} className="text-veltrix-gold-1 mb-6" />
                  <h4 className="font-display text-3xl text-veltrix-light-5 mb-2">{t('contact.successTitle')}</h4>
                  <p className="text-veltrix-text-muted text-sm leading-relaxed max-w-xs">
                    {t('contact.successDesc')}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
