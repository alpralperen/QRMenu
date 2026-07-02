import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Home } from './pages/Home';
import { ProductDetail } from './pages/ProductDetail';
import { Splash } from './components/Splash';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';

// Wrapper to handle Splash Screen & Layout logic
const AppWrapper = () => {
  const [showSplash, setShowSplash] = useState(true);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    // Admin paneli için tam ekran, müşteri arayüzü için mobil görünüm (480px)
    const root = document.getElementById('root');
    if (isAdminRoute) {
      root.style.maxWidth = '100%';
      root.style.boxShadow = 'none';
    } else {
      root.style.maxWidth = '480px';
      root.style.boxShadow = 'var(--shadow-lg)';
    }
  }, [isAdminRoute]);

  // Splash screen'i sadece ana sayfada ve admin değilken göster
  if (showSplash && !isAdminRoute) {
    return <Splash onComplete={() => setShowSplash(false)} />;
  }

  return (
    <div className="animate-fade-in">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppWrapper />
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
