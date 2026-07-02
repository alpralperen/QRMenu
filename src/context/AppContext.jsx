import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [searchParams] = useSearchParams();
  const [tableNumber, setTableNumber] = useState(null);
  const [cafeId] = useState('demo-cafe'); // Hardcoded for now

  useEffect(() => {
    const masa = searchParams.get('masa');
    if (masa) {
      setTableNumber(masa);
      // Gerekirse localStorage'a da kaydedilebilir
      localStorage.setItem('tableNumber', masa);
    } else {
      const storedMasa = localStorage.getItem('tableNumber');
      if (storedMasa) {
        setTableNumber(storedMasa);
      }
    }
  }, [searchParams]);

  return (
    <AppContext.Provider value={{ tableNumber, cafeId }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
