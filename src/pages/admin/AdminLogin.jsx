import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

export const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Basit sabit şifre (admin123)
    if (password === 'admin123') {
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin/dashboard');
    } else {
      setError('Hatalı şifre. Lütfen tekrar deneyin.');
    }
  };

  return (
    <div style={styles.container} className="animate-fade-in">
      <div style={styles.card}>
        <div style={styles.iconContainer}>
          <Lock size={40} color="var(--color-primary)" />
        </div>
        <h2 style={styles.title}>Yönetici Girişi</h2>
        <p style={styles.subtitle}>Panele erişmek için şifrenizi girin.</p>
        
        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
          {error && <p style={styles.error}>{error}</p>}
          <button type="submit" className="btn btn-primary" style={styles.button}>
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--color-background)',
    padding: '1.5rem',
  },
  card: {
    backgroundColor: 'var(--color-surface)',
    padding: '2rem',
    borderRadius: 'var(--radius-xl)',
    boxShadow: 'var(--shadow-md)',
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  iconContainer: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: 'rgba(31, 54, 40, 0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem',
  },
  title: {
    fontSize: 'var(--text-xl)',
    fontWeight: '700',
    color: 'var(--color-primary)',
    marginBottom: '0.5rem',
  },
  subtitle: {
    color: 'var(--color-text-secondary)',
    fontSize: 'var(--text-sm)',
    marginBottom: '2rem',
    textAlign: 'center',
  },
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)',
    fontSize: 'var(--text-base)',
    fontFamily: 'var(--font-family)',
    outline: 'none',
  },
  button: {
    width: '100%',
    marginTop: '0.5rem',
  },
  error: {
    color: 'var(--color-danger)',
    fontSize: 'var(--text-xs)',
    marginTop: '-0.5rem',
  }
};
