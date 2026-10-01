import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import Authenticate from './pages/Authenticate';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';
import { useSEO } from './hooks/useSEO';
import { useAnalytics } from './hooks/useAnalytics';

function AppContent() {
  useSEO();
  useAnalytics();

  return (
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
