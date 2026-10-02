import { Link } from 'react-router-dom';
import { ShieldCheck, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
const essenceEmblem = '/essence-emblem-sm.webp';

export default function Footer() {
  const { t } = useTranslation();
  const wppNumber = (import.meta.env.VITE_WHATSAPP_NUMBER ?? '').replace(/\D/g, '');

  return (
    <footer className="bg-veltrix-dark-1 bg-gradient-to-b from-[#18191f]/60 to-veltrix-dark-1 text-veltrix-light-4 pt-16 pb-8 mt-auto border-t border-veltrix-dark-3/30">
      <div className="container-v grid md:grid-cols-[1.5fr_1fr_1fr] gap-12 relative z-10">
        <div>
          <Link to="/" className="flex items-center gap-3">
            <img src={essenceEmblem} alt="Essence Emblem" width={32} height={32} className="w-8 h-8 rounded-md object-cover shadow-xs border border-veltrix-dark-4" />
            <div>
              <div className="text-[17px] font-semibold tracking-[.18em] leading-none text-veltrix-light-5">ESSENCE</div>
              <div className="mt-1 flex items-center gap-2">
                <span className="h-px w-5 bg-veltrix-gold-1"></span>
                <span className="text-[8px] tracking-[.3em] text-veltrix-border-1">PHARMA</span>
                <span className="h-px w-5 bg-veltrix-gold-1"></span>
              </div>
            </div>
          </Link>
          <p className="mt-6 text-sm text-veltrix-text-muted max-w-sm leading-7">
            {t('footer.description')}
          </p>
          <p className="mt-4 text-[10px] text-veltrix-text-muted leading-relaxed">
            Essence Pharma Ltd. · Kuwait, 104 St.<br />
            support@essencepharma.com
          </p>
        </div>
        
        <div>
          <p className="eyebrow text-veltrix-gold-4 mb-4">{t('footer.navTitle')}</p>
          <div className="flex flex-col gap-2">
            <Link to="/produtos" className="block py-1.5 text-sm text-veltrix-border-1 hover:text-veltrix-gold-2">{t('footer.products')}</Link>
            <Link to="/sobre" className="block py-1.5 text-sm text-veltrix-border-1 hover:text-veltrix-gold-2">{t('footer.about')}</Link>
            <Link to="/contato" className="block py-1.5 text-sm text-veltrix-border-1 hover:text-veltrix-gold-2">{t('footer.contact')}</Link>
          </div>
        </div>

        <div>
          <p className="eyebrow text-veltrix-gold-4 mb-4">{t('footer.labTitle')}</p>
          <div className="flex flex-col gap-2">
            <Link to="/autenticacao" className="flex items-center gap-2 text-veltrix-gold-1 font-medium hover:text-veltrix-gold-3 transition-colors text-sm py-1.5">
              <ShieldCheck size={16} />
              {t('footer.verify')}
            </Link>
            <a href="mailto:support@essencepharma.com" className="block py-1.5 text-sm text-veltrix-border-1 hover:text-veltrix-gold-2">
              support@essencepharma.com
            </a>
            {wppNumber && (
              <a
                id="footer-whatsapp-link"
                href={`https://wa.me/${wppNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 py-1.5 text-sm text-veltrix-border-1 hover:text-veltrix-gold-2 transition-colors"
              >
                <MessageCircle size={14} />
                WhatsApp
              </a>
            )}
            <p className="text-sm text-veltrix-border-1 mt-2">
              {t('footer.hours')}
            </p>
          </div>
        </div>
      </div>

      <div className="container-v relative z-10 mt-14 pt-6 border-t border-veltrix-dark-4 flex flex-wrap gap-4 justify-between text-[10px] tracking-wider uppercase text-veltrix-text-muted">
        <span>© {new Date().getFullYear()} Essence Pharma</span>
        <div className="flex gap-4">
          <a href="#" className="hover:text-veltrix-gold-1 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-veltrix-gold-1 transition-colors">Terms of Use</a>
          <span>{t('footer.copyright')}</span>
        </div>
      </div>
    </footer>
  );
}
