import React, { useMemo } from "react";
import "./Dashboard.css";

const VendorDashboard = () => {
  const user = useMemo(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : { name: "Vendor" };
  }, []);

  const bookings = useMemo(() => {
    const raw = localStorage.getItem("wedding_bookings");
    return raw ? JSON.parse(raw) : [];
  }, []);

  const paidBookings = bookings.filter((item) => (item.paidAmount || 0) > 0);
  const totalRevenue = paidBookings.reduce((sum, item) => sum + (item.paidAmount || 0), 0);
  const pendingBalance = bookings.reduce(
    (sum, item) => sum + Math.max((item.totalAmount || 0) - (item.paidAmount || 0), 0),
    0
  );

  return (
    <div className="dashboard-container">
      <div className="dashboard-main" style={{ marginLeft: 0 }}>
        <div className="dashboard-header">
          <h1>Vendor Dashboard</h1>
          <div className="wedding-date">Welcome, {user?.name || "Vendor"}</div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Bookings</h3>
            <div className="stat-number">{bookings.length}</div>
          </div>
          <div className="stat-card">
            <h3>Couples Who Paid</h3>
            <div className="stat-number">{paidBookings.length}</div>
          </div>
          <div className="stat-card">
            <h3>Revenue Received</h3>
            <div className="stat-number">${totalRevenue.toLocaleString()}</div>
          </div>
          <div className="stat-card">
            <h3>Pending Balance</h3>
            <div className="stat-number">${pendingBalance.toLocaleString()}</div>
          </div>
        </div>

        <div className="recent-section">
          <h2>Payments and Couples</h2>
          <table className="payments-table">
            <thead>
              <tr>
                <th>Couple Booking</th>
                <th>Service</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty-row">
                    No bookings yet.
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>{booking.vendorName}</td>
                    <td>{booking.type}</td>
                    <td>${(booking.totalAmount || 0).toLocaleString()}</td>
                    <td>${(booking.paidAmount || 0).toLocaleString()}</td>
                    <td>
                      <span className={`status ${booking.status || "pending"}`}>
                        {booking.status || "pending"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
