import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRequests, updateRequestStatus } from '../../services/db';
import { useAppContext } from '../../context/AppContext';
import { LogOut, Bell, QrCode, CheckCircle, Printer } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { cafeId } = useAppContext();
  const [activeTab, setActiveTab] = useState('requests');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // QR Code generator states
  const [qrCount, setQrCount] = useState(10);
  const [qrUrlPrefix, setQrUrlPrefix] = useState('');

  // Authentication check
  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) {
      navigate('/admin');
    }
  }, [navigate]);

  useEffect(() => {
    setQrUrlPrefix(window.location.origin);
  }, []);

  // Polling for requests every 10 seconds
  useEffect(() => {
    let interval;
    if (activeTab === 'requests') {
      const fetchReqs = async () => {
        const data = await getRequests(cafeId);
        setRequests(data);
        setLoading(false);
      };
      
      fetchReqs(); // initial fetch
      interval = setInterval(fetchReqs, 10000); // 10 seconds
    }
    return () => clearInterval(interval);
  }, [activeTab, cafeId]);

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/admin');
  };

  const handleCompleteRequest = async (requestId) => {
    try {
      await updateRequestStatus(requestId);
      // Optimistic update
      setRequests(prev => prev.filter(r => r.id !== requestId));
    } catch (error) {
      alert("Durum güncellenirken bir hata oluştu.");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // ---------------- Render Helpers ----------------
  const renderRequestsTab = () => (
    <div className="animate-fade-in" style={styles.tabContent}>
      <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
        <h2 style={styles.sectionTitle}>Aktif Talepler</h2>
        <span style={styles.badge}>{requests.length} Bekleyen</span>
      </div>

      {loading ? (
        <p>Talepler yükleniyor...</p>
      ) : requests.length === 0 ? (
        <div style={styles.emptyState}>
          <CheckCircle size={48} color="var(--color-success)" style={{ opacity: 0.2, marginBottom: '1rem' }} />
          <p>Harika! Bekleyen hiçbir talep yok.</p>
        </div>
      ) : (
        <div style={styles.gridContainer}>
          {requests.map(req => (
            <div key={req.id} style={styles.requestCard}>
              <div className="flex justify-between items-start" style={{ marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: '700', color: 'var(--color-primary)' }}>
                    Masa {req.table_number}
                  </h3>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
                    {new Date(req.timestamp).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div style={{
                  ...styles.typeBadge,
                  backgroundColor: req.request_type === 'garson' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  color: req.request_type === 'garson' ? 'var(--color-success)' : 'var(--color-danger)'
                }}>
                  {req.request_type === 'garson' ? 'Garson' : 'Hesap İste'}
                </div>
              </div>
              
              {req.payment_method && (
                <p style={{ marginBottom: '1rem', fontWeight: '500' }}>
                  Ödeme Türü: <span style={{ textTransform: 'capitalize' }}>{req.payment_method}</span>
                </p>
              )}

              <button 
                className="btn btn-outline w-full" 
                onClick={() => handleCompleteRequest(req.id)}
              >
                <CheckCircle size={18} style={{ marginRight: '0.5rem' }} />
                Tamamlandı
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderQrTab = () => (
    <div className="animate-fade-in" style={styles.tabContent}>
      <div className="flex justify-between items-center hide-on-print" style={{ marginBottom: '1.5rem' }}>
        <h2 style={styles.sectionTitle}>Masa QR Kodları</h2>
        <button className="btn btn-primary" onClick={handlePrint} style={{ padding: '0.5rem 1rem' }}>
          <Printer size={18} style={{ marginRight: '0.5rem' }} /> Yazdır
        </button>
      </div>

      <div className="hide-on-print" style={{ ...styles.card, marginBottom: '2rem' }}>
        <p style={{ marginBottom: '0.5rem', fontWeight: '500' }}>Kaç masa için QR üretilsin?</p>
        <div className="flex gap-4">
          <input 
            type="number" 
            min="1" 
            max="100" 
            value={qrCount}
            onChange={(e) => setQrCount(Number(e.target.value))}
            style={styles.input}
          />
        </div>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
          Site Linki: {qrUrlPrefix}/?masa=X
        </p>
      </div>

      <div style={styles.qrGrid} className="print-grid">
        {Array.from({ length: qrCount }).map((_, idx) => {
          const masaNo = idx + 1;
          const url = `${qrUrlPrefix}/?masa=${masaNo}`;
          return (
            <div key={masaNo} style={styles.qrCard} className="print-qr-card">
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: '700', marginBottom: '1rem' }}>Masa {masaNo}</h3>
              <QRCodeSVG value={url} size={150} level={"H"} />
              <p style={{ fontSize: '10px', marginTop: '1rem', color: 'var(--color-text-secondary)' }}>QR Menü'yü okutun.</p>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div style={styles.page}>
      {/* Print styles */}
      <style>{`
        @media print {
          .hide-on-print { display: none !important; }
          .print-grid { display: grid !important; grid-template-columns: repeat(3, 1fr) !important; gap: 2rem !important; }
          .print-qr-card { break-inside: avoid; border: 1px solid #ccc !important; }
          body { background: white !important; }
          .admin-sidebar { display: none !important; }
          .admin-main { margin-left: 0 !important; padding: 0 !important; }
        }
      `}</style>

      {/* Sidebar */}
      <div style={styles.sidebar} className="admin-sidebar">
        <div style={styles.sidebarHeader}>
          <h1 style={{ color: 'white', fontSize: 'var(--text-xl)' }}>Yönetim</h1>
        </div>
        <nav style={styles.nav}>
          <button 
            style={{ ...styles.navItem, ...(activeTab === 'requests' ? styles.navItemActive : {}) }}
            onClick={() => setActiveTab('requests')}
          >
            <Bell size={20} /> Çağrılar
          </button>
          <button 
            style={{ ...styles.navItem, ...(activeTab === 'qr' ? styles.navItemActive : {}) }}
            onClick={() => setActiveTab('qr')}
          >
            <QrCode size={20} /> QR Kodlar
          </button>
        </nav>
        <div style={{ marginTop: 'auto', padding: '1.5rem' }}>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            <LogOut size={20} /> Çıkış Yap
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent} className="admin-main">
        <div style={styles.topbar} className="hide-on-print">
          <p style={{ fontWeight: '500' }}>QR Menü Admin Paneli</p>
        </div>
        
        <div style={{ padding: '2rem' }}>
          {activeTab === 'requests' && renderRequestsTab()}
          {activeTab === 'qr' && renderQrTab()}
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: 'var(--color-background)',
    maxWidth: '100%',
    margin: 0,
    boxShadow: 'none',
  },
  sidebar: {
    width: '250px',
    backgroundColor: 'var(--color-primary)',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
  },
  sidebarHeader: {
    padding: '2rem 1.5rem',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    padding: '1.5rem 1rem',
    gap: '0.5rem',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    backgroundColor: 'transparent',
    color: 'rgba(255,255,255,0.7)',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    fontSize: 'var(--text-base)',
    fontWeight: '500',
    transition: 'all 0.2s',
  },
  navItemActive: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: 'white',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    width: '100%',
    padding: '0.75rem 1rem',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    color: '#EF4444',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    fontWeight: '500',
  },
  mainContent: {
    marginLeft: '250px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  topbar: {
    height: '70px',
    backgroundColor: 'var(--color-surface)',
    borderBottom: '1px solid var(--color-border)',
    display: 'flex',
    alignItems: 'center',
    padding: '0 2rem',
  },
  tabContent: {
    maxWidth: '1000px',
    margin: '0 auto',
  },
  sectionTitle: {
    fontSize: 'var(--text-2xl)',
    fontWeight: '700',
    color: 'var(--color-primary)',
  },
  badge: {
    backgroundColor: 'var(--color-primary)',
    color: 'white',
    padding: '0.25rem 0.75rem',
    borderRadius: 'var(--radius-full)',
    fontSize: 'var(--text-sm)',
    fontWeight: '600',
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  requestCard: {
    backgroundColor: 'var(--color-surface)',
    padding: '1.5rem',
    borderRadius: 'var(--radius-xl)',
    boxShadow: 'var(--shadow-sm)',
    border: '1px solid var(--color-border)',
  },
  typeBadge: {
    padding: '0.25rem 0.75rem',
    borderRadius: 'var(--radius-full)',
    fontSize: 'var(--text-xs)',
    fontWeight: '600',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem 2rem',
    backgroundColor: 'var(--color-surface)',
    borderRadius: 'var(--radius-xl)',
    color: 'var(--color-text-secondary)',
    border: '1px dashed var(--color-border)',
  },
  card: {
    backgroundColor: 'var(--color-surface)',
    padding: '1.5rem',
    borderRadius: 'var(--radius-xl)',
    boxShadow: 'var(--shadow-sm)',
    border: '1px solid var(--color-border)',
  },
  input: {
    width: '100px',
    padding: '0.5rem',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)',
    fontSize: 'var(--text-base)',
    outline: 'none',
  },
  qrGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '1.5rem',
  },
  qrCard: {
    backgroundColor: 'var(--color-surface)',
    padding: '1.5rem',
    borderRadius: 'var(--radius-xl)',
    boxShadow: 'var(--shadow-sm)',
    border: '1px solid var(--color-border)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  }
};
