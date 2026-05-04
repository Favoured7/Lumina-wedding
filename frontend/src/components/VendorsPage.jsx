import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ServicesPage.css";

const VendorsPage = () => {
  const navigate = useNavigate();
  const vendorsData = [
    { id: "makeup-1", name: "Glow by Clarisse", category: "makeup", price: 150, location: "Kigali", available: true, isFree: false },
    { id: "photo-1", name: "Umucyo Photography", category: "photography", price: 1500, location: "Kigali", available: true, isFree: false },
    { id: "venue-1", name: "Kigali Heights Venue", category: "venues", price: 5000, location: "Kigali", available: false, isFree: false },
    { id: "planner-1", name: "Elegant Weddings", category: "planner", price: 2000, location: "Kigali", available: true, isFree: false },
    { id: "music-1", name: "Kigali Entertainment", category: "musician", price: 800, location: "Kigali", available: true, isFree: false },
    { id: "catering-1", name: "Africana Catering", category: "catering", price: 2500, location: "Kigali", available: true, isFree: false }
  ];
  const [filter, setFilter] = useState("all");
  const [list, setList] = useState(vendorsData);

  const visible = useMemo(() => {
    if (filter === "all") return list;
    if (filter === "available") return list.filter((item) => item.available);
    return list.filter((item) => !item.available);
  }, [filter, list]);

  const toggleAvailability = (id) => {
    setList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, available: !item.available } : item))
    );
  };

  const handleBook = (vendor) => {
    navigate(`/services/${vendor.category}`);
  };

  return (
    <div className="services-page">
      <div className="services-hero">
        <h1>All Vendors</h1>
        <p>Manage vendor availability, edit list state, and continue to booking payment.</p>
      </div>

      <div className="services-container" style={{ display: "block" }}>
        <div className="dashboard-action-row" style={{ marginBottom: 18 }}>
          <button className="btn-secondary" onClick={() => setFilter("all")}>All</button>
          <button className="btn-secondary" onClick={() => setFilter("available")}>Available</button>
          <button className="btn-secondary" onClick={() => setFilter("unavailable")}>Unavailable</button>
        </div>

        <table className="payments-table">
          <thead>
            <tr>
              <th>Vendor</th>
              <th>Category</th>
              <th>Location</th>
              <th>Starting Price</th>
              <th>Availability</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((vendor) => (
              <tr key={vendor.id}>
                <td>{vendor.name}</td>
                <td>{vendor.category}</td>
                <td>{vendor.location}</td>
                <td>${vendor.price.toLocaleString()}</td>
                <td>
                  <span className={`status ${vendor.available ? "confirmed" : "pending"}`}>
                    {vendor.available ? "available" : "unavailable"}
                  </span>
                </td>
                <td style={{ display: "flex", gap: 8 }}>
                  <button className="edit-btn" onClick={() => toggleAvailability(vendor.id)}>Edit</button>
                  <button className="pay-btn" disabled={!vendor.available} onClick={() => handleBook(vendor)}>
                    Book
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VendorsPage;
