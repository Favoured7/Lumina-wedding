import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const user = useMemo(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  }, []);
  const bookings = useMemo(() => {
    const raw = localStorage.getItem('wedding_bookings');
    return raw ? JSON.parse(raw) : [];
  }, []);
  const checklist = useMemo(() => {
    const raw = localStorage.getItem('wedding_checklist');
    return raw ? JSON.parse(raw) : [];
  }, []);

  const stats = {
    totalCouples: user?.role === 'couple' ? 1 : 0,
    totalVendors: bookings.length,
    totalBookings: bookings.length,
    totalRevenue: bookings.reduce((sum, item) => sum + (item.paidAmount || 0), 0),
    pendingVendors: bookings.filter((item) => item.status !== 'confirmed').length,
    pendingBookings: checklist.filter((item) => !item.completed).length
  };

  const styles = {
    dashboard: { display: 'flex', minHeight: '100vh', background: '#f5f5f5' },
    sidebar: { width: '280px', background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)', color: 'white', position: 'fixed', height: '100vh' },
    sidebarHeader: { padding: '25px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' },
    sidebarHeaderH2: { margin: 0, fontSize: '24px', color: '#00c3ff' },
    sidebarNav: { padding: '20px 0' },
    navItem: { width: '100%', padding: '12px 25px', background: 'none', border: 'none', color: '#ccc', textAlign: 'left', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' },
    navItemActive: { background: 'rgba(0, 195, 255, 0.15)', color: '#00c3ff', borderRight: '3px solid #00c3ff' },
    main: { flex: 1, marginLeft: '280px', padding: '20px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '15px 25px', borderRadius: '10px', marginBottom: '25px' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' },
    statCard: { background: 'white', padding: '20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '15px' },
    statNumber: { margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#333' },
    recentSection: { background: 'white', borderRadius: '12px', padding: '20px', marginBottom: '30px' },
    dataTable: { width: '100%', borderCollapse: 'collapse' },
    tableHeader: { padding: '12px', textAlign: 'left', borderBottom: '1px solid #eee', background: '#f8f9fa', fontWeight: 'bold' },
    tableCell: { padding: '12px', textAlign: 'left', borderBottom: '1px solid #eee' },
    statusConfirmed: { background: '#e8f5e9', color: '#4caf50', padding: '4px 12px', borderRadius: '20px', fontSize: '12px' },
    statusPending: { background: '#fff3e0', color: '#ff9800', padding: '4px 12px', borderRadius: '20px', fontSize: '12px' },
    approveBtn: { background: '#4caf50', color: 'white', border: 'none', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer', marginRight: '8px' },
    rejectBtn: { background: '#f44336', color: 'white', border: 'none', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer' },
    logoutBtn: { background: '#ff4444', color: 'white', padding: '8px 16px', borderRadius: '6px', textDecoration: 'none', fontSize: '14px' }
  };

  return (
    <div style={styles.dashboard}>
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <h2 style={styles.sidebarHeaderH2}>Lumina Admin</h2>
        </div>
        <nav style={styles.sidebarNav}>
          <button style={{...styles.navItem, ...(activeTab === 'overview' ? styles.navItemActive : {})}} onClick={() => setActiveTab('overview')}>📊 Overview</button>
          <button style={{...styles.navItem, ...(activeTab === 'couples' ? styles.navItemActive : {})}} onClick={() => setActiveTab('couples')}>👥 Couples</button>
          <button style={{...styles.navItem, ...(activeTab === 'vendors' ? styles.navItemActive : {})}} onClick={() => setActiveTab('vendors')}>🏪 Vendors</button>
          <button style={{...styles.navItem, ...(activeTab === 'bookings' ? styles.navItemActive : {})}} onClick={() => setActiveTab('bookings')}>📅 Bookings</button>
          <button style={{...styles.navItem, ...(activeTab === 'payments' ? styles.navItemActive : {})}} onClick={() => setActiveTab('payments')}>💰 Payments</button>
          <button style={{...styles.navItem, ...(activeTab === 'settings' ? styles.navItemActive : {})}} onClick={() => setActiveTab('settings')}>⚙️ Settings</button>
        </nav>
      </div>

      <div style={styles.main}>
        <div style={styles.header}>
          <h1>Admin Dashboard</h1>
          <div>
            <Link to="/login/admin" style={styles.logoutBtn}>Logout</Link>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div>
            <div style={styles.statsGrid}>
              <div style={styles.statCard}><div>👥</div><div><h3>Total Couples</h3><p style={styles.statNumber}>{stats.totalCouples}</p></div></div>
              <div style={styles.statCard}><div>🏪</div><div><h3>Total Vendors</h3><p style={styles.statNumber}>{stats.totalVendors}</p><small>{stats.pendingVendors} pending</small></div></div>
              <div style={styles.statCard}><div>📅</div><div><h3>Total Bookings</h3><p style={styles.statNumber}>{stats.totalBookings}</p><small>{stats.pendingBookings} pending</small></div></div>
              <div style={styles.statCard}><div>💰</div><div><h3>Total Revenue</h3><p style={styles.statNumber}>${stats.totalRevenue.toLocaleString()}</p></div></div>
            </div>

            <div style={styles.recentSection}>
              <h2>Recent Bookings</h2>
              <table style={styles.dataTable}>
                <thead><tr><th style={styles.tableHeader}>Couple</th><th style={styles.tableHeader}>Vendor</th><th style={styles.tableHeader}>Date</th><th style={styles.tableHeader}>Amount</th><th style={styles.tableHeader}>Status</th></tr></thead>
                <tbody>
                  {(bookings.length ? bookings : []).map(booking => (
                    <tr key={booking.id}>
                      <td style={styles.tableCell}>{user?.name || 'Couple User'}</td>
                      <td style={styles.tableCell}>{booking.vendorName}</td>
                      <td style={styles.tableCell}>{booking.date}</td>
                      <td style={styles.tableCell}>${booking.totalAmount || 0}</td>
                      <td style={styles.tableCell}><span style={booking.status === 'confirmed' ? styles.statusConfirmed : styles.statusPending}>{booking.status}</span></td>
                    </tr>
                  ))}
                  {!bookings.length && (
                    <tr>
                      <td colSpan="5" style={styles.tableCell}>No bookings yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div style={styles.recentSection}>
              <h2>Vendors and Payments</h2>
              <table style={styles.dataTable}>
                <thead><tr><th style={styles.tableHeader}>Business Name</th><th style={styles.tableHeader}>Type</th><th style={styles.tableHeader}>Status</th><th style={styles.tableHeader}>Paid</th><th style={styles.tableHeader}>Actions</th></tr></thead>
                <tbody>
                  {bookings.map(vendor => (
                    <tr key={vendor.id}>
                      <td style={styles.tableCell}>{vendor.vendorName}</td>
                      <td style={styles.tableCell}>{vendor.type}</td>
                      <td style={styles.tableCell}>{vendor.status || 'pending'}</td>
                      <td style={styles.tableCell}>${vendor.paidAmount || 0}</td>
                      <td style={styles.tableCell}><button style={styles.approveBtn}>Approve</button><button style={styles.rejectBtn}>Reject</button></td>
                    </tr>
                  ))}
                  {!bookings.length && (
                    <tr>
                      <td colSpan="5" style={styles.tableCell}>No vendors to organize yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab !== 'overview' && (
          <div style={styles.recentSection}>
            <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management</h2>
            <p>Manage all {activeTab} here. Coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;