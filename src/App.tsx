import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';
import Home from './pages/Home';
import { useSEO } from './hooks/useSEO';
import { useAnalytics } from './hooks/useAnalytics';

const About = lazy(() => import('./pages/About'));
const Products = lazy(() => import('./pages/Products'));
const Authenticate = lazy(() => import('./pages/Authenticate'));
const Contact = lazy(() => import('./pages/Contact'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const NotFound = lazy(() => import('./pages/NotFound'));

function PageLoader() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
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
        {/* Admin Route - No Navbar/Footer */}
        <Route path="/admin/*" element={<AdminDashboard />} />
        
        {/* Public Routes */}
        <Route path="/*" element={
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow pt-24 pb-12">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/sobre" element={<About />} />
                <Route path="/produtos" element={<Products />} />
                <Route path="/autenticacao" element={<Authenticate />} />
                <Route path="/contato" element={<Contact />} />
                {/* ✅ Item 4: Página 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
            {/* ✅ Item 13: Cookie consent banner */}
            <CookieBanner />
          </div>
        } />
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
