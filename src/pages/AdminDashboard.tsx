import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Key, 
  Activity, 
  LogOut, 
  ShieldCheck, 
  RefreshCw, 
  Plus, 
  Search, 
  Database, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  Copy,
  Check,
  X,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type TabType = 'telemetry' | 'products' | 'batches';

interface TelemetryMetrics {
  total_verifications: number;
  weekly_growth: string;
  fraud_alerts: number;
  active_batches: number;
  total_codes: number;
}

interface VerificationLog {
  id: number;
  created_at: string;
  code_queried: string;
  status_result: string;
  ip_address: string;
  location: string;
  user_agent: string;
  times_checked_at_moment: number;
  product_name?: string;
}

interface ProductItem {
  id: number;
  name: string;
  slug: string;
  concentration?: string;
  formula?: string;
  category?: string;
  purity?: string;
  description?: string;
  is_active: boolean;
}

interface BatchItem {
  id: number;
  batch_number: string;
  product_id: number;
  product_name: string;
  product_category: string;
  manufacturing_date: string;
  expiry_date: string;
  total_codes: number;
  active: boolean;
  generated_codes_count: string;
  checked_codes_count: string;
  fraud_alerts_count: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('telemetry');
  const [loading, setLoading] = useState(false);
  const [dbStatus, setDbStatus] = useState<'checking' | 'connected' | 'error'>('checking');

  // Telemetry state
  const [metrics, setMetrics] = useState<TelemetryMetrics>({
    total_verifications: 1284,
    weekly_growth: '+12% ESTA SEMANA',
    fraud_alerts: 14,
    active_batches: 4,
    total_codes: 15000
  });
  const [logs, setLogs] = useState<VerificationLog[]>([]);
  const [logSearch, setLogSearch] = useState('');

  // Products state
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    slug: '',
    concentration: '',
    formula: '',
    category: 'Peptídeos',
    purity: '≥ 99.0% HPLC',
    description: ''
  });

  // Batches state
  const [batches, setBatches] = useState<BatchItem[]>([]);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [showCodesModal, setShowCodesModal] = useState(false);
  const [selectedBatchCodes, setSelectedBatchCodes] = useState<any[]>([]);
  const [selectedBatchNumber, setSelectedBatchNumber] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const [newBatch, setNewBatch] = useState({
    batch_number: '',
    product_id: 1,
    quantity: 25,
    notes: ''
  });

  // Fetch telemetry metrics & logs
  const fetchTelemetry = async () => {
    try {
      setLoading(true);
      const [metricsRes, logsRes] = await Promise.all([
        fetch('/api/telemetry/metrics'),
        fetch(`/api/telemetry/logs?limit=25${logSearch ? `&search=${encodeURIComponent(logSearch)}` : ''}`)
      ]);

      if (metricsRes.ok) {
        const metricsData = await metricsRes.json();
        setMetrics(metricsData);
        setDbStatus('connected');
      }
      if (logsRes.ok) {
        const logsData = await logsRes.json();
        setLogs(logsData.logs || []);
      }
    } catch (err) {
      console.error('Erro ao conectar ao Neon backend:', err);
      setDbStatus('error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/products?all=true');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error('Erro ao carregar produtos:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch batches
  const fetchBatches = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/batches');
      if (res.ok) {
        const data = await res.json();
        setBatches(data);
      }
    } catch (err) {
      console.error('Erro ao carregar lotes:', err);
    } finally {
      setLoading(false);
    }
  };

  // View batch codes
  const handleViewCodes = async (batchId: number, batchNumber: string) => {
    try {
      setSelectedBatchNumber(batchNumber);
      setShowCodesModal(true);
      const res = await fetch(`/api/batches/${batchId}/codes?limit=100`);
      if (res.ok) {
        const data = await res.json();
        setSelectedBatchCodes(data.codes || []);
      }
    } catch (err) {
      console.error('Erro ao buscar códigos do lote:', err);
    }
  };

  // Create product
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.slug) return;
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });
      if (res.ok) {
        setShowProductModal(false);
        setNewProduct({
          name: '',
          slug: '',
          concentration: '',
          formula: '',
          category: 'Peptídeos',
          purity: '≥ 99.0% HPLC',
          description: ''
        });
        fetchProducts();
      }
    } catch (err) {
      console.error('Erro ao criar produto:', err);
    }
  };

  // Generate batch
  const handleGenerateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBatch.batch_number) return;
    try {
      const res = await fetch('/api/batches/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBatch)
      });
      if (res.ok) {
        setShowBatchModal(false);
        setNewBatch({
          batch_number: '',
          product_id: products[0]?.id || 1,
          quantity: 25,
          notes: ''
        });
        fetchBatches();
        fetchTelemetry();
      }
    } catch (err) {
      console.error('Erro ao gerar lote:', err);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Initial load
  useEffect(() => {
    fetchTelemetry();
    fetchProducts();
    fetchBatches();
  }, []);

  useEffect(() => {
    if (activeTab === 'telemetry') fetchTelemetry();
    if (activeTab === 'products') fetchProducts();
    if (activeTab === 'batches') fetchBatches();
  }, [activeTab]);

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-veltrix-light-1 flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-veltrix-dark-1 border-r border-veltrix-dark-4 p-8 flex flex-col z-20 shadow-2xl shadow-black/50">
        <div className="mb-10">
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

        {/* Database Status Indicator */}
        <div className="mb-8 p-3 rounded bg-veltrix-dark-2 border border-veltrix-dark-4 flex items-center gap-2 text-[10px] font-mono">
          <Database size={14} className="text-veltrix-gold-1 shrink-0" />
          <div className="flex-grow">
            <div className="text-veltrix-light-4 font-bold">Neon PostgreSQL 18</div>
            <div className="flex items-center gap-1.5 text-[9px]">
              {dbStatus === 'connected' && (
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Neon Online
                </span>
              )}
              {dbStatus === 'checking' && (
                <span className="flex items-center gap-1.5 text-amber-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                  Conectando...
                </span>
              )}
              {dbStatus === 'error' && (
                <span className="flex items-center gap-1.5 text-red-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                  Offline (Fallback)
                </span>
              )}
            </div>
          </div>
        </div>
        
        <nav className="flex flex-col gap-2 flex-grow">
          <p className="eyebrow text-veltrix-gold-4 mb-2 opacity-70">Menu Principal</p>
          <button 
            onClick={() => setActiveTab('telemetry')}
            className={`flex items-center gap-4 px-5 py-4 rounded-sm font-bold text-[10px] uppercase tracking-widest border transition-all cursor-pointer ${
              activeTab === 'telemetry' 
                ? 'bg-veltrix-dark-2 text-veltrix-gold-1 border-veltrix-dark-4 shadow-sm' 
                : 'text-veltrix-light-4 border-transparent hover:bg-veltrix-dark-2 hover:text-veltrix-gold-2'
            }`}
          >
            <Activity size={16} /> Telemetria
          </button>
          
          <button 
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-4 px-5 py-4 rounded-sm font-bold text-[10px] uppercase tracking-widest border transition-all cursor-pointer ${
              activeTab === 'products' 
                ? 'bg-veltrix-dark-2 text-veltrix-gold-1 border-veltrix-dark-4 shadow-sm' 
                : 'text-veltrix-light-4 border-transparent hover:bg-veltrix-dark-2 hover:text-veltrix-gold-2'
            }`}
          >
            <Package size={16} /> Produtos ({products.length})
          </button>

          <button 
            onClick={() => setActiveTab('batches')}
            className={`flex items-center gap-4 px-5 py-4 rounded-sm font-bold text-[10px] uppercase tracking-widest border transition-all cursor-pointer ${
              activeTab === 'batches' 
                ? 'bg-veltrix-dark-2 text-veltrix-gold-1 border-veltrix-dark-4 shadow-sm' 
                : 'text-veltrix-light-4 border-transparent hover:bg-veltrix-dark-2 hover:text-veltrix-gold-2'
            }`}
          >
            <Key size={16} /> Lotes e Códigos ({batches.length})
          </button>
        </nav>

        <div className="mt-auto pt-6 border-t border-veltrix-dark-4">
          <Link 
            to="/" 
            className="flex items-center gap-4 px-5 py-4 text-veltrix-text-muted hover:text-red-400 w-full rounded-sm font-bold text-[10px] uppercase tracking-widest transition-colors"
          >
            <LogOut size={16} /> Sair do Painel
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-6 md:p-12 lg:p-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-veltrix-gold-1/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <p className="eyebrow gold-text mb-2">Painel de Controle • Neon Cloud</p>
            <h1 className="font-display text-3xl md:text-5xl tracking-tighter text-veltrix-dark-3">
              {activeTab === 'telemetry' && 'Visão Geral & Telemetria'}
              {activeTab === 'products' && 'Gestão do Catálogo'}
              {activeTab === 'batches' && 'Lotes & Códigos de Segurança'}
            </h1>
            <p className="text-veltrix-text-dark font-display text-base mt-1">
              {activeTab === 'telemetry' && 'Acompanhe as verificações de autenticidade em tempo real gravadas no Neon.'}
              {activeTab === 'products' && 'Gerencie fórmulas, concentrações e especificações farmacêuticas.'}
              {activeTab === 'batches' && 'Gere novos lotes com milhares de códigos de autenticação anti-fraude.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                if (activeTab === 'telemetry') fetchTelemetry();
                if (activeTab === 'products') fetchProducts();
                if (activeTab === 'batches') fetchBatches();
              }}
              disabled={loading}
              className="p-3 bg-veltrix-light-3 hover:bg-veltrix-light-2 border border-veltrix-border-2 text-veltrix-dark-3 rounded cursor-pointer transition-colors shadow-xs"
              title="Atualizar dados"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin text-veltrix-gold-1' : ''} />
            </button>

            {activeTab === 'products' && (
              <button 
                onClick={() => setShowProductModal(true)}
                className="btn-gold flex items-center gap-2 text-xs"
              >
                <Plus size={16} /> Novo Produto
              </button>
            )}

            {activeTab === 'batches' && (
              <button 
                onClick={() => setShowBatchModal(true)}
                className="btn-gold flex items-center gap-2 text-xs"
              >
                <Plus size={16} /> Gerar Novo Lote
              </button>
            )}
          </div>
        </div>

        {/* TAB 1: TELEMETRY */}
        {activeTab === 'telemetry' && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
              <div className="bg-veltrix-light-3 p-8 border border-veltrix-border-2 card-lift relative overflow-hidden shadow-xs">
                <div className="absolute -right-4 -top-4 opacity-5 text-veltrix-dark-1"><Activity size={120} /></div>
                <p className="text-[10px] font-bold tracking-widest text-veltrix-text-muted uppercase mb-4">Total de Verificações</p>
                <h2 className="font-display text-5xl tracking-tighter text-veltrix-dark-3">{metrics.total_verifications.toLocaleString()}</h2>
                <p className="text-[#166534] text-xs font-mono font-bold mt-4 tracking-wider">{metrics.weekly_growth}</p>
              </div>
              
              <div className="bg-veltrix-dark-2 p-8 border border-veltrix-dark-4 card-lift relative overflow-hidden shadow-xs">
                <div className="absolute -right-4 -top-4 opacity-10 text-veltrix-gold-1"><ShieldCheck size={120} /></div>
                <p className="text-[10px] font-bold tracking-widest text-veltrix-text-muted uppercase mb-4">Alertas de Fraude</p>
                <h2 className="font-display text-5xl tracking-tighter text-veltrix-gold-1">{metrics.fraud_alerts}</h2>
                <p className="text-veltrix-light-4 text-xs font-mono mt-4 tracking-wider">CÓDIGOS CHECADOS MÚLTIPLAS VEZES</p>
              </div>
              
              <div className="bg-veltrix-light-3 p-8 border border-veltrix-border-2 card-lift relative overflow-hidden shadow-xs">
                <div className="absolute -right-4 -top-4 opacity-5 text-veltrix-dark-1"><Package size={120} /></div>
                <p className="text-[10px] font-bold tracking-widest text-veltrix-text-muted uppercase mb-4">Lotes Ativos</p>
                <h2 className="font-display text-5xl tracking-tighter text-veltrix-dark-3">{metrics.active_batches}</h2>
                <p className="text-veltrix-text-dark text-xs font-mono mt-4 tracking-wider">
                  {metrics.total_codes.toLocaleString()} CÓDIGOS REGISTRADOS
                </p>
              </div>
            </div>

            {/* Live Queries Table */}
            <div className="bg-veltrix-light-3 border border-veltrix-border-2 relative z-10 shadow-xs">
              <div className="px-8 py-6 border-b border-veltrix-border-2 bg-veltrix-light-2 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="font-display text-2xl tracking-tight text-veltrix-dark-3">Últimas Consultas Registradas</h3>
                  <p className="text-xs text-veltrix-text-gray font-mono mt-1">Sincronizado diretamente do Neon PostgreSQL via procedure RPC atômica</p>
                </div>
                <div className="relative w-full md:w-64">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-veltrix-text-muted" />
                  <input 
                    type="text" 
                    placeholder="Filtrar por código..." 
                    value={logSearch}
                    onChange={(e) => setLogSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && fetchTelemetry()}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-veltrix-border-2 text-veltrix-dark-3 placeholder:text-veltrix-text-muted uppercase font-mono"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="border-b border-veltrix-border-2 text-[9px] uppercase tracking-widest text-veltrix-text-gray bg-veltrix-light-4">
                      <th className="px-8 py-5 font-bold">Data / Hora</th>
                      <th className="px-8 py-5 font-bold">Código Checado</th>
                      <th className="px-8 py-5 font-bold">Status no Banco</th>
                      <th className="px-8 py-5 font-bold">Produto</th>
                      <th className="px-8 py-5 font-bold">IP / Região</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm font-mono">
                    {logs.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-8 py-10 text-center text-veltrix-text-muted">
                          Nenhum registro encontrado no Neon.
                        </td>
                      </tr>
                    ) : (
                      logs.map((log) => (
                        <tr key={log.id} className="border-b border-veltrix-border-1 hover:bg-veltrix-light-4/50 transition-colors">
                          <td className="px-8 py-5 text-veltrix-text-dark text-xs">{formatDate(log.created_at)}</td>
                          <td className="px-8 py-5 text-veltrix-dark-3 font-bold tracking-widest text-xs">{log.code_queried}</td>
                          <td className="px-8 py-5">
                            {log.status_result === 'VALID_FIRST_TIME' && (
                              <span className="px-3 py-1.5 border border-[#bbf7d0] bg-[#f0fdf4] text-[#166534] text-[10px] uppercase font-bold tracking-widest inline-flex items-center gap-1.5">
                                <CheckCircle2 size={12} /> Válido (1ª vez)
                              </span>
                            )}
                            {log.status_result === 'WARNING_MULTIPLE_USE' && (
                              <span className="px-3 py-1.5 border border-[#fde68a] bg-[#fffbeb] text-[#92400e] text-[10px] uppercase font-bold tracking-widest inline-flex items-center gap-1.5">
                                <AlertTriangle size={12} /> Alerta ({log.times_checked_at_moment}ª vez)
                              </span>
                            )}
                            {log.status_result === 'NOT_FOUND' && (
                              <span className="px-3 py-1.5 border border-[#fecaca] bg-[#fef2f2] text-[#991b1b] text-[10px] uppercase font-bold tracking-widest inline-flex items-center gap-1.5">
                                <XCircle size={12} /> Não Encontrado
                              </span>
                            )}
                            {log.status_result === 'REVOKED' && (
                              <span className="px-3 py-1.5 border border-purple-200 bg-purple-50 text-purple-800 text-[10px] uppercase font-bold tracking-widest inline-flex items-center gap-1.5">
                                Revogado
                              </span>
                            )}
                          </td>
                          <td className="px-8 py-5 text-veltrix-dark-3 text-xs font-sans font-medium">
                            {log.product_name || '-'}
                          </td>
                          <td className="px-8 py-5 text-veltrix-text-gray text-xs">
                            {log.location || 'BR / Brasil'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: PRODUCTS */}
        {activeTab === 'products' && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <div key={p.id} className="bg-veltrix-light-3 border border-veltrix-border-2 p-6 flex flex-col justify-between shadow-xs card-lift">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="px-2 py-0.5 bg-veltrix-gold-1 text-veltrix-dark-3 font-mono text-[9px] font-bold uppercase">
                        {p.category || 'Peptídeos'}
                      </span>
                      <span className="font-mono text-xs text-[#15803d] font-bold">
                        {p.purity || '≥ 99.0%'}
                      </span>
                    </div>
                    <h3 className="font-display text-2xl text-veltrix-dark-3 font-bold mb-1">{p.name}</h3>
                    <p className="font-mono text-xs text-veltrix-gold-5 mb-3">{p.formula || '-'}</p>
                    <p className="text-xs text-veltrix-text-dark line-clamp-3 leading-relaxed mb-4">
                      {p.description || 'Sem descrição cadastrada.'}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-veltrix-border-2 flex justify-between items-center text-xs font-mono">
                    <span className="text-veltrix-text-muted">Concentração:</span>
                    <strong className="text-veltrix-dark-3">{p.concentration || '-'}</strong>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* TAB 3: BATCHES */}
        {activeTab === 'batches' && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="bg-veltrix-light-3 border border-veltrix-border-2 overflow-hidden shadow-xs">
              <div className="px-8 py-6 border-b border-veltrix-border-2 bg-veltrix-light-2">
                <h3 className="font-display text-2xl tracking-tight text-veltrix-dark-3">Lotes Registrados na Fábrica</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="border-b border-veltrix-border-2 text-[9px] uppercase tracking-widest text-veltrix-text-gray bg-veltrix-light-4">
                      <th className="px-8 py-5 font-bold">Nº do Lote</th>
                      <th className="px-8 py-5 font-bold">Produto Associado</th>
                      <th className="px-8 py-5 font-bold">Códigos Ativos</th>
                      <th className="px-8 py-5 font-bold">Consultas Realizadas</th>
                      <th className="px-8 py-5 font-bold">Alertas de Fraude</th>
                      <th className="px-8 py-5 font-bold">Validade</th>
                      <th className="px-8 py-5 font-bold">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm font-mono">
                    {batches.map((b) => (
                      <tr key={b.id} className="border-b border-veltrix-border-1 hover:bg-veltrix-light-4/50 transition-colors">
                        <td className="px-8 py-5 text-veltrix-dark-3 font-bold tracking-wider text-xs">
                          {b.batch_number}
                        </td>
                        <td className="px-8 py-5 font-sans font-medium text-veltrix-dark-3 text-xs">
                          {b.product_name}
                        </td>
                        <td className="px-8 py-5 text-veltrix-dark-3 text-xs font-bold">
                          {parseInt(b.generated_codes_count || '0', 10) > 0 ? b.generated_codes_count : b.total_codes}
                        </td>
                        <td className="px-8 py-5 text-veltrix-text-dark text-xs">
                          {b.checked_codes_count || 0}
                        </td>
                        <td className="px-8 py-5 text-xs">
                          {parseInt(b.fraud_alerts_count || '0', 10) > 0 ? (
                            <span className="text-[#b45309] font-bold">{b.fraud_alerts_count} alertas</span>
                          ) : (
                            <span className="text-emerald-700">0</span>
                          )}
                        </td>
                        <td className="px-8 py-5 text-veltrix-text-muted text-xs">
                          {b.expiry_date ? new Date(b.expiry_date).toLocaleDateString('pt-BR') : '-'}
                        </td>
                        <td className="px-8 py-5">
                          <button 
                            onClick={() => handleViewCodes(b.id, b.batch_number)}
                            className="text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 bg-veltrix-dark-2 text-veltrix-light-5 hover:text-veltrix-gold-1 rounded cursor-pointer transition-colors"
                          >
                            Ver Códigos
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* MODAL: NOVO PRODUTO */}
        <AnimatePresence>
          {showProductModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-veltrix-light-3 border border-veltrix-border-2 p-8 max-w-lg w-full shadow-2xl relative"
              >
                <button 
                  onClick={() => setShowProductModal(false)}
                  className="absolute right-5 top-5 text-veltrix-text-muted hover:text-veltrix-dark-3"
                >
                  <X size={20} />
                </button>
                <h3 className="font-display text-2xl text-veltrix-dark-3 mb-6">Cadastrar Novo Produto</h3>

                <form onSubmit={handleCreateProduct} className="flex flex-col gap-4 text-xs font-mono">
                  <div>
                    <label className="block text-veltrix-text-muted uppercase mb-1">Nome do Composto</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ex: EPITHALON"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                      className="w-full p-2.5 bg-white border border-veltrix-border-2 text-veltrix-dark-3 font-sans"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-veltrix-text-muted uppercase mb-1">Slug</label>
                      <input 
                        type="text" 
                        required
                        value={newProduct.slug}
                        onChange={(e) => setNewProduct({ ...newProduct, slug: e.target.value })}
                        className="w-full p-2.5 bg-white border border-veltrix-border-2 text-veltrix-dark-3"
                      />
                    </div>
                    <div>
                      <label className="block text-veltrix-text-muted uppercase mb-1">Concentração</label>
                      <input 
                        type="text" 
                        placeholder="Ex: 50 mg"
                        value={newProduct.concentration}
                        onChange={(e) => setNewProduct({ ...newProduct, concentration: e.target.value })}
                        className="w-full p-2.5 bg-white border border-veltrix-border-2 text-veltrix-dark-3"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-veltrix-text-muted uppercase mb-1">Fórmula Molecular</label>
                      <input 
                        type="text" 
                        placeholder="Ex: C₁₄H₂₂N₄O₉"
                        value={newProduct.formula}
                        onChange={(e) => setNewProduct({ ...newProduct, formula: e.target.value })}
                        className="w-full p-2.5 bg-white border border-veltrix-border-2 text-veltrix-dark-3"
                      />
                    </div>
                    <div>
                      <label className="block text-veltrix-text-muted uppercase mb-1">Pureza HPLC</label>
                      <input 
                        type="text" 
                        value={newProduct.purity}
                        onChange={(e) => setNewProduct({ ...newProduct, purity: e.target.value })}
                        className="w-full p-2.5 bg-white border border-veltrix-border-2 text-veltrix-dark-3"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-veltrix-text-muted uppercase mb-1">Descrição</label>
                    <textarea 
                      rows={3}
                      placeholder="Descrição técnica e apresentação..."
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      className="w-full p-2.5 bg-white border border-veltrix-border-2 text-veltrix-dark-3 font-sans"
                    />
                  </div>
                  <div className="flex justify-end gap-3 mt-4">
                    <button 
                      type="button" 
                      onClick={() => setShowProductModal(false)}
                      className="px-4 py-2 border border-veltrix-border-2 text-veltrix-text-muted hover:bg-veltrix-light-2"
                    >
                      Cancelar
                    </button>
                    <button type="submit" className="btn-gold">
                      Salvar no Neon
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL: GERAR NOVO LOTE */}
        <AnimatePresence>
          {showBatchModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-veltrix-light-3 border border-veltrix-border-2 p-8 max-w-lg w-full shadow-2xl relative"
              >
                <button 
                  onClick={() => setShowBatchModal(false)}
                  className="absolute right-5 top-5 text-veltrix-text-muted hover:text-veltrix-dark-3"
                >
                  <X size={20} />
                </button>
                <h3 className="font-display text-2xl text-veltrix-dark-3 mb-2">Gerador de Lotes e Códigos</h3>
                <p className="text-xs text-veltrix-text-gray font-mono mb-6">Gera códigos criptograficamente seguros em transação no Neon PostgreSQL.</p>

                <form onSubmit={handleGenerateBatch} className="flex flex-col gap-4 text-xs font-mono">
                  <div>
                    <label className="block text-veltrix-text-muted uppercase mb-1">Produto</label>
                    <select 
                      value={newBatch.product_id}
                      onChange={(e) => setNewBatch({ ...newBatch, product_id: parseInt(e.target.value, 10) })}
                      className="w-full p-2.5 bg-white border border-veltrix-border-2 text-veltrix-dark-3 font-sans"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>{p.name} ({p.concentration || p.category})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-veltrix-text-muted uppercase mb-1">Identificador do Lote</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ex: LOT-GHK-2026E"
                      value={newBatch.batch_number}
                      onChange={(e) => setNewBatch({ ...newBatch, batch_number: e.target.value.toUpperCase() })}
                      className="w-full p-2.5 bg-white border border-veltrix-border-2 text-veltrix-dark-3 uppercase font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-veltrix-text-muted uppercase mb-1">Quantidade de Códigos a Gerar</label>
                    <input 
                      type="number" 
                      min="5"
                      max="1000"
                      value={newBatch.quantity}
                      onChange={(e) => setNewBatch({ ...newBatch, quantity: parseInt(e.target.value, 10) || 10 })}
                      className="w-full p-2.5 bg-white border border-veltrix-border-2 text-veltrix-dark-3"
                    />
                    <span className="text-[10px] text-veltrix-text-muted mt-1 block">Cada código receberá formato alfanumérico seguro XXX-XXX-XXX.</span>
                  </div>
                  <div className="flex justify-end gap-3 mt-4">
                    <button 
                      type="button" 
                      onClick={() => setShowBatchModal(false)}
                      className="px-4 py-2 border border-veltrix-border-2 text-veltrix-text-muted hover:bg-veltrix-light-2"
                    >
                      Cancelar
                    </button>
                    <button type="submit" className="btn-gold flex items-center gap-2">
                      <Layers size={14} /> Gerar e Salvar no Neon
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL: VER CÓDIGOS DO LOTE */}
        <AnimatePresence>
          {showCodesModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-veltrix-light-3 border border-veltrix-border-2 p-8 max-w-2xl w-full shadow-2xl relative max-h-[85vh] flex flex-col"
              >
                <button 
                  onClick={() => setShowCodesModal(false)}
                  className="absolute right-5 top-5 text-veltrix-text-muted hover:text-veltrix-dark-3"
                >
                  <X size={20} />
                </button>
                <h3 className="font-display text-2xl text-veltrix-dark-3 mb-1">Códigos do Lote {selectedBatchNumber}</h3>
                <p className="text-xs text-veltrix-text-gray font-mono mb-6">
                  {selectedBatchCodes.length} códigos carregados do Neon PostgreSQL. Clique para copiar.
                </p>

                <div className="flex-grow overflow-y-auto pr-2 grid grid-cols-2 md:grid-cols-3 gap-2.5 font-mono text-xs">
                  {selectedBatchCodes.map((c) => (
                    <div 
                      key={c.id} 
                      onClick={() => copyToClipboard(c.code)}
                      className="p-3 bg-white border border-veltrix-border-2 hover:border-veltrix-gold-1 flex justify-between items-center cursor-pointer transition-colors group"
                    >
                      <div>
                        <span className="font-bold text-veltrix-dark-3 block">{c.code}</span>
                        <span className="text-[9px] text-veltrix-text-muted">
                          {c.times_checked === 0 ? 'Não consultado' : `${c.times_checked}x consultado`}
                        </span>
                      </div>
                      {copiedCode === c.code ? (
                        <Check size={14} className="text-emerald-600" />
                      ) : (
                        <Copy size={14} className="text-veltrix-text-muted group-hover:text-veltrix-gold-2" />
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-veltrix-border-2 flex justify-between items-center text-xs font-mono">
                  <span className="text-veltrix-text-muted">Copie qualquer código e teste na página de Autenticação.</span>
                  <Link 
                    to="/autenticacao" 
                    target="_blank" 
                    className="flex items-center gap-1.5 text-veltrix-gold-5 font-bold hover:underline"
                  >
                    Testar Validador <ArrowUpRight size={14} />
                  </Link>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}
