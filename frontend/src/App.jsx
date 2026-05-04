import { useEffect, useState } from "react";
import { Link, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import About from "./components/About";
import Contact from "./components/Contact";
import VendorsPage from "./components/VendorsPage";
import ServicesCategoryPage from "./components/ServicesPage";
import VendorDetailPage from "./components/VendorDetailPage";
import logo from "./assets/logo.jpg";
import { getApiBaseUrl } from "./config/api";

const API = getApiBaseUrl();
const VENDOR_SERVICE_CATEGORIES = ["makeup", "photography", "catering", "venue", "music", "planner"];

const categories = VENDOR_SERVICE_CATEGORIES;
const checklistCategories = VENDOR_SERVICE_CATEGORIES;

const COUPLE_SERVICE_LINKS = [
  { title: "Relationship Resources", slug: "resources" },
  { title: "Makeup Artist", slug: "makeup" },
  { title: "Photography", slug: "photography" },
  { title: "Catering", slug: "catering" },
  { title: "Ceremony Venues", slug: "venues" },
  { title: "Honeymoon", slug: "honeymoon" },
  { title: "Musician & DJ", slug: "musician" },
  { title: "Wedding Planner", slug: "planner" },
];

async function api(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

const rwf = (value) => new Intl.NumberFormat("en-RW", { style: "currency", currency: "RWF", maximumFractionDigits: 0 }).format(value || 0);

function Layout({ children }) {
  return (
    <div>
      <main>{children}</main>
      <footer className="footer">+250796599651 | luminalove.com@gmail.com | KG7 Ave Kigali</footer>
    </div>
  );
}

function LoginPage({ adminOnly = false }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const data = await api("/api/auth/login", { method: "POST", body: JSON.stringify(form) });
      if (adminOnly && data.user.role !== "admin") {
        setError("This page is only for admins.");
        return;
      }
      nav(`/dashboard/${data.user.role}`);
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };
  return <Layout><section className="panel"><h2>{adminOnly ? "Admin Login" : "Login"}</h2><form className="form" onSubmit={submit}><input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /><input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />{error && <p style={{ color: "crimson", margin: 0 }}>{error}</p>}<button className="btn" disabled={loading}>{loading ? "Logging in..." : "Login"}</button></form></section></Layout>;
}

function RegisterHub() {
  return (
    <Layout>
      <section className="register-hub">
        <h1 className="register-hub-title">Create an account</h1>
        <p className="register-hub-lead">Choose how you will use Lumina Weddings.</p>
        <div className="register-hub-cards">
          <Link to="/register/couple" className="register-hub-card">
            <h2 className="register-hub-card-title">I am planning a wedding</h2>
            <p className="register-hub-card-text">Register as a couple to book vendors, pay securely, and manage your checklist.</p>
          </Link>
          <Link to="/register/vendor" className="register-hub-card">
            <h2 className="register-hub-card-title">I am a vendor</h2>
            <p className="register-hub-card-text">List your business, receive paid bookings, and get payouts to your bank (80% after Lumina’s platform fee).</p>
          </Link>
        </div>
        <p className="register-hub-login">
          <Link to="/login">Already have an account? Log in</Link>
        </p>
      </section>
    </Layout>
  );
}

function RegisterPage({ fixedRole }) {
  const [role, setRole] = useState(fixedRole || "couple");
  const [form, setForm] = useState({
    full_name: "",
    wedding_date: "",
    phone: "",
    location: "Kigali",
    business_name: "",
    category: "photography",
    description: "",
    price_range: "",
    payout_bank_name: "",
    payout_account_number: "",
    payout_account_holder: "",
    email: "",
    password: "",
  });
  const nav = useNavigate();

  const effectiveRole = fixedRole || role;

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api("/api/auth/register", { method: "POST", body: JSON.stringify({ ...form, role: effectiveRole }) });
      alert(effectiveRole === "vendor" ? "Vendor registered. An admin will review your listing before it appears publicly." : "Registration successful. You can now log in.");
      nav("/login");
    } catch (err) {
      alert(err.message || "Registration failed");
    }
  };

  const title = fixedRole === "vendor" ? "Vendor registration" : fixedRole === "couple" ? "Couple registration" : "Register";

  return (
    <Layout>
      <section className="panel">
        <h2>{title}</h2>
        {!fixedRole && (
          <select value={role} onChange={(e) => setRole(e.target.value)} style={{ marginBottom: 12 }}>
            <option value="couple">Couple</option>
            <option value="vendor">Vendor</option>
          </select>
        )}
        <form className="form" onSubmit={submit}>
          <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          {effectiveRole === "couple" ? (
            <>
              <input placeholder="Full name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
              <input type="date" value={form.wedding_date} onChange={(e) => setForm({ ...form, wedding_date: e.target.value })} required />
              <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
              <select value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}>
                <option>Kigali</option>
                <option>Musanze</option>
                <option>Nyagatare</option>
              </select>
            </>
          ) : (
            <>
              <input placeholder="Business name" value={form.business_name} onChange={(e) => setForm({ ...form, business_name: e.target.value })} required />
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{categories.map((c) => <option key={c}>{c}</option>)}</select>
              <input placeholder="Price range e.g. 150000-300000" value={form.price_range} onChange={(e) => setForm({ ...form, price_range: e.target.value })} required />
              <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
              <input placeholder="Service location (city)" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
              <p style={{ fontWeight: 600, margin: "8px 0 4px" }}>Payout bank account (for your 80% share)</p>
              <input placeholder="Bank name" value={form.payout_bank_name} onChange={(e) => setForm({ ...form, payout_bank_name: e.target.value })} />
              <input placeholder="Account number" value={form.payout_account_number} onChange={(e) => setForm({ ...form, payout_account_number: e.target.value })} />
              <input placeholder="Account holder name" value={form.payout_account_holder} onChange={(e) => setForm({ ...form, payout_account_holder: e.target.value })} />
              <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>You can also add or edit this later in your vendor dashboard. Lumina retains 20% per booking as a platform fee.</p>
            </>
          )}
          <button className="btn" type="submit">Register</button>
        </form>
        <p><Link to="/register">← Back to account type</Link></p>
      </section>
    </Layout>
  );
}

function CoupleDashboard() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  const [bookingDraft, setBookingDraft] = useState(null);
  const [form, setForm] = useState({ item_name: "", category: "photography" });
  const [feeSettings, setFeeSettings] = useState({ platform_fee_percent: 0.2 });
  const [coupleProfile, setCoupleProfile] = useState(null);
  const [checklistError, setChecklistError] = useState("");
  const refresh = () => {
    api("/api/checklist")
      .then((data) => {
        setItems(data);
        setChecklistError("");
      })
      .catch((err) => setChecklistError(err.message || "Unable to load checklist right now."));
    api("/api/couple/bookings")
      .then(setBookings)
      .catch(() => {});
  };
  useEffect(() => { refresh(); }, []);
  useEffect(() => {
    api("/api/platform-settings").then(setFeeSettings).catch(() => {});
    api("/api/couple/profile").then(setCoupleProfile).catch(() => {});
  }, []);
  const logout = async () => {
    try {
      await api("/api/auth/logout", { method: "POST" });
    } catch {
      /* still navigate away */
    }
    navigate("/login", { replace: true });
  };
  const create = async (e) => {
    e.preventDefault();
    try {
      await api("/api/checklist", { method: "POST", body: JSON.stringify(form) });
      setForm({ item_name: "", category: "photography" });
      setChecklistError("");
      refresh();
    } catch (err) {
      setChecklistError(err.message || "Could not add checklist item.");
    }
  };
  const findVendors = async (item) => {
    try {
      setActiveItem(item);
      const params = new URLSearchParams({ category: item.category });
      if (coupleProfile?.wedding_date) params.set("wedding_date", coupleProfile.wedding_date);
      setVendors(await api(`/api/vendors?${params.toString()}`));
    } catch {
      setVendors([]);
    }
  };
  const payBooking = async (e) => {
    e.preventDefault();
    const booking = await api("/api/bookings", {
      method: "POST",
      body: JSON.stringify({
        vendor_id: bookingDraft.vendor.id,
        checklist_item_id: activeItem.id,
        service_description: bookingDraft.vendor.business_name,
        special_requests: bookingDraft.special_requests,
        total_price_rwf: bookingDraft.vendor.price_max,
      }),
    });
    await api(`/api/bookings/${booking.id}/pay`, {
      method: "PUT",
      body: JSON.stringify({
        payment_method: bookingDraft.payment_method,
        card_number: bookingDraft.card_number,
        momo_phone: bookingDraft.momo_phone,
      }),
    });
    alert("Payment successful. 20% supports Lumina; 80% is allocated to your vendor.");
    setBookingDraft(null);
    setActiveItem(null);
    refresh();
  };
  return (
    <Layout>
      <section className="panel">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
          <h2 style={{ margin: 0 }}>Couple Dashboard</h2>
          <button type="button" className="btn" onClick={logout}>Log out</button>
        </div>
        <div className="panel" style={{ marginBottom: 24, padding: 20, background: "#f4f6fb", borderRadius: 12, border: "1px solid #e2e8f0" }}>
          <h3 style={{ marginTop: 0 }}>Services & vendors</h3>
          <p style={{ marginBottom: 14, color: "#475569" }}>Browse the same service categories as the homepage — saved here for logged-in couples.</p>
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
            {COUPLE_SERVICE_LINKS.map((s) => (
              <Link key={s.slug} to={`/services/${s.slug}`} className="card" style={{ textDecoration: "none", color: "inherit", padding: "14px 16px", display: "block" }}>
                {s.title}
              </Link>
            ))}
          </div>
        </div>
        {checklistError ? <p style={{ color: "crimson" }}>{checklistError}</p> : null}
        {coupleProfile?.wedding_date ? (
          <p style={{ margin: "4px 0 10px", color: "#475569", fontSize: 14 }}>
            Vendor availability is checked for your wedding date: <strong>{coupleProfile.wedding_date}</strong>
          </p>
        ) : null}
        <p>{items.length ? "" : "✨ Your checklist is empty. Add your first wedding task to start planning."}</p>
        <form className="form compact" onSubmit={create}>
          <input value={form.item_name} placeholder="Item name" onChange={(e) => setForm({ ...form, item_name: e.target.value })} required />
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{checklistCategories.map((c) => <option key={c}>{c}</option>)}</select>
          <button className="btn" type="submit">+ Add checklist item</button>
        </form>
        <div className="grid">
          {items.map((it) => (
            <div className="card" key={it.id}>
              <label>
                <input
                  type="checkbox"
                  checked={it.is_completed}
                  onChange={(e) =>
                    api(`/api/checklist/${it.id}`, { method: "PUT", body: JSON.stringify({ is_completed: e.target.checked }) })
                      .then(() => {
                        setChecklistError("");
                        refresh();
                      })
                      .catch((err) => setChecklistError(err.message || "Could not update checklist item."))
                  }
                />
                {" "}
                {it.item_name}
              </label>
              <p>{it.category}</p>
              <button type="button" onClick={() => {
                const item_name = prompt("Edit item name", it.item_name);
                const category = prompt("Edit category", it.category);
                if (item_name && category) {
                  api(`/api/checklist/${it.id}`, { method: "PUT", body: JSON.stringify({ item_name, category }) })
                    .then(() => {
                      setChecklistError("");
                      refresh();
                    })
                    .catch((err) => setChecklistError(err.message || "Could not edit checklist item."));
                }
              }}
              >
                Edit
              </button>
              <button type="button" onClick={() => findVendors(it)}>Find vendors</button>
              <button
                type="button"
                onClick={() =>
                  api(`/api/checklist/${it.id}`, { method: "DELETE" })
                    .then(() => {
                      setChecklistError("");
                      refresh();
                    })
                    .catch((err) => setChecklistError(err.message || "Could not delete checklist item."))
                }
              >
                Delete
              </button>
            </div>
          ))}
        </div>
        {activeItem && (
          <div className="panel">
            <h3>Matching vendors ({activeItem.category})</h3>
            {coupleProfile?.wedding_date ? <p style={{ marginTop: 0, color: "#64748b" }}>Availability for your wedding date: {coupleProfile.wedding_date}</p> : null}
            <div className="grid">
              {vendors.map((v) => (
                <div className="card" key={v.id}>
                  <h4>{v.business_name}</h4>
                  <p>{v.category} | {v.location}</p>
                  <p>{rwf(v.price_min)} - {rwf(v.price_max)}</p>
                  <p>{"★".repeat(Math.round(v.rating || 4))}</p>
                  {v.available === false ? (
                    <p style={{ color: "crimson", margin: "6px 0" }}>{v.unavailable_reason || "Not available on your date"}</p>
                  ) : (
                    <p style={{ color: "#16a34a", margin: "6px 0" }}>Available on your date</p>
                  )}
                  <button
                    type="button"
                    disabled={v.available === false}
                    onClick={() => setBookingDraft({
                      vendor: v,
                      special_requests: "",
                      payment_method: "visa",
                      card_number: "4242424242424242",
                      momo_phone: "250788000000",
                    })}
                  >
                    Book this vendor
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        {bookingDraft && (() => {
          const total = bookingDraft.vendor.price_max;
          const p = feeSettings.platform_fee_percent ?? 0.2;
          const luminaPart = Math.round(total * p);
          const vendorPart = total - luminaPart;
          const isCard = ["visa", "mastercard", "amex"].includes(bookingDraft.payment_method);
          const isMomo = ["mtn_momo", "airtel_money"].includes(bookingDraft.payment_method);
          return (
            <div className="panel">
              <h3>Booking + payment</h3>
              <p>Vendor: {bookingDraft.vendor.business_name}</p>
              <p>Wedding date: from your couple profile</p>
              <p><strong>Total due: {rwf(total)}</strong></p>
              <ul style={{ fontSize: 14, color: "#334155", margin: "8px 0 16px" }}>
                <li>Lumina platform fee ({Math.round(p * 100)}%): {rwf(luminaPart)}</li>
                <li>Vendor receives ({Math.round((1 - p) * 100)}%): {rwf(vendorPart)}</li>
              </ul>
              <form className="form" onSubmit={payBooking}>
                <textarea placeholder="Special requests" value={bookingDraft.special_requests} onChange={(e) => setBookingDraft({ ...bookingDraft, special_requests: e.target.value })} />
                <label style={{ display: "block", marginBottom: 8 }}>Payment method</label>
                <select
                  value={bookingDraft.payment_method}
                  onChange={(e) => setBookingDraft({ ...bookingDraft, payment_method: e.target.value })}
                >
                  <option value="visa">Visa (card)</option>
                  <option value="mastercard">Mastercard</option>
                  <option value="amex">American Express</option>
                  <option value="mtn_momo">MTN Mobile Money</option>
                  <option value="airtel_money">Airtel Money</option>
                </select>
                {isCard && (
                  <input
                    placeholder="Card number (test: 4242424242424242)"
                    value={bookingDraft.card_number}
                    onChange={(e) => setBookingDraft({ ...bookingDraft, card_number: e.target.value })}
                    required
                  />
                )}
                {isMomo && (
                  <input
                    placeholder="Mobile money number (e.g. 250788...)"
                    value={bookingDraft.momo_phone}
                    onChange={(e) => setBookingDraft({ ...bookingDraft, momo_phone: e.target.value })}
                    required
                  />
                )}
                <button className="btn" type="submit">Pay {rwf(total)}</button>
              </form>
            </div>
          );
        })()}
        <h3>My bookings</h3>
        <div className="grid">
          {bookings.map((b) => (
            <div className="card" key={b.id}>
              <p style={{ fontWeight: 700 }}>Vendor: {b.vendor?.business_name || "—"}</p>
              {b.service_description && b.service_description !== b.vendor?.business_name ? (
                <p style={{ color: "#64748b", fontSize: 14 }}>Note: {b.service_description}</p>
              ) : null}
              <p>Payment: <strong>{b.payment_status}</strong></p>
              <p>Service: <strong>{b.status}</strong></p>
              <p>Total: {rwf(b.total_price_rwf)}</p>
              {b.payment_status === "paid" && b.vendor_payout_rwf != null && (
                <p style={{ fontSize: 13, color: "#64748b" }}>
                  Includes {rwf(b.platform_fee_rwf)} platform fee; vendor share {rwf(b.vendor_payout_rwf)}.
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}

function VendorDashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [profile, setProfile] = useState(null);
  const [filter, setFilter] = useState("all");
  const [payout, setPayout] = useState({ payout_bank_name: "", payout_account_number: "", payout_account_holder: "" });

  const refresh = async () => {
    const q = filter === "all" ? "" : `?status=${filter === "active" ? "active" : "completed"}`;
    try {
      const [list, prof] = await Promise.all([
        api(`/api/vendor/paid-couples${q}`),
        api("/api/vendor/profile"),
      ]);
      setBookings(list);
      setProfile(prof);
      if (prof.vendor) {
        setPayout({
          payout_bank_name: prof.vendor.payout_bank_name || "",
          payout_account_number: prof.vendor.payout_account_number || "",
          payout_account_holder: prof.vendor.payout_account_holder || "",
        });
      }
    } catch {
      setBookings([]);
    }
  };

  useEffect(() => {
    refresh();
  }, [filter]);

  const logout = async () => {
    try {
      await api("/api/auth/logout", { method: "POST" });
    } catch {
      /* still leave */
    }
    navigate("/login", { replace: true });
  };

  const savePayout = async (e) => {
    e.preventDefault();
    await api("/api/vendor/payout-account", { method: "PUT", body: JSON.stringify(payout) });
    alert("Payout account saved.");
    refresh();
  };

  const stats = profile?.stats;

  return (
    <Layout>
      <section className="panel">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
          <h2 style={{ margin: 0 }}>Vendor dashboard</h2>
          <button type="button" className="btn" onClick={logout}>Log out</button>
        </div>

        {stats && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 24 }}>
            <div className="card" style={{ padding: 14 }}>
              <div style={{ fontSize: 13, color: "#64748b" }}>Paid bookings</div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{stats.paid_bookings}</div>
            </div>
            <div className="card" style={{ padding: 14 }}>
              <div style={{ fontSize: 13, color: "#64748b" }}>Your earnings (80%)</div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{rwf(stats.your_earnings_rwf)}</div>
            </div>
            <div className="card" style={{ padding: 14 }}>
              <div style={{ fontSize: 13, color: "#64748b" }}>Lumina fees (20%)</div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{rwf(stats.lumina_fees_rwf)}</div>
            </div>
          </div>
        )}

        <div className="panel" style={{ marginBottom: 24, padding: 18, background: "#f8fafc", borderRadius: 12 }}>
          <h3 style={{ marginTop: 0 }}>Payout bank account</h3>
          <p style={{ fontSize: 14, color: "#475569", marginTop: 0 }}>
            Lumina settles your share ({stats ? Math.round((1 - stats.platform_fee_percent) * 100) : 80}% of each paid booking) to this account after each completed booking cycle.
          </p>
          <form className="form compact" onSubmit={savePayout}>
            <input placeholder="Bank name" value={payout.payout_bank_name} onChange={(e) => setPayout({ ...payout, payout_bank_name: e.target.value })} />
            <input placeholder="Account number" value={payout.payout_account_number} onChange={(e) => setPayout({ ...payout, payout_account_number: e.target.value })} />
            <input placeholder="Account holder (must match bank records)" value={payout.payout_account_holder} onChange={(e) => setPayout({ ...payout, payout_account_holder: e.target.value })} />
            <button className="btn" type="submit">Save payout details</button>
          </form>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginBottom: 16 }}>
          <span style={{ fontWeight: 600 }}>Show bookings:</span>
          {["all", "active", "completed"].map((f) => (
            <button
              key={f}
              type="button"
              className="btn"
              style={{ opacity: filter === f ? 1 : 0.65, fontSize: 14, padding: "6px 12px" }}
              onClick={() => setFilter(f)}
            >
              {f === "all" ? "All paid" : f === "active" ? "Active (in progress)" : "Completed"}
            </button>
          ))}
        </div>

        <h3>Couples who paid you</h3>
        {!bookings.length && (
          <p style={{ color: "#64748b", fontSize: 14, marginBottom: 12 }}>
            If a couple shows a paid booking but you see nothing here, log in with the vendor account that matches <strong>Vendor</strong> on their receipt (not the checklist note).
          </p>
        )}
        <div className="grid">
          {bookings.map((b) => {
            const listedName = profile?.vendor?.business_name;
            const legacyNote =
              b.service_description &&
              listedName &&
              b.service_description.trim().toLowerCase() !== listedName.trim().toLowerCase();
            return (
            <div className="card" key={b.id}>
              <p style={{ fontWeight: 600 }}>{b.couple.full_name}</p>
              <p>{b.couple.user?.email}</p>
              <p>{b.couple.phone}</p>
              <p>Wedding date: {b.wedding_date}</p>
              <p style={{ fontWeight: 700 }}>Your venue: {listedName || "—"}</p>
              {legacyNote ? (
                <p style={{ color: "#64748b", fontSize: 14 }}>Couple checklist / search note: {b.service_description}</p>
              ) : null}
              <p>{b.special_requests || "No special requests."}</p>
              <p>Total charged: {rwf(b.total_price_rwf)}</p>
              <p style={{ fontSize: 14, color: "#0f766e" }}>Your payout: {rwf(b.vendor_payout_rwf)}</p>
              <p style={{ fontSize: 13, color: "#64748b" }}>Platform fee: {rwf(b.platform_fee_rwf)}</p>
              <p style={{ fontSize: 13 }}>
                Status:
                {" "}
                <strong>{b.status}</strong>
                {" "}
                ({b.payment_status})
              </p>
              {b.status === "pending" && (
                <button type="button" className="btn" onClick={() => api(`/api/vendor/complete-booking/${b.id}`, { method: "PUT" }).then(refresh)}>
                  Mark service completed
                </button>
              )}
            </div>
            );
          })}
        </div>
        {!bookings.length && <p>No bookings in this filter yet.</p>}
      </section>
    </Layout>
  );
}

function AdminDashboard() {
  const navigate = useNavigate();
  const [couples, setCouples] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [contactInquiries, setContactInquiries] = useState([]);
  const [msg, setMsg] = useState({ to_user_id: "", message: "" });
  const [lastSyncAt, setLastSyncAt] = useState(null);
  const refresh = () => {
    Promise.all([
      api("/api/admin/couples"),
      api("/api/admin/vendors"),
      api("/api/admin/bookings"),
      api("/api/admin/contact-inquiries").catch(() => []),
    ]).then(([couplesData, vendorsData, bookingsData, contactData]) => {
      setCouples(couplesData);
      setVendors(vendorsData);
      setBookings(bookingsData);
      setContactInquiries(Array.isArray(contactData) ? contactData : []);
      setLastSyncAt(new Date());
    });
  };
  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 10000);
    return () => clearInterval(interval);
  }, []);
  const logout = async () => {
    try {
      await api("/api/auth/logout", { method: "POST" });
    } catch {
      /* still leave */
    }
    navigate("/login", { replace: true });
  };
  return (
    <Layout>
      <section className="panel">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
          <h2 style={{ margin: 0 }}>Admin Dashboard</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <button type="button" className="btn" onClick={refresh}>Refresh data</button>
            <button type="button" className="btn" onClick={logout}>Log out</button>
          </div>
        </div>
        {lastSyncAt ? <p style={{ margin: "0 0 12px", color: "#64748b", fontSize: 13 }}>Last synced: {lastSyncAt.toLocaleTimeString()}</p> : null}
        <h3>Couples</h3>
        <div className="grid">
          {couples.map((c) => (
            <div className="card" key={c.id}>
              <p>{c.full_name}</p>
              <p>{c.user.email}</p>
              <p>{c.wedding_date}</p>
              <p>{c.location}</p>
            </div>
          ))}
          {!couples.length && <p>No couples yet.</p>}
        </div>
        <h3>Vendors</h3>
        <div className="grid">
          {vendors.map((v) => (
            <div className="card" key={v.id}>
              <p>{v.business_name}</p>
              <p>{v.user?.email}</p>
              <p>{v.category}</p>
              <p>{v.approved ? "Approved" : "Pending"}</p>
              <button type="button" onClick={() => api(`/api/admin/vendors/${v.id}/approve`, { method: "PUT", body: JSON.stringify({ approved: true }) }).then(refresh)}>Approve</button>
              <button type="button" onClick={() => api(`/api/admin/vendors/${v.id}/approve`, { method: "PUT", body: JSON.stringify({ approved: false }) }).then(refresh)}>Reject</button>
            </div>
          ))}
        </div>
        <h3>Bookings</h3>
        <div className="grid">
          {bookings.map((b) => (
            <div className="card" key={b.id}>
              <p>{b.couple?.full_name}</p>
              <p>{b.vendor?.business_name}</p>
              <p>{b.service_description}</p>
              <p>{b.payment_status}</p>
              <p>{rwf(b.total_price_rwf)}</p>
            </div>
          ))}
        </div>
        <h3>Contact form messages</h3>
        <p style={{ fontSize: 14, color: "#475569", marginTop: 0 }}>
          Reply by email using <strong>Reply</strong> in Gmail (notifications use the visitor&apos;s address). Mark as read when handled.
        </p>
        {!contactInquiries.length ? (
          <p>No messages yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {contactInquiries.map((q) => (
              <div
                className="card"
                key={q.id}
                style={{
                  opacity: q.is_read ? 0.85 : 1,
                  borderLeft: q.is_read ? undefined : "4px solid #0ea5e9",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                  <p style={{ margin: 0, fontWeight: 700 }}>{q.subject}</p>
                  <span style={{ fontSize: 13, color: "#64748b" }}>
                    {q.created_at ? new Date(q.created_at).toLocaleString() : ""}
                  </span>
                </div>
                <p style={{ margin: "8px 0 0" }}>
                  <strong>{q.name}</strong> &middot;{" "}
                  <a href={`mailto:${q.email}`}>{q.email}</a>
                  {q.phone ? ` · ${q.phone}` : ""}
                  {q.country ? ` · ${q.country}` : ""}
                </p>
                <p style={{ margin: "8px 0 0", whiteSpace: "pre-wrap", fontSize: 14 }}>{q.inquiry_text}</p>
                {!q.is_read ? (
                  <button
                    type="button"
                    className="btn"
                    style={{ marginTop: 12 }}
                    onClick={() =>
                      api(`/api/admin/contact-inquiries/${q.id}`, {
                        method: "PATCH",
                        body: JSON.stringify({ is_read: true }),
                      }).then(refresh)
                    }
                  >
                    Mark as read
                  </button>
                ) : (
                  <p style={{ margin: "8px 0 0", fontSize: 13, color: "#64748b" }}>Read</p>
                )}
              </div>
            ))}
          </div>
        )}
        <h3>Send Message</h3>
        <form className="form compact" onSubmit={(e) => {
          e.preventDefault();
          api("/api/admin/messages", { method: "POST", body: JSON.stringify(msg) }).then(() => alert("Sent"));
        }}
        >
          <input type="number" placeholder="To user id" value={msg.to_user_id} onChange={(e) => setMsg({ ...msg, to_user_id: Number(e.target.value) })} required />
          <input placeholder="Message" value={msg.message} onChange={(e) => setMsg({ ...msg, message: e.target.value })} required />
          <button className="btn" type="submit">Send</button>
        </form>
      </section>
    </Layout>
  );
}

function RequireRole({ role, children }) {
  const [me, setMe] = useState(null);
  useEffect(() => {
    api("/api/auth/me").then((d) => setMe(d.user)).catch(() => setMe(false));
  }, []);
  if (me === null) return <Layout><section className="panel">Loading...</section></Layout>;
  if (me === false) return <Navigate to="/login" replace />;
  if (me.role !== role) return <Navigate to={`/dashboard/${me.role}`} replace />;
  return children;
}

function DashboardRouter() {
  const [me, setMe] = useState(null);
  useEffect(() => { api("/api/auth/me").then((d) => setMe(d.user)).catch(() => setMe(false)); }, []);
  if (me === null) return <Layout><section className="panel">Loading...</section></Layout>;
  if (me === false) return <Navigate to="/login" replace />;
  if (me.role === "couple") return <CoupleDashboard />;
  if (me.role === "vendor") return <VendorDashboard />;
  return <AdminDashboard />;
}

export default function App() {
  return (
    <>
      <nav className="navbar">
        <Link to="/" className="logo-link">
          <img src={logo} alt="Lumina Weddings logo" className="logo-image" />
          <span className="logo-text">Lumina Weddings</span>
        </Link>
        <div className="links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/services" element={<VendorsPage />} />
        <Route path="/services/:category" element={<ServicesCategoryPage />} />
        <Route path="/services/:category/:id" element={<VendorDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/login/admin" element={<LoginPage adminOnly />} />
        <Route path="/register" element={<RegisterHub />} />
        <Route path="/register/couple" element={<RegisterPage fixedRole="couple" />} />
        <Route path="/register/vendor" element={<RegisterPage fixedRole="vendor" />} />
        <Route path="/dashboard/couple" element={<RequireRole role="couple"><CoupleDashboard /></RequireRole>} />
        <Route path="/dashboard/vendor" element={<RequireRole role="vendor"><VendorDashboard /></RequireRole>} />
        <Route path="/dashboard/admin" element={<RequireRole role="admin"><AdminDashboard /></RequireRole>} />
        <Route path="/dashboard" element={<DashboardRouter />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}