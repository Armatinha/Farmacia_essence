import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useSEO } from './hooks/useSEO';
import { useAnalytics } from './hooks/useAnalytics';

const PublicLayout = lazy(() => import('./layouts/PublicLayout'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

function PageLoader() {
  return (
    <div className="min-h-screen bg-veltrix-light-1">
      <div className="flex items-center justify-between px-6 py-4 border-b border-veltrix-gold-1/15">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-veltrix-dark-1 border border-veltrix-gold-1 rounded-md flex items-center justify-center">
            <span className="text-veltrix-gold-1 font-bold text-lg leading-none">E</span>
          </div>
          <div>
            <div className="text-[15px] font-bold tracking-[.18em] text-veltrix-dark-1 leading-none">ESSENCE</div>
            <div className="text-[8px] font-semibold tracking-[.3em] text-[#855f19] uppercase mt-0.5">PHARMA</div>
          </div>
        </div>
        <div className="w-5 h-5 border-2 border-veltrix-gold-1 border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );
}

function AppContent() {
  useSEO();
  useAnalytics();

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/*" element={<PublicLayout />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
