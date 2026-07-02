import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [searchParams] = useSearchParams();
  const [tableNumber, setTableNumber] = useState(null);
  const [cafeId] = useState('demo-cafe'); // Hardcoded for now
  
  // Cache products globally
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    // Fetch products once on app load
    const fetchInitialProducts = async () => {
      setProductsLoading(true);
      const { getProducts } = await import('../services/db');
      const data = await getProducts(cafeId);
      
      if (data.length === 0) {
        // Fallback to mock data immediately
        setProducts([
          { id: '1', title: 'Cappuccino', description: 'Yoğun espresso, sıcak süt ve süt köpüğü.', price: 85, category: 'Kahveler', image_url: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500&q=80', ingredients: ['Espresso', 'Süt', 'Süt Köpüğü'], allergens: ['Süt içerir', 'Laktoz içerir'] },
          { id: '2', title: 'Cheesecake', description: 'Kremamsı cheesecake, orman meyveleri.', price: 120, category: 'Tatlılar', image_url: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&q=80', ingredients: ['Labne', 'Bisküvi', 'Orman Meyveleri'], allergens: ['Süt içerir', 'Gluten içerir'] },
          { id: '3', title: 'Avokadolu Tost', description: 'Avokado, cherry domates, tam buğday ekmeği.', price: 110, category: 'Atıştırmalık', image_url: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=500&q=80', ingredients: ['Avokado', 'Tam Buğday Ekmeği', 'Domates'], allergens: ['Gluten içerir'] }
        ]);
      } else {
        setProducts(data);
      }
      setProductsLoading(false);
    };
    
    fetchInitialProducts();
  }, [cafeId]);

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
    <AppContext.Provider value={{ tableNumber, cafeId, products, productsLoading }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
