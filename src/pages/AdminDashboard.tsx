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
  ArrowUpRight,
  Upload,
  Download,
  Trash2,
  FileSpreadsheet,
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import essenceEmblem from '../assets/essence-emblem.png';

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
  presentations?: string;
  image_url?: string;
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
    weekly_growth: '+12% THIS WEEK',
    fraud_alerts: 14,
    active_batches: 4,
    total_codes: 15000
  });
  const [logs, setLogs] = useState<VerificationLog[]>([]);
  const [logSearch, setLogSearch] = useState('');

  // Products state
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    slug: '',
    concentration: '',
    formula: '',
    category: 'Peptides',
    purity: '≥ 99.0% HPLC',
    description: '',
    presentations: 'Lyophilized powder · Dosing pen',
    image_url: '/essence-vials.png'
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

  // Bulk Import state
  const [showImportModal, setShowImportModal] = useState(false);
  const [importType, setImportType] = useState<'products' | 'batches'>('products');
  const [csvContent, setCsvContent] = useState('');
  const [importLoading, setImportLoading] = useState(false);
  const [importResult, setImportResult] = useState<{ success: boolean; message: string } | null>(null);

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
      console.error('Error connecting to backend API:', err);
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
      console.error('Error loading products:', err);
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
      console.error('Error loading batches:', err);
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
      console.error('Error fetching batch codes:', err);
    }
  };

  // Upload product image file
  const handleProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) {
        setImageUploading(false);
        return;
      }

      try {
        const res = await fetch('/api/products/upload-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: file.name, dataUrl })
        });
        if (res.ok) {
          const data = await res.json();
          setNewProduct((prev) => ({ ...prev, image_url: data.url }));
        } else {
          setNewProduct((prev) => ({ ...prev, image_url: dataUrl }));
        }
      } catch (err) {
        console.error('Image upload server error, falling back to dataUrl:', err);
        setNewProduct((prev) => ({ ...prev, image_url: dataUrl }));
      } finally {
        setImageUploading(false);
      }
    };
    reader.readAsDataURL(file);
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
          category: 'Peptides',
          purity: '≥ 99.0% HPLC',
          description: '',
          presentations: 'Lyophilized powder · Dosing pen',
          image_url: '/essence-vials.png'
        });
        fetchProducts();
      }
    } catch (err) {
      console.error('Error creating product:', err);
    }
  };

  // Delete product
  const handleDeleteProduct = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete compound "${name}"?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchProducts();
      } else {
        alert('Failed to delete product.');
      }
    } catch (err) {
      console.error('Error deleting product:', err);
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
      console.error('Error generating batch:', err);
    }
  };

  // Delete batch
  const handleDeleteBatch = async (id: number, batchNumber: string) => {
    if (!window.confirm(`Are you sure you want to delete batch "${batchNumber}" and all associated security codes?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/batches/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchBatches();
        fetchTelemetry();
      } else {
        alert('Failed to delete batch.');
      }
    } catch (err) {
      console.error('Error deleting batch:', err);
    }
  };

  // Export codes to CSV
  const handleExportCSV = () => {
    if (!selectedBatchCodes || selectedBatchCodes.length === 0) return;
    const header = 'Code,Batch,Status,TimesChecked,FirstCheckedAt\n';
    const rows = selectedBatchCodes
      .map(c => `"${c.code}","${selectedBatchNumber}","${c.status || 'ACTIVE'}","${c.times_checked || 0}","${c.first_checked_at || ''}"`)
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Essence_Batch_${selectedBatchNumber}_Codes.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export codes to TXT
  const handleExportTXT = () => {
    if (!selectedBatchCodes || selectedBatchCodes.length === 0) return;
    const rows = selectedBatchCodes.map(c => c.code).join('\n');
    const blob = new Blob([rows], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Essence_Batch_${selectedBatchNumber}_Codes.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle CSV file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setCsvContent(text);
      }
    };
    reader.readAsText(file);
  };

  // Handle Bulk Import submit
  const handleImportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvContent.trim()) return;

    setImportLoading(true);
    setImportResult(null);

    try {
      const lines = csvContent.trim().split(/\r?\n/).filter(l => l.trim().length > 0);
      if (lines.length < 2) {
        setImportResult({ success: false, message: 'CSV must contain a header and at least one data row.' });
        setImportLoading(false);
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, '').toLowerCase());

      if (importType === 'products') {
        const productsToImport = [];
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));
          if (cols.length === 0 || !cols[0]) continue;
          
          const rowObj: any = {};
          headers.forEach((h, idx) => {
            rowObj[h] = cols[idx] || '';
          });

          productsToImport.push({
            name: rowObj.name || cols[0],
            slug: rowObj.slug || (rowObj.name || cols[0]).toLowerCase().replace(/[^a-z0-9]/g, '-'),
            concentration: rowObj.concentration || cols[2] || '',
            formula: rowObj.formula || cols[3] || '',
            category: rowObj.category || cols[4] || 'Peptides',
            purity: rowObj.purity || cols[5] || '≥ 99.0% HPLC',
            description: rowObj.description || cols[6] || '',
            presentations: rowObj.presentations || cols[7] || '',
            image_url: rowObj.image_url || cols[8] || '/essence-vials.png'
          });
        }

        const res = await fetch('/api/products/bulk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ products: productsToImport })
        });
        const data = await res.json();
        if (res.ok) {
          setImportResult({ success: true, message: data.message || `Successfully imported ${productsToImport.length} products!` });
          fetchProducts();
        } else {
          setImportResult({ success: false, message: data.error || 'Failed to import products.' });
        }
      } else {
        // Batches import
        const batchesMap = new Map<string, any>();
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));
          if (cols.length === 0 || !cols[0]) continue;

          const rowObj: any = {};
          headers.forEach((h, idx) => {
            rowObj[h] = cols[idx] || '';
          });

          const batchNumber = (rowObj.batch_number || cols[0]).toUpperCase();
          if (!batchNumber) continue;

          if (!batchesMap.has(batchNumber)) {
            batchesMap.set(batchNumber, {
              batch_number: batchNumber,
              product_slug: rowObj.product_slug || cols[1] || '',
              quantity: parseInt(rowObj.quantity || cols[2] || '25', 10),
              manufacturing_date: rowObj.manufacturing_date || cols[3] || null,
              expiry_date: rowObj.expiry_date || cols[4] || null,
              notes: rowObj.notes || cols[5] || '',
              codes: []
            });
          }

          if (rowObj.code && rowObj.code.length === 6) {
            batchesMap.get(batchNumber).codes.push(rowObj.code.toUpperCase());
          }
        }

        const batchesToImport = Array.from(batchesMap.values());
        const res = await fetch('/api/batches/bulk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ batches: batchesToImport })
        });
        const data = await res.json();
        if (res.ok) {
          setImportResult({ success: true, message: data.message || `Successfully registered ${batchesToImport.length} batches!` });
          fetchBatches();
          fetchTelemetry();
        } else {
          setImportResult({ success: false, message: data.error || 'Failed to import batches.' });
        }
      }
    } catch (err: any) {
      console.error('Import error:', err);
      setImportResult({ success: false, message: `Error processing CSV: ${err.message}` });
    } finally {
      setImportLoading(false);
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
      return d.toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' });
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
            <img src={essenceEmblem} alt="Essence Emblem" className="w-8 h-8 rounded-md object-cover shadow-xs border border-veltrix-dark-4" />
            <div>
              <div className="text-[17px] font-semibold tracking-[.18em] leading-none text-veltrix-light-5">ESSENCE</div>
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
            <div className="text-veltrix-light-4 font-bold">Security Core</div>
            <div className="flex items-center gap-1.5 text-[9px]">
              {dbStatus === 'connected' && (
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active & Online
                </span>
              )}
              {dbStatus === 'checking' && (
                <span className="flex items-center gap-1.5 text-amber-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                  Connecting...
                </span>
              )}
              {dbStatus === 'error' && (
                <span className="flex items-center gap-1.5 text-red-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                  Offline Mode
                </span>
              )}
            </div>
          </div>
        </div>
        
        <nav className="flex flex-col gap-2 flex-grow">
          <p className="eyebrow text-veltrix-gold-4 mb-2 opacity-70">Main Menu</p>
          <button 
            onClick={() => setActiveTab('telemetry')}
            className={`flex items-center gap-4 px-5 py-4 rounded-sm font-bold text-[10px] uppercase tracking-widest border transition-all cursor-pointer ${
              activeTab === 'telemetry' 
                ? 'bg-veltrix-dark-2 text-veltrix-gold-1 border-veltrix-dark-4 shadow-sm' 
                : 'text-veltrix-light-4 border-transparent hover:bg-veltrix-dark-2 hover:text-veltrix-gold-2'
            }`}
          >
            <Activity size={16} /> Telemetry
          </button>
          
          <button 
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-4 px-5 py-4 rounded-sm font-bold text-[10px] uppercase tracking-widest border transition-all cursor-pointer ${
              activeTab === 'products' 
                ? 'bg-veltrix-dark-2 text-veltrix-gold-1 border-veltrix-dark-4 shadow-sm' 
                : 'text-veltrix-light-4 border-transparent hover:bg-veltrix-dark-2 hover:text-veltrix-gold-2'
            }`}
          >
            <Package size={16} /> Products ({products.length})
          </button>

          <button 
            onClick={() => setActiveTab('batches')}
            className={`flex items-center gap-4 px-5 py-4 rounded-sm font-bold text-[10px] uppercase tracking-widest border transition-all cursor-pointer ${
              activeTab === 'batches' 
                ? 'bg-veltrix-dark-2 text-veltrix-gold-1 border-veltrix-dark-4 shadow-sm' 
                : 'text-veltrix-light-4 border-transparent hover:bg-veltrix-dark-2 hover:text-veltrix-gold-2'
            }`}
          >
            <Key size={16} /> Batches & Codes ({batches.length})
          </button>
        </nav>

        <div className="mt-auto pt-6 border-t border-veltrix-dark-4">
          <Link 
            to="/" 
            className="flex items-center gap-4 px-5 py-4 text-veltrix-text-muted hover:text-red-400 w-full rounded-sm font-bold text-[10px] uppercase tracking-widest transition-colors"
          >
            <LogOut size={16} /> Exit Dashboard
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-6 md:p-12 lg:p-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-veltrix-gold-1/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <p className="eyebrow gold-text mb-2">Control Panel • Enterprise Security</p>
            <h1 className="font-display text-3xl md:text-5xl tracking-tighter text-veltrix-dark-3">
              {activeTab === 'telemetry' && 'Overview & Telemetry'}
              {activeTab === 'products' && 'Catalog Management'}
              {activeTab === 'batches' && 'Batches & Security Codes'}
            </h1>
            <p className="text-veltrix-text-dark font-display text-base mt-1">
              {activeTab === 'telemetry' && 'Track real-time authenticity verifications logged in the central security registry.'}
              {activeTab === 'products' && 'Manage formulations, concentrations, and pharmaceutical specifications.'}
              {activeTab === 'batches' && 'Generate new batches with thousands of unique 6-character anti-counterfeit security codes.'}
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
              title="Refresh data"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin text-veltrix-gold-1' : ''} />
            </button>

            <button 
              onClick={() => {
                setImportType(activeTab === 'batches' ? 'batches' : 'products');
                setShowImportModal(true);
                setImportResult(null);
              }}
              className="px-4 py-2.5 bg-veltrix-light-3 hover:bg-veltrix-light-2 border border-veltrix-border-2 text-veltrix-dark-3 rounded font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors shadow-xs"
              title="Import spreadsheet data"
            >
              <Upload size={14} className="text-veltrix-gold-1" /> Import CSV
            </button>

            {activeTab === 'products' && (
              <button 
                onClick={() => setShowProductModal(true)}
                className="btn-gold flex items-center gap-2 text-xs"
              >
                <Plus size={16} /> New Product
              </button>
            )}

            {activeTab === 'batches' && (
              <button 
                onClick={() => setShowBatchModal(true)}
                className="btn-gold flex items-center gap-2 text-xs"
              >
                <Plus size={16} /> Generate New Batch
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
                <p className="text-[10px] font-bold tracking-widest text-veltrix-text-muted uppercase mb-4">Total Verifications</p>
                <h2 className="font-display text-5xl tracking-tighter text-veltrix-dark-3">{metrics.total_verifications.toLocaleString()}</h2>
                <p className="text-[#166534] text-xs font-mono font-bold mt-4 tracking-wider">{metrics.weekly_growth}</p>
              </div>
              
              <div className="bg-veltrix-dark-2 p-8 border border-veltrix-dark-4 card-lift relative overflow-hidden shadow-xs">
                <div className="absolute -right-4 -top-4 opacity-10 text-veltrix-gold-1"><ShieldCheck size={120} /></div>
                <p className="text-[10px] font-bold tracking-widest text-veltrix-text-muted uppercase mb-4">Fraud Alerts</p>
                <h2 className="font-display text-5xl tracking-tighter text-veltrix-gold-1">{metrics.fraud_alerts}</h2>
                <p className="text-veltrix-light-4 text-xs font-mono mt-4 tracking-wider">CODES CHECKED MULTIPLE TIMES</p>
              </div>
              
              <div className="bg-veltrix-light-3 p-8 border border-veltrix-border-2 card-lift relative overflow-hidden shadow-xs">
                <div className="absolute -right-4 -top-4 opacity-5 text-veltrix-dark-1"><Package size={120} /></div>
                <p className="text-[10px] font-bold tracking-widest text-veltrix-text-muted uppercase mb-4">Active Batches</p>
                <h2 className="font-display text-5xl tracking-tighter text-veltrix-dark-3">{metrics.active_batches}</h2>
                <p className="text-veltrix-text-dark text-xs font-mono mt-4 tracking-wider">
                  {metrics.total_codes.toLocaleString()} REGISTERED CODES
                </p>
              </div>
            </div>

            {/* Live Queries Table */}
            <div className="bg-veltrix-light-3 border border-veltrix-border-2 relative z-10 shadow-xs">
              <div className="px-8 py-6 border-b border-veltrix-border-2 bg-veltrix-light-2 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="font-display text-2xl tracking-tight text-veltrix-dark-3">Recent Verification Queries</h3>
                  <p className="text-xs text-veltrix-text-gray font-mono mt-1">Directly synchronized with the security registry via atomic cryptographic procedures</p>
                </div>
                <div className="relative w-full md:w-64">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-veltrix-text-muted" />
                  <input 
                    type="text" 
                    placeholder="Filter by code..." 
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
                      <th className="px-8 py-5 font-bold">Date / Time</th>
                      <th className="px-8 py-5 font-bold">Queried Code</th>
                      <th className="px-8 py-5 font-bold">Database Status</th>
                      <th className="px-8 py-5 font-bold">Product</th>
                      <th className="px-8 py-5 font-bold">IP / Region</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm font-mono">
                    {logs.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-8 py-10 text-center text-veltrix-text-muted">
                          No records found in the registry.
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
                                <CheckCircle2 size={12} /> Valid (1st time)
                              </span>
                            )}
                            {log.status_result === 'WARNING_MULTIPLE_USE' && (
                              <span className="px-3 py-1.5 border border-[#fde68a] bg-[#fffbeb] text-[#92400e] text-[10px] uppercase font-bold tracking-widest inline-flex items-center gap-1.5">
                                <AlertTriangle size={12} /> Alert ({log.times_checked_at_moment}x)
                              </span>
                            )}
                            {log.status_result === 'NOT_FOUND' && (
                              <span className="px-3 py-1.5 border border-[#fecaca] bg-[#fef2f2] text-[#991b1b] text-[10px] uppercase font-bold tracking-widest inline-flex items-center gap-1.5">
                                <XCircle size={12} /> Not Found
                              </span>
                            )}
                            {log.status_result === 'REVOKED' && (
                              <span className="px-3 py-1.5 border border-purple-200 bg-purple-50 text-purple-800 text-[10px] uppercase font-bold tracking-widest inline-flex items-center gap-1.5">
                                Revoked
                              </span>
                            )}
                          </td>
                          <td className="px-8 py-5 text-veltrix-dark-3 text-xs font-sans font-medium">
                            {log.product_name || '-'}
                          </td>
                          <td className="px-8 py-5 text-veltrix-text-gray text-xs">
                            {log.location || 'US / Global'}
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
                    {/* Product Presentation Image */}
                    <div className="w-full h-44 bg-gradient-to-b from-white to-veltrix-light-2 border border-veltrix-border-1 mb-4 flex items-center justify-center p-3 overflow-hidden rounded-xs relative group">
                      <img 
                        src={p.image_url || '/essence-vials.png'} 
                        alt={p.name} 
                        className="max-h-full max-w-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/essence-vials.png';
                        }}
                      />
                      <span className="absolute bottom-2 right-2 text-[9px] font-mono px-2 py-0.5 bg-black/50 text-white rounded backdrop-blur-xs">
                        {p.presentations || 'Lyophilized'}
                      </span>
                    </div>

                    <div className="flex justify-between items-start mb-2">
                      <span className="px-2 py-0.5 bg-veltrix-gold-1 text-veltrix-dark-3 font-mono text-[9px] font-bold uppercase">
                        {p.category || 'Peptides'}
                      </span>
                      <span className="font-mono text-xs text-[#15803d] font-bold">
                        {p.purity || '≥ 99.0%'}
                      </span>
                    </div>
                    <h3 className="font-display text-2xl text-veltrix-dark-3 font-bold mb-1">{p.name}</h3>
                    <p className="font-mono text-xs text-veltrix-gold-5 mb-2">{p.formula || '-'}</p>
                    <p className="text-xs text-veltrix-text-dark line-clamp-3 leading-relaxed mb-4">
                      {p.description || 'No description registered.'}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-veltrix-border-2 flex justify-between items-center text-xs font-mono">
                    <div>
                      <span className="text-veltrix-text-muted">Concentration: </span>
                      <strong className="text-veltrix-dark-3">{p.concentration || '-'}</strong>
                    </div>
                    <button 
                      onClick={() => handleDeleteProduct(p.id, p.name)}
                      className="p-1.5 text-veltrix-text-muted hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete compound"
                    >
                      <Trash2 size={14} />
                    </button>
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
                <h3 className="font-display text-2xl tracking-tight text-veltrix-dark-3">Registered Production Batches</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="border-b border-veltrix-border-2 text-[9px] uppercase tracking-widest text-veltrix-text-gray bg-veltrix-light-4">
                      <th className="px-8 py-5 font-bold">Batch Number</th>
                      <th className="px-8 py-5 font-bold">Associated Product</th>
                      <th className="px-8 py-5 font-bold">Active Codes</th>
                      <th className="px-8 py-5 font-bold">Queries Completed</th>
                      <th className="px-8 py-5 font-bold">Fraud Alerts</th>
                      <th className="px-8 py-5 font-bold">Expiry Date</th>
                      <th className="px-8 py-5 font-bold">Actions</th>
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
                            <span className="text-[#b45309] font-bold">{b.fraud_alerts_count} alerts</span>
                          ) : (
                            <span className="text-emerald-700">0</span>
                          )}
                        </td>
                        <td className="px-8 py-5 text-veltrix-text-muted text-xs">
                          {b.expiry_date ? new Date(b.expiry_date).toLocaleDateString('en-US') : '-'}
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleViewCodes(b.id, b.batch_number)}
                              className="text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 bg-veltrix-dark-2 text-veltrix-light-5 hover:text-veltrix-gold-1 rounded cursor-pointer transition-colors"
                            >
                              View Codes
                            </button>
                            <button 
                              onClick={() => handleDeleteBatch(b.id, b.batch_number)}
                              className="p-1.5 text-veltrix-text-muted hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Delete batch"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* MODAL: NEW PRODUCT */}
        <AnimatePresence>
          {showProductModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-veltrix-light-3 border border-veltrix-border-2 p-8 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto"
              >
                <button 
                  onClick={() => setShowProductModal(false)}
                  className="absolute right-5 top-5 text-veltrix-text-muted hover:text-veltrix-dark-3"
                >
                  <X size={20} />
                </button>
                <h3 className="font-display text-2xl text-veltrix-dark-3 mb-6">Register New Product</h3>

                <form onSubmit={handleCreateProduct} className="flex flex-col gap-4 text-xs font-mono">
                  <div>
                    <label className="block text-veltrix-text-muted uppercase mb-1">Compound Name</label>
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
                      <label className="block text-veltrix-text-muted uppercase mb-1">Concentration</label>
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
                      <label className="block text-veltrix-text-muted uppercase mb-1">Molecular Formula</label>
                      <input 
                        type="text" 
                        placeholder="Ex: C₁₄H₂₂N₄O₉"
                        value={newProduct.formula}
                        onChange={(e) => setNewProduct({ ...newProduct, formula: e.target.value })}
                        className="w-full p-2.5 bg-white border border-veltrix-border-2 text-veltrix-dark-3"
                      />
                    </div>
                    <div>
                      <label className="block text-veltrix-text-muted uppercase mb-1">HPLC Purity</label>
                      <input 
                        type="text" 
                        value={newProduct.purity}
                        onChange={(e) => setNewProduct({ ...newProduct, purity: e.target.value })}
                        className="w-full p-2.5 bg-white border border-veltrix-border-2 text-veltrix-dark-3"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-veltrix-text-muted uppercase mb-1">Presentation Format</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Lyophilized powder · Dosing pen"
                      value={newProduct.presentations}
                      onChange={(e) => setNewProduct({ ...newProduct, presentations: e.target.value })}
                      className="w-full p-2.5 bg-white border border-veltrix-border-2 text-veltrix-dark-3"
                    />
                  </div>

                  {/* Product Photo Upload & Presets */}
                  <div>
                    <label className="block text-veltrix-text-muted uppercase mb-1">Product Photo</label>
                    
                    {/* Primary Direct File Upload Box */}
                    <div className="mb-3">
                      <label 
                        htmlFor="product-image-file" 
                        className={`flex flex-col items-center justify-center p-4 border-2 border-dashed rounded cursor-pointer transition-all ${
                          imageUploading 
                            ? 'border-veltrix-gold-1 bg-veltrix-gold-1/10 animate-pulse' 
                            : 'border-veltrix-border-2 hover:border-veltrix-gold-1 bg-white hover:bg-veltrix-light-2'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-veltrix-gold-1/15 flex items-center justify-center text-veltrix-gold-5 shrink-0">
                            <ImageIcon size={18} />
                          </div>
                          <div>
                            <span className="block text-xs font-bold text-veltrix-dark-3">
                              {imageUploading ? 'Uploading & Processing Image...' : 'Click to Upload Product Photo from Computer'}
                            </span>
                            <span className="text-[10px] text-veltrix-text-muted">
                              Supports JPG, PNG, WEBP (saved directly to catalog)
                            </span>
                          </div>
                        </div>
                        <input 
                          id="product-image-file"
                          type="file" 
                          accept="image/*"
                          onChange={handleProductImageUpload}
                          disabled={imageUploading}
                          className="hidden" 
                        />
                      </label>
                    </div>

                    {/* Preview & Current URL display */}
                    {newProduct.image_url && (
                      <div className="mb-3 p-2.5 bg-white border border-veltrix-border-2 rounded flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-12 h-12 border border-veltrix-border-2 bg-veltrix-light-2 rounded flex items-center justify-center shrink-0 overflow-hidden">
                            <img 
                              src={newProduct.image_url} 
                              alt="Product Preview" 
                              className="max-h-full max-w-full object-contain"
                              onError={(e) => { (e.target as HTMLImageElement).src = '/essence-vials.png'; }}
                            />
                          </div>
                          <div className="min-w-0">
                            <span className="text-[10px] font-bold text-emerald-700 block uppercase tracking-wider">Active Photo Selected</span>
                            <span className="text-xs text-veltrix-dark-3 font-mono truncate block max-w-xs">{newProduct.image_url}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setNewProduct({ ...newProduct, image_url: '' })}
                          className="text-[10px] font-bold text-red-600 hover:text-red-800 uppercase px-2 py-1 border border-red-200 hover:bg-red-50 rounded"
                        >
                          Remove
                        </button>
                      </div>
                    )}

                    {/* Quick Presets fallback */}
                    <div>
                      <span className="text-[10px] uppercase font-bold text-veltrix-text-muted mb-1.5 block">Or select standard packaging preset:</span>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setNewProduct({ ...newProduct, image_url: '/essence-vials.png' })}
                          className={`p-2 border text-center rounded cursor-pointer transition-all flex flex-col items-center ${
                            newProduct.image_url === '/essence-vials.png' ? 'border-veltrix-gold-1 bg-veltrix-gold-1/10 shadow-xs' : 'border-veltrix-border-2 bg-white hover:bg-veltrix-light-2'
                          }`}
                        >
                          <img src="/essence-vials.png" alt="Vials" className="h-8 object-contain mb-1" />
                          <span className="text-[10px] font-bold text-veltrix-dark-3">Vials</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewProduct({ ...newProduct, image_url: '/essence-pen-box.png' })}
                          className={`p-2 border text-center rounded cursor-pointer transition-all flex flex-col items-center ${
                            newProduct.image_url === '/essence-pen-box.png' ? 'border-veltrix-gold-1 bg-veltrix-gold-1/10 shadow-xs' : 'border-veltrix-border-2 bg-white hover:bg-veltrix-light-2'
                          }`}
                        >
                          <img src="/essence-pen-box.png" alt="Pen & Box" className="h-8 object-contain mb-1" />
                          <span className="text-[10px] font-bold text-veltrix-dark-3">Pen & Box</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewProduct({ ...newProduct, image_url: '/essence-seals.jpg' })}
                          className={`p-2 border text-center rounded cursor-pointer transition-all flex flex-col items-center ${
                            newProduct.image_url === '/essence-seals.jpg' ? 'border-veltrix-gold-1 bg-veltrix-gold-1/10 shadow-xs' : 'border-veltrix-border-2 bg-white hover:bg-veltrix-light-2'
                          }`}
                        >
                          <img src="/essence-seals.jpg" alt="Security Seals" className="h-8 object-contain mb-1" />
                          <span className="text-[10px] font-bold text-veltrix-dark-3">Hologram Seal</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-veltrix-text-muted uppercase mb-1">Description</label>
                    <textarea 
                      rows={3}
                      placeholder="Technical description and presentation..."
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
                      Cancel
                    </button>
                    <button type="submit" className="btn-gold">
                      Save Product
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL: GENERATE NEW BATCH */}
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
                <h3 className="font-display text-2xl text-veltrix-dark-3 mb-2">Batch & Code Generator</h3>
                <p className="text-xs text-veltrix-text-gray font-mono mb-6">Generates cryptographically secure 6-character alphanumeric codes in the central security registry.</p>

                <form onSubmit={handleGenerateBatch} className="flex flex-col gap-4 text-xs font-mono">
                  <div>
                    <label className="block text-veltrix-text-muted uppercase mb-1">Product</label>
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
                    <label className="block text-veltrix-text-muted uppercase mb-1">Batch Identifier</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ex: LOT-RET-2026B"
                      value={newBatch.batch_number}
                      onChange={(e) => setNewBatch({ ...newBatch, batch_number: e.target.value.toUpperCase() })}
                      className="w-full p-2.5 bg-white border border-veltrix-border-2 text-veltrix-dark-3 uppercase font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-veltrix-text-muted uppercase mb-1">Number of Codes to Generate</label>
                    <input 
                      type="number" 
                      min="5"
                      max="1000"
                      value={newBatch.quantity}
                      onChange={(e) => setNewBatch({ ...newBatch, quantity: parseInt(e.target.value, 10) || 10 })}
                      className="w-full p-2.5 bg-white border border-veltrix-border-2 text-veltrix-dark-3"
                    />
                    <span className="text-[10px] text-veltrix-text-muted mt-1 block">Each security code will be generated as a 6-character alphanumeric key (e.g., 2H7MBT).</span>
                  </div>
                  <div className="flex justify-end gap-3 mt-4">
                    <button 
                      type="button" 
                      onClick={() => setShowBatchModal(false)}
                      className="px-4 py-2 border border-veltrix-border-2 text-veltrix-text-muted hover:bg-veltrix-light-2"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn-gold flex items-center gap-2">
                      <Layers size={14} /> Generate & Register Batch
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL: VIEW BATCH CODES */}
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
                <h3 className="font-display text-2xl text-veltrix-dark-3 mb-1">Batch Codes - {selectedBatchNumber}</h3>
                <p className="text-xs text-veltrix-text-gray font-mono mb-4">
                  {selectedBatchCodes.length} security codes loaded from registry. Click any code to copy.
                </p>

                {/* Export Buttons for Physical Label Printing */}
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  <button 
                    onClick={handleExportCSV}
                    className="px-3.5 py-2 bg-veltrix-light-2 hover:bg-white border border-veltrix-border-2 text-veltrix-dark-3 text-xs font-mono font-bold flex items-center gap-2 rounded cursor-pointer transition-colors shadow-xs"
                    title="Export codes as CSV spreadsheet"
                  >
                    <Download size={14} className="text-veltrix-gold-1" /> Export CSV (Printing)
                  </button>
                  <button 
                    onClick={handleExportTXT}
                    className="px-3.5 py-2 bg-veltrix-light-2 hover:bg-white border border-veltrix-border-2 text-veltrix-dark-3 text-xs font-mono font-bold flex items-center gap-2 rounded cursor-pointer transition-colors shadow-xs"
                    title="Export codes as plain text list"
                  >
                    <FileText size={14} className="text-veltrix-gold-1" /> Export TXT (Plain Codes)
                  </button>
                </div>

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
                          {c.times_checked === 0 ? 'Unused' : `Checked ${c.times_checked}x`}
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
                  <span className="text-veltrix-text-muted">Copy any code to test on the official Authentication page.</span>
                  <Link 
                    to="/autenticacao" 
                    target="_blank" 
                    className="flex items-center gap-1.5 text-veltrix-gold-5 font-bold hover:underline"
                  >
                    Test Validator <ArrowUpRight size={14} />
                  </Link>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL: SPREADSHEET / CSV BULK IMPORT */}
        <AnimatePresence>
          {showImportModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-veltrix-light-3 border border-veltrix-border-2 p-8 max-w-xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto"
              >
                <button 
                  onClick={() => setShowImportModal(false)}
                  className="absolute right-5 top-5 text-veltrix-text-muted hover:text-veltrix-dark-3"
                >
                  <X size={20} />
                </button>
                <h3 className="font-display text-2xl text-veltrix-dark-3 mb-1">Bulk Database Import</h3>
                <p className="text-xs text-veltrix-text-gray font-mono mb-6">
                  Ingest CSV spreadsheets directly into the central database.
                </p>

                {/* Import Type Selector */}
                <div className="grid grid-cols-2 gap-3 mb-6 font-mono text-xs">
                  <button
                    type="button"
                    onClick={() => { setImportType('products'); setImportResult(null); }}
                    className={`p-3 border text-center font-bold uppercase tracking-wider rounded cursor-pointer transition-all ${
                      importType === 'products'
                        ? 'bg-veltrix-dark-2 text-veltrix-gold-1 border-veltrix-dark-4 shadow-xs'
                        : 'bg-white text-veltrix-dark-3 border-veltrix-border-2 hover:bg-veltrix-light-2'
                    }`}
                  >
                    Products Catalog
                  </button>
                  <button
                    type="button"
                    onClick={() => { setImportType('batches'); setImportResult(null); }}
                    className={`p-3 border text-center font-bold uppercase tracking-wider rounded cursor-pointer transition-all ${
                      importType === 'batches'
                        ? 'bg-veltrix-dark-2 text-veltrix-gold-1 border-veltrix-dark-4 shadow-xs'
                        : 'bg-white text-veltrix-dark-3 border-veltrix-border-2 hover:bg-veltrix-light-2'
                    }`}
                  >
                    Batches & Codes
                  </button>
                </div>

                {/* Sample Template Links */}
                <div className="p-3 bg-veltrix-light-2 border border-veltrix-border-2 rounded mb-5 flex items-center justify-between font-mono text-xs">
                  <div className="flex items-center gap-2 text-veltrix-text-dark">
                    <FileSpreadsheet size={16} className="text-veltrix-gold-1 shrink-0" />
                    <span>Download standard layout template:</span>
                  </div>
                  <a
                    href={importType === 'products' ? '/templates/products_template.csv' : '/templates/batches_template.csv'}
                    download
                    className="font-bold text-veltrix-gold-5 hover:underline flex items-center gap-1 shrink-0 ml-2"
                  >
                    <Download size={13} /> Download Template
                  </a>
                </div>

                {importResult && (
                  <div className={`p-4 rounded mb-5 text-xs font-mono border ${
                    importResult.success ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
                  }`}>
                    <p className="font-bold mb-1">{importResult.success ? 'Import Complete' : 'Import Failed'}</p>
                    <p>{importResult.message}</p>
                  </div>
                )}

                <form onSubmit={handleImportSubmit} className="flex flex-col gap-4 text-xs font-mono">
                  <div>
                    <label className="block text-veltrix-text-muted uppercase mb-1">Upload CSV File</label>
                    <input 
                      type="file" 
                      accept=".csv,.txt"
                      onChange={handleFileUpload}
                      className="w-full p-2 bg-white border border-veltrix-border-2 text-veltrix-dark-3 file:mr-4 file:py-1.5 file:px-3 file:border-0 file:text-xs file:font-mono file:bg-veltrix-dark-2 file:text-veltrix-light-5 file:cursor-pointer hover:file:bg-veltrix-dark-3"
                    />
                  </div>

                  <div>
                    <label className="block text-veltrix-text-muted uppercase mb-1">Or Paste CSV Data Below</label>
                    <textarea 
                      rows={6}
                      placeholder={
                        importType === 'products' 
                          ? 'name,slug,concentration,formula,category,purity,description,presentations,image_url\nRETATRUTIDE,retatrutide,40 mg,ESS-R40,Peptides,≥ 99.4% HPLC,Triple receptor agonist,Lyophilized,/essence-vials.png'
                          : 'batch_number,product_slug,quantity,manufacturing_date,expiry_date,notes,code\nLOT-RET-2026A,retatrutide,50,2026-03-01,2028-03-01,Clinical trial batch,2H7MBT'
                      }
                      value={csvContent}
                      onChange={(e) => setCsvContent(e.target.value)}
                      className="w-full p-2.5 bg-white border border-veltrix-border-2 text-veltrix-dark-3 font-mono text-[11px] leading-relaxed"
                    />
                  </div>

                  <div className="flex justify-end gap-3 mt-4">
                    <button 
                      type="button" 
                      onClick={() => setShowImportModal(false)}
                      className="px-4 py-2 border border-veltrix-border-2 text-veltrix-text-muted hover:bg-veltrix-light-2"
                    >
                      Close
                    </button>
                    <button 
                      type="submit" 
                      disabled={importLoading || !csvContent.trim()}
                      className="btn-gold flex items-center gap-2 disabled:opacity-50"
                    >
                      <Upload size={14} className={importLoading ? 'animate-spin' : ''} />
                      {importLoading ? 'Importing...' : `Process & Ingest Records`}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}
