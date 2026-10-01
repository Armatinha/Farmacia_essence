import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import essenceEmblem from '../assets/essence-emblem.png';

export default function Footer() {
  return (
    <footer className="bg-veltrix-dark-1 bg-gradient-to-b from-[#18191f]/60 to-veltrix-dark-1 text-veltrix-light-4 pt-16 pb-8 mt-auto border-t border-veltrix-dark-3/30">
      <div className="container-v grid md:grid-cols-[1.5fr_1fr_1fr] gap-12 relative z-10">
        <div>
          <Link to="/" className="flex items-center gap-3">
            <img src={essenceEmblem} alt="Essence Emblem" className="w-8 h-8 rounded-md object-cover shadow-xs border border-veltrix-dark-4" />
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
            Materiais de pesquisa com identidade documentada, apresentação rigorosa e uma cadeia de confiança verificável.
          </p>
        </div>
        
        <div>
          <p className="eyebrow text-veltrix-gold-4 mb-4">Navegar</p>
          <div className="flex flex-col gap-2">
            <Link to="/produtos" className="block py-1.5 text-sm text-veltrix-border-1 hover:text-veltrix-gold-2">Catálogo de Produtos</Link>
            <Link to="/sobre" className="block py-1.5 text-sm text-veltrix-border-1 hover:text-veltrix-gold-2">A Empresa</Link>
            <Link to="/contato" className="block py-1.5 text-sm text-veltrix-border-1 hover:text-veltrix-gold-2">Fale Conosco</Link>
          </div>
        </div>

        <div>
          <p className="eyebrow text-veltrix-gold-4 mb-4">Laboratório & Segurança</p>
          <div className="flex flex-col gap-2">
            <Link to="/autenticacao" className="flex items-center gap-2 text-veltrix-gold-1 font-medium hover:text-veltrix-gold-3 transition-colors text-sm py-1.5">
              <ShieldCheck size={16} />
              Verificação de Autenticidade
            </Link>
            <a href="mailto:support@essencepharma.com" className="block py-1.5 text-sm text-veltrix-border-1 hover:text-veltrix-gold-2">
              support@essencepharma.com
            </a>
            <p className="text-sm text-veltrix-border-1 mt-2">
              Seg–Sex · 09:00–17:00
            </p>
          </div>
        </div>
      </div>

      <div className="container-v relative z-10 mt-14 pt-6 border-t border-veltrix-dark-4 flex flex-wrap gap-4 justify-between text-[9px] tracking-wider uppercase text-gray-500">
        <span>© {new Date().getFullYear()} Essence Pharma</span>
        <span>Apenas para fins de pesquisa · Não para consumo humano</span>
      </div>
    </footer>
  );
}
