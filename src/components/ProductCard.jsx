import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  return (
    <div 
      style={styles.card} 
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <img src={product.image_url} alt={product.title} style={styles.image} />
      <div style={styles.content}>
        <div className="flex justify-between items-center w-full">
          <h4 style={styles.title}>{product.title}</h4>
          <ChevronRight size={16} color="var(--color-text-secondary)" />
        </div>
        <p style={styles.description}>{product.description}</p>
        <span style={styles.price}>₺{product.price}</span>
      </div>
    </div>
  );
};

const styles = {
  card: {
    display: 'flex',
    backgroundColor: 'var(--color-surface)',
    borderRadius: 'var(--radius-xl)',
    padding: '0.75rem',
    gap: '1rem',
    marginBottom: '1rem',
    boxShadow: 'var(--shadow-sm)',
    cursor: 'pointer',
    alignItems: 'center',
    transition: 'transform 0.2s ease',
  },
  image: {
    width: '80px',
    height: '80px',
    borderRadius: 'var(--radius-md)',
    objectFit: 'cover',
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  title: {
    fontSize: 'var(--text-base)',
    fontWeight: '600',
    marginBottom: '0.25rem',
  },
  description: {
    fontSize: 'var(--text-xs)',
    color: 'var(--color-text-secondary)',
    marginBottom: '0.5rem',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  price: {
    fontSize: 'var(--text-sm)',
    fontWeight: '700',
    color: 'var(--color-text-primary)',
  }
};
