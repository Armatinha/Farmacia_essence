import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import essenceEmblem from '../assets/essence-emblem.png';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const links = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.about'), path: '/sobre' },
    { name: t('nav.products'), path: '/produtos' },
    { name: t('nav.contact'), path: '/contato' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-veltrix-border-1/80 bg-veltrix-light-1/92 backdrop-blur-xl">
      <div className="container-v h-[76px] flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex items-center justify-center">
            <img src={essenceEmblem} alt="Essence Emblem" className="w-8 h-8 rounded-md object-cover shadow-xs border border-veltrix-border-2" />
          </div>
          <div>
            <div className="text-[17px] font-semibold tracking-[.18em] leading-none text-veltrix-dark-3">ESSENCE</div>
            <div className="mt-1 flex items-center gap-2">
              <span className="h-px w-5 bg-veltrix-gold-1"></span>
              <span className="text-[8px] tracking-[.3em] text-veltrix-text-dark">PHARMA</span>
              <span className="h-px w-5 bg-veltrix-gold-1"></span>
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-[12px] font-semibold tracking-wide transition-colors hover:text-veltrix-gold-2 ${
                isActive(link.path) ? 'text-veltrix-gold-2' : 'text-veltrix-dark-3'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="flex border border-veltrix-border-1 p-1 text-[10px] font-bold">
            <button 
              onClick={() => changeLanguage('en')}
              className={`px-2.5 py-1.5 cursor-pointer transition-colors ${i18n.language === 'en' ? 'bg-veltrix-dark-2 text-veltrix-light-5' : 'text-veltrix-dark-3 hover:text-veltrix-gold-1'}`}
            >
              EN
            </button>
            <button 
              onClick={() => changeLanguage('es')}
              className={`px-2.5 py-1.5 cursor-pointer transition-colors ${i18n.language === 'es' ? 'bg-veltrix-dark-2 text-veltrix-light-5' : 'text-veltrix-dark-3 hover:text-veltrix-gold-1'}`}
            >
              ES
            </button>
          </div>
          <Link to="/autenticacao" className="hidden md:flex items-center gap-2 bg-veltrix-gold-1 text-veltrix-dark-3 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider hover:bg-veltrix-gold-3 transition-colors">
            <ShieldCheck size={14} />
            {t('nav.verify')}
          </Link>
          
          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 text-veltrix-dark-3 hover:text-veltrix-gold-1"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-veltrix-light-1 border-b border-veltrix-border-1 absolute top-full left-0 right-0">
          <div className="px-6 py-4 flex flex-col gap-4 shadow-lg">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`text-[12px] font-semibold tracking-wide py-2 border-b border-veltrix-border-3 ${
                  isActive(link.path) ? 'text-veltrix-gold-2' : 'text-veltrix-dark-3'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/autenticacao"
              onClick={() => setIsOpen(false)}
              className="btn-gold justify-center mt-2"
            >
              <ShieldCheck size={14} />
              {t('nav.verify')}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
