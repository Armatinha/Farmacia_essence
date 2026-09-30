import { Link } from 'react-router-dom';
import { Package, Key, Activity, LogOut, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-veltrix-light-1 flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-veltrix-dark-1 border-r border-veltrix-dark-4 p-8 flex flex-col z-20 shadow-2xl shadow-black/50">
        <div className="mb-12">
          <Link to="/" className="flex items-center gap-3">
            <svg width="34" height="34" viewBox="0 0 40 40" fill="none">
              <path d="M4 6h7l10 18-4 7L4 6Z" fill="#b58a34"></path>
              <path d="M14 6h7l5 9 4-7h8L22 35l-4-7 8-13-5-9h-7Z" fill="#c29a48"></path>
            </svg>
            <div>
              <div className="text-[17px] font-semibold tracking-[.18em] leading-none text-veltrix-light-5">OXYGEN</div>
              <div className="mt-1 flex items-center gap-2">
                <span className="h-px w-5 bg-veltrix-gold-1"></span>
                <span className="text-[8px] tracking-[.3em] text-veltrix-border-1">ADMIN</span>
              </div>
            </div>
          </Link>
        </div>
        
        <nav className="flex flex-col gap-3 flex-grow">
          <p className="eyebrow text-veltrix-gold-4 mb-2 opacity-70">Menu Principal</p>
          <button className="flex items-center gap-4 px-5 py-4 bg-veltrix-dark-2 text-veltrix-gold-1 rounded-sm font-bold text-[10px] uppercase tracking-widest border border-veltrix-dark-4">
            <Activity size={16} /> Telemetria
          </button>
          <button className="flex items-center gap-4 px-5 py-4 text-veltrix-light-4 hover:bg-veltrix-dark-2 hover:text-veltrix-gold-2 rounded-sm font-bold text-[10px] uppercase tracking-widest transition-colors">
            <Package size={16} /> Produtos
          </button>
          <button className="flex items-center gap-4 px-5 py-4 text-veltrix-light-4 hover:bg-veltrix-dark-2 hover:text-veltrix-gold-2 rounded-sm font-bold text-[10px] uppercase tracking-widest transition-colors">
            <Key size={16} /> Lotes e Códigos
          </button>
        </nav>

        <div className="mt-auto pt-6 border-t border-veltrix-dark-4">
          <button className="flex items-center gap-4 px-5 py-4 text-veltrix-text-muted hover:text-red-400 w-full rounded-sm font-bold text-[10px] uppercase tracking-widest transition-colors">
            <LogOut size={16} /> Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8 md:p-14 lg:p-20 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-veltrix-gold-1/5 rounded-full blur-3xl pointer-events-none"></div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-14">
          <p className="eyebrow gold-text mb-3">Painel de Controle</p>
          <h1 className="font-display text-4xl md:text-5xl tracking-tighter text-veltrix-dark-3 mb-2">Visão Geral</h1>
          <p className="text-veltrix-text-dark font-display text-lg">Acompanhe as verificações de autenticidade em tempo real.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="bg-veltrix-light-3 p-8 border border-veltrix-border-2 card-lift relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-5 text-veltrix-dark-1"><Activity size={120} /></div>
            <p className="text-[10px] font-bold tracking-widest text-veltrix-text-muted uppercase mb-4">Total de Verificações</p>
            <h2 className="font-display text-5xl tracking-tighter text-veltrix-dark-3">1.284</h2>
            <p className="text-[#166534] text-xs font-mono font-bold mt-4 tracking-wider">+12% ESTA SEMANA</p>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="bg-veltrix-dark-2 p-8 border border-veltrix-dark-4 card-lift relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-10 text-veltrix-gold-1"><ShieldCheck size={120} /></div>
            <p className="text-[10px] font-bold tracking-widest text-veltrix-text-muted uppercase mb-4">Alertas de Fraude</p>
            <h2 className="font-display text-5xl tracking-tighter text-veltrix-gold-1">14</h2>
            <p className="text-veltrix-light-4 text-xs font-mono mt-4 tracking-wider">CÓDIGOS CHECADOS MÚLTIPLAS VEZES</p>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="bg-veltrix-light-3 p-8 border border-veltrix-border-2 card-lift relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-5 text-veltrix-dark-1"><Package size={120} /></div>
            <p className="text-[10px] font-bold tracking-widest text-veltrix-text-muted uppercase mb-4">Lotes Ativos</p>
            <h2 className="font-display text-5xl tracking-tighter text-veltrix-dark-3">8</h2>
            <p className="text-veltrix-text-dark text-xs font-mono mt-4 tracking-wider">15.000 CÓDIGOS NO BANCO</p>
          </motion.div>
        </div>

        {/* Table */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="bg-veltrix-light-3 border border-veltrix-border-2 relative z-10">
          <div className="px-8 py-6 border-b border-veltrix-border-2 bg-veltrix-light-2">
            <h3 className="font-display text-2xl tracking-tight text-veltrix-dark-3">Últimas Consultas</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-veltrix-border-2 text-[9px] uppercase tracking-widest text-veltrix-text-gray bg-veltrix-light-4">
                  <th className="px-8 py-5 font-bold">Data/Hora</th>
                  <th className="px-8 py-5 font-bold">Código Checado</th>
                  <th className="px-8 py-5 font-bold">Status</th>
                  <th className="px-8 py-5 font-bold">IP / Região</th>
                </tr>
              </thead>
              <tbody className="text-sm font-mono">
                <tr className="border-b border-veltrix-border-1 hover:bg-veltrix-light-4/50 transition-colors">
                  <td className="px-8 py-6 text-veltrix-text-dark text-xs">Hoje, 10:45</td>
                  <td className="px-8 py-6 text-veltrix-dark-3 font-bold tracking-widest">XY9-8L4-ZQX</td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1.5 border border-[#bbf7d0] bg-[#f0fdf4] text-[#166534] text-[10px] uppercase font-bold tracking-widest">Válido (1ª vez)</span>
                  </td>
                  <td className="px-8 py-6 text-veltrix-text-gray text-xs">BR / São Paulo</td>
                </tr>
                <tr className="border-b border-veltrix-border-1 hover:bg-veltrix-light-4/50 transition-colors">
                  <td className="px-8 py-6 text-veltrix-text-dark text-xs">Hoje, 09:12</td>
                  <td className="px-8 py-6 text-veltrix-dark-3 font-bold tracking-widest">A72-9B1-XXX</td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1.5 border border-[#fde68a] bg-[#fffbeb] text-[#92400e] text-[10px] uppercase font-bold tracking-widest">Alerta (3ª vez)</span>
                  </td>
                  <td className="px-8 py-6 text-veltrix-text-gray text-xs">BR / Rio de Janeiro</td>
                </tr>
                <tr className="hover:bg-veltrix-light-4/50 transition-colors">
                  <td className="px-8 py-6 text-veltrix-text-dark text-xs">Ontem, 16:30</td>
                  <td className="px-8 py-6 text-veltrix-dark-3 font-bold tracking-widest">INVALIDO-99</td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1.5 border border-[#fecaca] bg-[#fef2f2] text-[#991b1b] text-[10px] uppercase font-bold tracking-widest">Não Encontrado</span>
                  </td>
                  <td className="px-8 py-6 text-veltrix-text-gray text-xs">Desconhecido</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
