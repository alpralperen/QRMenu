import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Home } from './pages/Home';
import { ProductDetail } from './pages/ProductDetail';
import { Splash } from './components/Splash';

// Wrapper to handle Splash Screen logic
const AppWrapper = () => {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <Splash onComplete={() => setShowSplash(false)} />;
  }

  return (
    <div className="animate-fade-in">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
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
