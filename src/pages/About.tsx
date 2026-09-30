import { Microscope, Activity, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export default function About() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="bg-veltrix-dark-1 text-veltrix-light-5 py-24 md:py-32 px-6">
        <div className="container-v">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="eyebrow text-veltrix-gold-1 mb-4 flex items-center gap-2">
              {t('about.eyebrow')}
            </p>
            <h1 className="font-display text-5xl md:text-7xl tracking-tighter mb-6">
              {t('about.title1')}<br />
              <span className="text-veltrix-text-muted">{t('about.title2')}</span>
            </h1>
            <p className="text-xl text-veltrix-text-muted max-w-2xl font-display">
              {t('about.description')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-24 bg-veltrix-light-1">
        <div className="container-v">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="max-w-4xl prose prose-lg text-veltrix-text-dark"
          >
            <h2 className="font-display text-4xl tracking-tight text-veltrix-dark-3 mb-8">{t('about.philTitle')}</h2>
            <p className="mb-6 leading-relaxed">
              {t('about.p1')}
            </p>
            <p className="mb-6 leading-relaxed">
              {t('about.p2')}
            </p>
            <p className="leading-relaxed">
              {t('about.p3')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pillars */}
      <section className="py-24 bg-veltrix-light-2 border-t border-veltrix-border-2">
        <div className="container-v">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <p className="eyebrow gold-text">{t('about.pillarsEyebrow')}</p>
            <h2 className="font-display text-4xl md:text-5xl tracking-tighter text-veltrix-dark-3 mt-4">{t('about.pillarsTitle')}</h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }} className="bg-veltrix-light-3 p-10 border border-veltrix-border-2 card-lift">
              <Microscope size={32} className="text-veltrix-gold-1 mb-8" />
              <h3 className="font-display text-2xl tracking-tight text-veltrix-dark-3 mb-4">{t('about.pill1Title')}</h3>
              <p className="text-sm text-veltrix-text-gray leading-relaxed">
                {t('about.pill1Desc')}
              </p>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }} className="bg-veltrix-light-3 p-10 border border-veltrix-border-2 card-lift">
              <Activity size={32} className="text-veltrix-gold-1 mb-8" />
              <h3 className="font-display text-2xl tracking-tight text-veltrix-dark-3 mb-4">{t('about.pill2Title')}</h3>
              <p className="text-sm text-veltrix-text-gray leading-relaxed">
                {t('about.pill2Desc')}
              </p>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }} className="bg-veltrix-light-3 p-10 border border-veltrix-border-2 card-lift">
              <ShieldCheck size={32} className="text-veltrix-gold-1 mb-8" />
              <h3 className="font-display text-2xl tracking-tight text-veltrix-dark-3 mb-4">{t('about.pill3Title')}</h3>
              <p className="text-sm text-veltrix-text-gray leading-relaxed">
                {t('about.pill3Desc')}
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
