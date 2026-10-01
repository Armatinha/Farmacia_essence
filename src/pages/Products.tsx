import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import heroImage from '../assets/hero.png';

interface ProductItem {
  id: number;
  name: string;
  concentration?: string;
  formula?: string;
  category?: string;
  purity?: string;
  description?: string;
  presentations?: string;
  image_url?: string;
}

const initialProducts: ProductItem[] = [
  {
    id: 1,
    name: 'GHK-Cu',
    concentration: '100 mg',
    formula: 'C₁₄H₂₄CuN₆O₄',
    category: 'Peptídeos',
    purity: '≥ 98.9% HPLC',
    description: 'Complexo de peptídeo de cobre associado ao suporte de pele, cabelo e tecidos.',
    presentations: '3 apresentações: Liofilizado · Solução · Caneta injetável'
  },
  {
    id: 2,
    name: 'GLOW',
    concentration: '70 mg',
    formula: 'OXY-G7',
    category: 'Peptídeos',
    purity: '≥ 99.0% HPLC',
    description: 'Blend focado na radiância da pele, suporte à hidratação e bem-estar cosmético.',
    presentations: '2 apresentações: Liofilizado · Caneta injetável'
  },
  {
    id: 3,
    name: 'RETAGEN',
    concentration: '40 mg',
    formula: 'OXY-R4',
    category: 'Hormonal',
    purity: '≥ 99.4% HPLC',
    description: 'Retatrutida - formulação de triplo agonista avançada.',
    presentations: '2 apresentações: Liofilizado · Caneta injetável'
  },
  {
    id: 4,
    name: 'TIRZEGEN',
    concentration: '60 mg',
    formula: 'OXY-T6',
    category: 'Hormonal',
    purity: '≥ 99.2% HPLC',
    description: 'Tirzepatida - formulação de duplo agonista otimizada.',
    presentations: '2 apresentações: Liofilizado · Caneta injetável'
  }
];

export default function Products() {
  const { t } = useTranslation();
  const [productList, setProductList] = useState<ProductItem[]>(initialProducts);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Falha ao carregar produtos');
      })
      .then((data: ProductItem[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setProductList(data);
        }
      })
      .catch((err) => {
        console.warn('Usando catálogo inicial local:', err);
      });
  }, []);

  return (
    <div className="bg-veltrix-light-1 min-h-screen">
      <div className="container-v py-12 md:py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6"
        >
          <div>
            <p className="eyebrow gold-text mb-4">{t('products.eyebrow')}</p>
            <h1 className="font-display text-5xl md:text-6xl tracking-tighter text-veltrix-dark-3">
              {t('products.title')}
            </h1>
          </div>
          <p className="text-veltrix-text-dark max-w-md font-display text-lg">
            {t('products.description')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {productList.map((product, index) => (
            <motion.article 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true, margin: "-50px" }} 
              transition={{ duration: 0.5, delay: index * 0.1 }}
              key={product.id} 
              className="card-lift group border border-veltrix-border-2 bg-veltrix-light-3 overflow-hidden flex flex-col"
            >
              <div className="relative overflow-hidden bg-veltrix-light-4 h-52">
                <img 
                  alt={product.name} 
                  className="w-full h-full object-cover grayscale-[.08] group-hover:scale-[1.03] transition-transform duration-700" 
                  src={product.image_url || heroImage} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-veltrix-dark-1/30 to-transparent"></div>
                
                <span className="absolute top-4 left-4 bg-veltrix-light-1/95 px-3 py-1.5 font-mono text-[9px] font-bold border border-veltrix-border-1">
                  {product.purity || '≥ 99.0%'}
                </span>
                <span className="absolute bottom-4 right-4 bg-veltrix-gold-1 text-veltrix-dark-3 px-2 py-1 font-mono text-[9px] font-bold">
                  {product.category || 'Peptídeos'}
                </span>
              </div>
              
              <div className="p-5 flex-grow flex flex-col">
                <div className="flex justify-between gap-3 items-end">
                  <h3 className="font-display text-2xl tracking-tight text-veltrix-dark-3">{product.name}</h3>
                  <span className="font-mono text-[10px] text-veltrix-text-gray pt-2">{product.concentration}</span>
                </div>
                <p className="font-mono text-[9px] text-veltrix-gold-5 mt-2">{product.formula}</p>
                <p className="text-sm text-veltrix-text-dark mt-4 line-clamp-3 leading-relaxed flex-grow">
                  {product.description}
                </p>
                <div className="mt-5 w-full flex justify-between items-center border-t border-veltrix-border-3 pt-4 text-[10px] uppercase tracking-[.15em] font-bold text-veltrix-dark-3 group-hover:text-veltrix-gold-2 cursor-pointer transition-colors">
                  {t('products.btn')}
                  <ArrowRight size={14} />
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="mt-24 p-12 bg-veltrix-dark-2 border border-veltrix-dark-4 text-center flex flex-col items-center"
        >
          <p className="eyebrow text-veltrix-gold-4 mb-4">{t('products.authEyebrow')}</p>
          <h3 className="font-display text-3xl md:text-4xl tracking-tight text-veltrix-light-5 mb-4">{t('products.authTitle')}</h3>
          <p className="text-veltrix-text-muted max-w-xl mb-10 text-sm md:text-base leading-relaxed">
            {t('products.authDesc')}
          </p>
          <Link to="/autenticacao" className="btn-gold">{t('products.authBtn')}</Link>
        </motion.div>
      </div>
    </div>
  );
}
