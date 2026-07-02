import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Info, AlertTriangle } from 'lucide-react';
import { getProductById } from '../services/db';

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const data = await getProductById(id);
      
      // Mock if not found (for dev)
      if (!data) {
        setProduct({
          id: id,
          title: 'Cappuccino',
          description: 'Yoğun espresso, sıcak süt ve süt köpüğü ile hazırlanır.',
          price: 85,
          image_url: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=800&q=80',
          ingredients: ['Espresso', 'Süt', 'Süt Köpüğü'],
          allergens: ['Süt içerir', 'Laktoz içerir']
        });
      } else {
        setProduct(data);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Yükleniyor...</div>;
  }

  if (!product) return <div>Ürün bulunamadı.</div>;

  return (
    <div style={styles.container} className="animate-fade-in">
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.iconBtn} onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>
        <button style={styles.iconBtn}>
          <Heart size={24} />
        </button>
      </div>

      {/* Image */}
      <div style={styles.imageContainer}>
        <img src={product.image_url} alt={product.title} style={styles.image} />
      </div>

      {/* Content */}
      <div style={styles.content}>
        <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
          <h1 style={styles.title}>{product.title}</h1>
          <span style={styles.price}>₺{product.price}</span>
        </div>
        
        <p style={styles.description}>{product.description}</p>

        {/* Ingredients */}
        {product.ingredients && product.ingredients.length > 0 && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>İçerik</h3>
            <div style={styles.pillContainer}>
              {product.ingredients.map((ing, idx) => (
                <span key={idx} style={styles.pill}>{ing}</span>
              ))}
            </div>
          </div>
        )}

        {/* Allergens */}
        {product.allergens && product.allergens.length > 0 && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Alerjenler</h3>
            <div style={styles.pillContainer}>
              {product.allergens.map((alg, idx) => (
                <span key={idx} style={styles.allergenPill}>
                  <AlertTriangle size={14} />
                  {alg}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* 
        Tasarımda olan 'Sepete Ekle' butonu müşteri talebi üzerine 
        bilinçli olarak arayüzden çıkarılmıştır.
      */}
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: 'var(--color-background)',
    paddingBottom: '2rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '1.5rem',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  iconBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(4px)',
    border: 'none',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: 'var(--shadow-sm)',
  },
  imageContainer: {
    width: '100%',
    height: '350px',
    borderBottomLeftRadius: '2rem',
    borderBottomRightRadius: '2rem',
    overflow: 'hidden',
    backgroundColor: 'var(--color-surface)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    paddingTop: '4rem',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))',
  },
  content: {
    padding: '1.5rem',
  },
  title: {
    fontSize: 'var(--text-2xl)',
    fontWeight: '700',
    color: 'var(--color-primary)',
  },
  price: {
    fontSize: 'var(--text-xl)',
    fontWeight: '700',
    color: 'var(--color-text-primary)',
  },
  description: {
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-secondary)',
    lineHeight: '1.6',
    marginBottom: '2rem',
  },
  section: {
    marginBottom: '1.5rem',
  },
  sectionTitle: {
    fontSize: 'var(--text-base)',
    fontWeight: '600',
    marginBottom: '0.75rem',
    color: 'var(--color-text-primary)',
  },
  pillContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  pill: {
    padding: '0.4rem 0.75rem',
    backgroundColor: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-full)',
    fontSize: 'var(--text-xs)',
    color: 'var(--color-text-secondary)',
  },
  allergenPill: {
    padding: '0.4rem 0.75rem',
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    borderRadius: 'var(--radius-full)',
    fontSize: 'var(--text-xs)',
    color: '#EF4444',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  }
};
