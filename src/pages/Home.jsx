import React, { useState, useEffect } from 'react';
import { Search, Settings2, Coffee, CakeSlice, UtensilsCrossed } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { BottomNav } from '../components/BottomNav';
import { getProducts } from '../services/db';
import { useAppContext } from '../context/AppContext';

export const Home = () => {
  const { products, productsLoading } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tümü');

  const categories = [
    { name: 'Tümü', icon: null },
    { name: 'Kahveler', icon: Coffee },
    { name: 'Tatlılar', icon: CakeSlice },
    { name: 'Atıştırmalık', icon: UtensilsCrossed },
  ];

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === 'Tümü' || p.category === activeCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <div style={styles.header}>
        <p style={styles.greeting}>Merhaba 👋</p>
        <h1 style={styles.mainTitle}>Afiyet olsun!</h1>
        <p style={styles.subtitle}>Seçimini keşfetmeye başla.</p>
      </div>

      {/* Search Bar */}
      <div style={styles.searchContainer}>
        <div style={styles.searchInputWrapper}>
          <Search size={20} color="var(--color-text-secondary)" style={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Ürün ara..." 
            style={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button style={styles.filterBtn}>
          <Settings2 size={20} color="var(--color-text-primary)" />
        </button>
      </div>

      {/* Categories */}
      <div style={styles.categoriesContainer} className="no-scrollbar">
        {categories.map(cat => (
          <button 
            key={cat.name}
            style={{
              ...styles.categoryBtn,
              backgroundColor: activeCategory === cat.name ? 'var(--color-primary)' : 'var(--color-surface)',
              color: activeCategory === cat.name ? 'var(--color-surface)' : 'var(--color-text-primary)'
            }}
            onClick={() => setActiveCategory(cat.name)}
          >
            {cat.icon && <cat.icon size={16} />}
            {cat.name}
          </button>
        ))}
      </div>

      {/* Product List */}
      <div style={styles.productList}>
        <h3 style={styles.sectionTitle}>Öne Çıkanlar</h3>
        {productsLoading ? (
          <p className="text-center py-4">Yükleniyor...</p>
        ) : (
          filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
};

const styles = {
  container: {
    padding: '1.5rem',
    paddingBottom: '80px', // Space for bottom nav
  },
  header: {
    marginBottom: '1.5rem',
  },
  greeting: {
    color: 'var(--color-text-secondary)',
    fontSize: 'var(--text-sm)',
    marginBottom: '0.25rem',
  },
  mainTitle: {
    fontSize: 'var(--text-2xl)',
    color: 'var(--color-primary)',
    fontWeight: '700',
    marginBottom: '0.25rem',
  },
  subtitle: {
    color: 'var(--color-text-secondary)',
    fontSize: 'var(--text-sm)',
  },
  searchContainer: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  searchInputWrapper: {
    flex: 1,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: '1rem',
  },
  searchInput: {
    width: '100%',
    padding: '0.75rem 1rem 0.75rem 2.75rem',
    borderRadius: 'var(--radius-full)',
    border: '1px solid var(--color-border)',
    outline: 'none',
    fontFamily: 'var(--font-family)',
    fontSize: 'var(--text-sm)',
  },
  filterBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    borderRadius: 'var(--radius-full)',
    border: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-surface)',
    cursor: 'pointer',
  },
  categoriesContainer: {
    display: 'flex',
    gap: '0.75rem',
    overflowX: 'auto',
    paddingBottom: '0.5rem',
    marginBottom: '1.5rem',
  },
  categoryBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    borderRadius: 'var(--radius-full)',
    border: '1px solid var(--color-border)',
    whiteSpace: 'nowrap',
    fontWeight: '500',
    fontSize: 'var(--text-sm)',
    cursor: 'pointer',
    fontFamily: 'var(--font-family)',
    transition: 'all 0.2s',
  },
  productList: {
    display: 'flex',
    flexDirection: 'column',
  },
  sectionTitle: {
    fontSize: 'var(--text-lg)',
    marginBottom: '1rem',
  }
};
