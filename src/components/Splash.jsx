import React, { useEffect, useState } from 'react';
import { Coffee, ScanLine } from 'lucide-react';

export const Splash = ({ onComplete }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 400); // Wait for fade out animation
    }, 2000); // 2 seconds display
    
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div style={{...styles.container, opacity: visible ? 1 : 0}}>
      <div className="animate-slide-up flex flex-col items-center">
        <div style={styles.iconContainer}>
          <ScanLine size={80} color="var(--color-primary)" strokeWidth={1} style={{ position: 'absolute' }} />
          <Coffee size={40} color="var(--color-primary)" />
        </div>
        <h1 style={styles.title}>QR Menü</h1>
        <p style={styles.subtitle}>Menünü keşfet, seçimini yap.</p>
      </div>
      <div style={styles.decoration1}></div>
      <div style={styles.decoration2}></div>
    </div>
  );
};

const styles = {
  container: {
    height: '100vh',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F1', // Slight different bg for splash as in design
    transition: 'opacity 0.4s ease',
    position: 'relative',
    overflow: 'hidden',
  },
  iconContainer: {
    position: 'relative',
    width: '120px',
    height: '120px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem',
  },
  title: {
    fontSize: 'var(--text-3xl)',
    color: 'var(--color-primary)',
    fontWeight: '700',
    marginBottom: '0.5rem',
  },
  subtitle: {
    color: 'var(--color-text-secondary)',
    fontSize: 'var(--text-sm)',
  },
  decoration1: {
    position: 'absolute',
    bottom: '-50px',
    left: '-50px',
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    backgroundColor: 'rgba(31, 54, 40, 0.05)',
  },
  decoration2: {
    position: 'absolute',
    bottom: '50px',
    right: '-80px',
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    backgroundColor: 'rgba(31, 54, 40, 0.08)',
  }
};
