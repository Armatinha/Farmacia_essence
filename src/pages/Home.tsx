import { Link } from 'react-router-dom';
import { ShieldCheck, Microscope, FileCheck, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import heroImage from '../assets/essence-pen-box.png';

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="hero-grid min-h-[680px] lg:min-h-[730px] flex items-center overflow-hidden bg-veltrix-light-1">
        <div className="container-v py-16 grid lg:grid-cols-[.9fr_1.1fr] gap-14 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease: "easeOut" }} className="relative z-10">
            <p className="eyebrow gold-text">{t('home.eyebrow')}</p>
            <h1 className="font-display text-[clamp(3.5rem,7vw,6.8rem)] leading-[.88] tracking-[-.05em] mt-7">
              {t('home.title1')}<br />
              <em className="font-medium gold-text">{t('home.title2')}</em>
            </h1>
            <p className="text-veltrix-text-dark text-base leading-8 max-w-xl mt-8">
              {t('home.description')}
            </p>
            
            <div className="flex flex-wrap gap-3 mt-9">
              <Link to="/produtos" className="btn-primary">
                {t('home.exploreBtn')}
                <ArrowRight size={14} />
              </Link>
              <Link to="/autenticacao" className="btn-outline bg-transparent">
                <ShieldCheck size={14} />
                {t('nav.verify')}
              </Link>
            </div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }} className="relative">
            <div className="absolute -inset-8 border border-veltrix-gold-1/25 translate-x-6 translate-y-6"></div>
            <img 
              alt="Essence Labs packaging mockup" 
              className="relative w-full h-[420px] lg:h-[550px] object-cover object-center shadow-[0_35px_80px_rgba(20,20,28,.18)]" 
              src={heroImage}
            />
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.8 }} className="absolute -bottom-5 -left-5 bg-veltrix-gold-1 p-5 w-40 text-veltrix-dark-3 shadow-lg">
              <span className="font-mono text-[9px] tracking-widest">ESS / 001</span>
              <p className="font-display text-lg tracking-tight leading-tight mt-2">{t('home.verifyTag')}</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Feature Strip */}
      <div className="bg-veltrix-dark-2 text-veltrix-light-4">
        <div className="container-v grid grid-cols-3 divide-x divide-veltrix-dark-4">
          <div className="py-5 px-2 flex items-center justify-center gap-2 md:gap-3">
            <ShieldCheck className="text-veltrix-gold-4 shrink-0" size={18} />
            <span className="text-[8px] md:text-[10px] uppercase tracking-[.14em] font-semibold">{t('home.strip1')}</span>
          </div>
          <div className="py-5 px-2 flex items-center justify-center gap-2 md:gap-3">
            <Microscope className="text-veltrix-gold-4 shrink-0" size={18} />
            <span className="text-[8px] md:text-[10px] uppercase tracking-[.14em] font-semibold">{t('home.strip2')}</span>
          </div>
          <div className="py-5 px-2 flex items-center justify-center gap-2 md:gap-3">
            <FileCheck className="text-veltrix-gold-4 shrink-0" size={18} />
            <span className="text-[8px] md:text-[10px] uppercase tracking-[.14em] font-semibold">{t('home.strip3')}</span>
          </div>
        </div>
      </div>

      {/* Principles Section */}
      <section className="py-24 md:py-36 bg-veltrix-light-1 overflow-hidden">
        <div className="container-v grid lg:grid-cols-[.75fr_1.25fr] gap-16">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <p className="eyebrow gold-text">{t('home.principlesEyebrow')}</p>
            <h2 className="font-display text-5xl md:text-7xl tracking-tighter mt-5">{t('home.principlesTitle')}</h2>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="lg:pt-10">
            <p className="text-xl md:text-2xl leading-relaxed text-veltrix-text-dark font-display">
              {t('home.principlesText')}
            </p>
            <div className="grid grid-cols-3 gap-4 border-t border-veltrix-border-2 mt-12 pt-8">
              <div>
                <b className="font-mono text-lg gold-text">≥99%</b>
                <p className="text-[9px] uppercase tracking-wider mt-2 text-veltrix-text-gray">{t('home.stat1')}</p>
              </div>
              <div>
                <b className="font-mono text-lg gold-text">01:01</b>
                <p className="text-[9px] uppercase tracking-wider mt-2 text-veltrix-text-gray">{t('home.stat2')}</p>
              </div>
              <div>
                <b className="font-mono text-lg gold-text">HPLC</b>
                <p className="text-[9px] uppercase tracking-wider mt-2 text-veltrix-text-gray">{t('home.stat3')}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Auth Banner */}
      <section className="bg-veltrix-gold-1 py-20 overflow-hidden">
        <div className="container-v grid lg:grid-cols-[1.3fr_.7fr] gap-10 items-end">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <p className="eyebrow text-veltrix-dark-3 opacity-80">{t('home.authEyebrow')}</p>
            <h2 className="font-display text-5xl md:text-7xl tracking-tighter mt-4 leading-none text-veltrix-dark-3">{t('home.authTitle')}</h2>
            <p className="max-w-2xl mt-6 text-veltrix-text-darker">
              {t('home.authText')}
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}>
            <Link to="/autenticacao" className="bg-veltrix-dark-2 text-veltrix-light-5 px-7 py-5 flex justify-between items-center text-[10px] uppercase tracking-wider font-bold hover:bg-[#292b35] transition-colors">
              {t('home.authBtn')}
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
