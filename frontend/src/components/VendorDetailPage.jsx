import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./VendorDetailPage.css";
import { resolveVendorImage, SERVICE_SLUG_TO_DB_CATEGORY } from "../lib/vendorStockImages";
import { getApiBaseUrl } from "../config/api";

const API_BASE = getApiBaseUrl();

const VendorDetailPage = () => {
  const { category, id } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    setVendor(null);

    fetch(`${API_BASE}/api/vendors/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("not_api");
        return res.json();
      })
      .then((v) => {
        const slug = category || v.category;
        setVendor({
          id: v.id,
          name: v.business_name,
          category: slug,
          rating: v.rating ?? 4.5,
          reviews: 0,
          location: v.location,
          startingPrice: v.price_min,
          description: v.description || "",
          fromApi: true,
          dbCategory: v.category,
          image: resolveVendorImage({
            businessName: v.business_name,
            dbCategory: v.category,
            id: v.id,
          }),
        });
        setLoading(false);
      })
      .catch(() => {
    const vendorDatabase = {
      makeup: {
        1: { id: 1, name: "Glow by Clarisse", category: "makeup", rating: 4.8, reviews: 89, location: "Kigali", startingPrice: 150, description: "Professional makeup artistry for weddings and special events." },
        2: { id: 2, name: "Beauty by Lisa", category: "makeup", rating: 4.9, reviews: 124, location: "Kigali", startingPrice: 250, description: "Luxury bridal makeup artist creating timeless looks." },
        3: { id: 3, name: "Elegant Faces", category: "makeup", rating: 4.7, reviews: 56, location: "Musanze", startingPrice: 120, description: "Natural glam makeup services for weddings." }
      },
      photography: {
        1: { id: 1, name: "Umucyo Photography", category: "photography", rating: 4.9, reviews: 124, location: "Kigali", startingPrice: 1500, description: "Wedding photography coverage and portraits." },
        2: { id: 2, name: "Elite Photos", category: "photography", rating: 4.8, reviews: 98, location: "Kigali", startingPrice: 1200, description: "Luxury wedding and engagement photography." }
      },
      catering: {
        1: { id: 1, name: "Africana Catering", category: "catering", rating: 4.8, reviews: 203, location: "Kigali", startingPrice: 2500, description: "Rwandan and international wedding catering." },
        2: { id: 2, name: "Tasty Catering", category: "catering", rating: 4.7, reviews: 156, location: "Kigali", startingPrice: 1800, description: "Complete catering menus for events." }
      },
      venues: {
        1: { id: 1, name: "Kigali Heights Venue", category: "venues", rating: 4.8, reviews: 156, location: "Kigali", startingPrice: 5000, description: "Elegant wedding venue with premium event spaces." },
        2: { id: 2, name: "Grand Palace", category: "venues", rating: 4.7, reviews: 89, location: "Kigali", startingPrice: 4500, description: "Grand hall for weddings and receptions." }
      },
      musician: {
        1: { id: 1, name: "Kigali Entertainment", category: "musician", rating: 4.7, reviews: 203, location: "Kigali", startingPrice: 800, description: "Professional DJ and MC services." },
        2: { id: 2, name: "Melody Strings", category: "musician", rating: 4.8, reviews: 134, location: "Kigali", startingPrice: 1200, description: "Live wedding band performance." }
      },
      planner: {
        1: { id: 1, name: "Elegant Weddings", category: "planner", rating: 4.9, reviews: 156, location: "Kigali", startingPrice: 2000, description: "Full wedding planning and coordination." },
        2: { id: 2, name: "Perfect Day Planners", category: "planner", rating: 4.8, reviews: 234, location: "Kigali", startingPrice: 1800, description: "Planning support for your full day event." }
      },
      resources: {
        1: { id: 1, name: "The 5 Love Languages", category: "resources", rating: 4.9, reviews: 1245, location: "Online", startingPrice: 0, description: "Free relationship resource." }
      },
      honeymoon: {
        1: { id: 1, name: "Zanzibar Beach Paradise", category: "honeymoon", rating: 4.9, reviews: 234, location: "Zanzibar, Tanzania", startingPrice: 0, specialty: "Beach & Relaxation", image: "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1400&q=80", description: "White sandy beaches, crystal clear waters, and stunning sunsets with romantic island escapes.", bestFor: "Couples who want tropical relaxation and private beach time.", idealDuration: "5-7 nights", offerIncludes: ["Beachfront luxury resorts", "Sunset dhow cruises", "Snorkeling and diving experiences", "Spa and couple wellness packages"] },
        2: { id: 2, name: "Kenyan Safari Adventure", category: "honeymoon", rating: 4.8, reviews: 189, location: "Maasai Mara, Kenya", startingPrice: 0, specialty: "Safari & Wildlife", image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1400&q=80", description: "Experience the wild side of Africa with luxury safari lodges and unforgettable game drives.", bestFor: "Couples who love adventure, wildlife, and unique nature memories.", idealDuration: "4-6 nights", offerIncludes: ["Luxury safari lodge stays", "Game drives with local guides", "Hot-air balloon safari options", "Bush dining and sunset experiences"] },
        3: { id: 3, name: "Seychelles Luxury Escape", category: "honeymoon", rating: 4.9, reviews: 312, location: "Seychelles", startingPrice: 0, specialty: "Luxury Island", image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1400&q=80", description: "Private villas, turquoise waters, and peaceful beaches for a luxury honeymoon experience.", bestFor: "Couples looking for high-end island privacy and luxury service.", idealDuration: "5-8 nights", offerIncludes: ["Private island villas", "Fine-dining oceanfront restaurants", "Yacht day trips", "Premium photography spots"] },
        4: { id: 4, name: "Moroccan Desert Romance", category: "honeymoon", rating: 4.7, reviews: 156, location: "Marrakech, Morocco", startingPrice: 0, specialty: "Desert & Culture", image: "https://images.unsplash.com/photo-1489493887464-892be6d1daae?auto=format&fit=crop&w=1400&q=80", description: "Exotic markets, desert camps, and luxurious riads blended into a romantic cultural journey.", bestFor: "Couples who enjoy culture, architecture, and desert luxury camps.", idealDuration: "4-6 nights", offerIncludes: ["Riad boutique accommodations", "Desert camp experiences", "Guided medina tours", "Traditional Moroccan dining"] },
        5: { id: 5, name: "Paris City of Love", category: "honeymoon", rating: 4.8, reviews: 278, location: "Paris, France", startingPrice: 0, specialty: "City Romance", image: "https://images.unsplash.com/photo-1431274172761-fca41d930114?auto=format&fit=crop&w=1400&q=80", description: "Eiffel Tower views, candlelit dining, and romantic city walks in the heart of Paris.", bestFor: "Couples who want a classic romantic city honeymoon.", idealDuration: "4-5 nights", offerIncludes: ["Eiffel Tower and Seine cruise", "Fine dining and cafes", "Museum and gallery routes", "Romantic city photo locations"] },
        6: { id: 6, name: "Maldives Overwater Villa", category: "honeymoon", rating: 5.0, reviews: 456, location: "Maldives", startingPrice: 0, specialty: "Overwater Bungalows", image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1400&q=80", description: "Crystal lagoons and overwater villas for an ultra-luxury honeymoon retreat.", bestFor: "Couples seeking complete serenity, sea views, and luxury villas.", idealDuration: "5-7 nights", offerIncludes: ["Overwater private villas", "Floating breakfasts and private dinners", "Snorkeling with marine life", "Spa and wellness experiences"] }
      }
    };

    const record = vendorDatabase[category]?.[id];
    if (!record) {
      setVendor(null);
      setLoading(false);
      return;
    }
    const dbCategory =
      SERVICE_SLUG_TO_DB_CATEGORY[record.category] ||
      SERVICE_SLUG_TO_DB_CATEGORY[category] ||
      "photography";
    setVendor({
      ...record,
      dbCategory,
      image:
        record.image ??
        resolveVendorImage({
          businessName: record.name,
          dbCategory,
          id,
        }),
    });
    setLoading(false);
      });
  }, [id, category]);

  const handleBookNow = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!token || !user) {
      navigate('/login');
      return;
    }
    setShowBookingModal(true);
  };

  const confirmBooking = () => {
    alert(`Booking created for ${vendor.name}.`);
    setShowBookingModal(false);
    navigate('/dashboard/couple');
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div><p>Loading details...</p></div>;
  if (!vendor) return <div className="error-container"><h2>Not Found</h2><p>Sorry, we couldn't find what you're looking for.</p><Link to="/" className="back-home-btn">Back to Home</Link></div>;

  const heroImage = vendor.image || "https://placehold.co/1400x500/f3f4f6/111?text=Lumina+Weddings";
  const isHoneymoon = vendor.category === "honeymoon";

  return (
    <div className="vendor-detail-page">
      <div className="vendor-detail-hero" style={{ backgroundImage: `linear-gradient(135deg, rgba(0,0,0,.65), rgba(0,0,0,.45)), url('${heroImage}')` }}>
        <div className="vendor-detail-hero-content">
          <Link to={`/services/${category}`} className="back-link">← Back to {category}</Link>
          <h1>{vendor.name}</h1>
          <div className="hero-badges">
            <div className="rating-badge"><span>{"★".repeat(Math.round(vendor.rating || 4.5))}</span><span>{vendor.rating.toFixed(1)} {vendor.reviews > 0 ? `(${vendor.reviews} reviews)` : "(Approved vendor)"}</span></div>
            <div className="location-badge">{vendor.location}</div>
          </div>
        </div>
      </div>

      <div className="vendor-detail-container">
        <div className="vendor-detail-main">
          <div className="detail-section">
            <h2>{isHoneymoon ? "About this place" : "About this vendor"}</h2>
            <p className="description-text">{vendor.description}</p>
            <div className="info-grid">
              <div className="info-grid-item"><h4>Category</h4><p>{vendor.category}</p></div>
              <div className="info-grid-item"><h4>Location</h4><p>{vendor.location}</p></div>
              <div className="info-grid-item"><h4>{isHoneymoon ? "Estimated Budget" : "Starting Price"}</h4><p>{isHoneymoon ? "Varies by package and season" : vendor.fromApi ? `RF ${Number(vendor.startingPrice).toLocaleString()}` : `$${vendor.startingPrice.toLocaleString()}`}</p></div>
            </div>
          </div>
          {isHoneymoon && (
            <div className="detail-section">
              <h2>What this place offers</h2>
              <ul className="services-list-detail">
                {(vendor.offerIncludes || []).map((item) => (
                  <li key={item}><span>{item}</span></li>
                ))}
              </ul>
              <div className="info-grid" style={{ marginTop: 18 }}>
                <div className="info-grid-item"><h4>Best for</h4><p>{vendor.bestFor || "Romantic escapes"}</p></div>
                <div className="info-grid-item"><h4>Ideal duration</h4><p>{vendor.idealDuration || "4-7 nights"}</p></div>
                <div className="info-grid-item"><h4>Trip type</h4><p>{vendor.specialty || "Honeymoon inspiration"}</p></div>
              </div>
            </div>
          )}
        </div>

        {!isHoneymoon && (
          <div className="vendor-detail-sidebar">
          <div className="info-card pricing-card">
            <h3>Book This Vendor</h3>
            <p>Estimated total: <strong>{vendor.fromApi ? `RF ${Number(vendor.startingPrice).toLocaleString()}` : `$${vendor.startingPrice.toLocaleString()}`}</strong></p>
            <div className="form-group">
              <label>Wedding Date</label>
              <input type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Special Requests</label>
              <textarea rows="3" value={bookingNotes} onChange={(e) => setBookingNotes(e.target.value)} placeholder="Optional details for vendor"></textarea>
            </div>
            <button className="book-now-btn" onClick={handleBookNow}>
              Book Now
            </button>
          </div>
          </div>
        )}
      </div>

      {!isHoneymoon && showBookingModal && (
        <div className="modal-overlay" onClick={() => setShowBookingModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><h2>Book {vendor.name}</h2><button className="close-modal" onClick={() => setShowBookingModal(false)}>×</button></div>
            <div className="modal-body">
              <div className="form-group"><label>Select Date <span className="required">*</span></label><input type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} min={new Date().toISOString().split('T')[0]} required /></div>
              <div className="form-group"><label>Special Requests (Optional)</label><textarea rows="4" value={bookingNotes} onChange={(e) => setBookingNotes(e.target.value)} placeholder="Any special requests or notes for the vendor..." /></div>
              <div className="price-summary"><h4>Booking Summary</h4><div className="price-row"><span>Total amount:</span><strong>{vendor.fromApi ? `RF ${Number(vendor.startingPrice).toLocaleString()}` : `$${vendor.startingPrice.toLocaleString()}`}</strong></div><small className="payment-note">*Deposit may be required to confirm booking</small></div>
            </div>
            <div className="modal-buttons"><button className="confirm-btn" onClick={confirmBooking}>Confirm Booking</button><button className="cancel-btn" onClick={() => setShowBookingModal(false)}>Cancel</button></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorDetailPage;