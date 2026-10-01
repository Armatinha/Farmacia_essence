import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useSEO } from './hooks/useSEO';
import { useAnalytics } from './hooks/useAnalytics';

const PublicLayout = lazy(() => import('./layouts/PublicLayout'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

function PageLoader() {
  return (
    <div className="min-h-screen bg-veltrix-light-1 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-veltrix-gold-1 border-t-transparent rounded-full animate-spin" />
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
