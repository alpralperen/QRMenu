import React, { useState } from 'react';
import { Home, BellRing, ReceiptText, X } from 'lucide-react';
import { createRequest } from '../services/db';
import { useAppContext } from '../context/AppContext';

export const BottomNav = () => {
  const { tableNumber, cafeId } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGarsonCagir = async () => {
    if (!tableNumber) {
      alert("Lütfen menüye QR kod okutarak giriniz (Masa no eksik).");
      return;
    }
    const confirm = window.confirm("Garson çağırmak istediğinize emin misiniz?");
    if (confirm) {
      setLoading(true);
      try {
        await createRequest(cafeId, tableNumber, 'garson');
        alert("Garson çağrıldı!");
      } catch (error) {
        alert("Bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleHesapIste = async (method) => {
    setLoading(true);
    try {
      await createRequest(cafeId, tableNumber, 'hesap', method);
      alert(`${method === 'nakit' ? 'Nakit' : 'Kredi Kartı'} ile hesap istendi!`);
      setIsModalOpen(false);
    } catch (error) {
      alert("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div style={styles.navContainer}>
        <button style={styles.navItem} className="active">
          <Home size={24} />
          <span style={styles.navText}>Menü</span>
        </button>

        <button 
          style={styles.navItem} 
          onClick={handleGarsonCagir}
          disabled={loading}
        >
          <BellRing size={24} />
          <span style={styles.navText}>Garson Çağır</span>
        </button>

        <button 
          style={styles.navItem}
          onClick={() => {
            if(!tableNumber) return alert("QR ile girmelisiniz.");
            setIsModalOpen(true);
          }}
          disabled={loading}
        >
          <ReceiptText size={24} />
          <span style={styles.navText}>Hesap İste</span>
        </button>
      </div>

      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent} className="animate-slide-up">
            <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
              <h3>Hesap İste</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>
            <p style={{ marginBottom: '1.5rem', color: 'var(--color-text-secondary)' }}>Ödemeyi nasıl yapmak istersiniz?</p>
            <div className="flex gap-4">
              <button 
                className="btn btn-outline w-full"
                onClick={() => handleHesapIste('nakit')}
                disabled={loading}
              >
                Nakit
              </button>
              <button 
                className="btn btn-primary w-full"
                onClick={() => handleHesapIste('kart')}
                disabled={loading}
              >
                Kredi Kartı
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const styles = {
  navContainer: {
    position: 'fixed',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: '480px',
    backgroundColor: 'var(--color-surface)',
    borderTop: '1px solid var(--color-border)',
    display: 'flex',
    justifyContent: 'space-around',
    padding: '0.75rem 0',
    zIndex: 50,
  },
  navItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--color-text-secondary)',
    gap: '0.25rem'
  },
  navText: {
    fontSize: 'var(--text-xs)',
    fontWeight: '500'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 100,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: 'var(--color-surface)',
    width: '100%',
    maxWidth: '480px',
    padding: '1.5rem',
    borderTopLeftRadius: 'var(--radius-xl)',
    borderTopRightRadius: 'var(--radius-xl)',
  }
};
