require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  sequelize,
  syncDb,
  Op,
  User,
  Couple,
  Vendor,
  ChecklistItem,
  Booking,
  Payment,
  Message,
  ContactInquiry,
} = require("./db");
const { sendContactInquiryEmail } = require("./contactNotify");

const app = express();
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";
const JWT_SECRET = process.env.JWT_SECRET || "change-me-now";
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const PLATFORM_FEE_PERCENT = Math.min(1, Math.max(0, Number(process.env.LUMINA_PLATFORM_FEE_PERCENT ?? 0.2)));
/** Matches public /services pages (stored Vendor.category). */
const VENDOR_SERVICE_CATEGORIES = new Set(["makeup", "photography", "catering", "venue", "music", "planner"]);
const allowedOrigins = CLIENT_ORIGIN.split(",").map((item) => item.trim()).filter(Boolean);
const localhostRegex = /^https?:\/\/localhost:\d+$/;

function computePaymentSplit(totalRwF) {
  const n = Number(totalRwF);
  const platform_fee_rwf = Math.round(n * PLATFORM_FEE_PERCENT);
  const vendor_payout_rwf = n - platform_fee_rwf;
  return { platform_fee_rwf, vendor_payout_rwf };
}

function cardDigits(raw) {
  return String(raw || "").replace(/\D/g, "");
}

function detectCardBrand(digits) {
  if (!digits || digits.length < 13) return "unknown";
  if (digits.startsWith("4")) return "visa";
  if (/^5[1-5]/.test(digits) || /^2[2-7]/.test(digits)) return "mastercard";
  if (/^3[47]/.test(digits)) return "amex";
  return "card";
}

function parsePriceRange(raw) {
  const text = String(raw || "").trim();
  if (!text) return [0, 0];
  const parts = text.split("-").map((v) => Number(v.trim()));
  if (parts.length === 1 && Number.isFinite(parts[0])) return [parts[0], parts[0]];
  const min = parts[0];
  const max = parts[1];
  if (!Number.isFinite(min) || !Number.isFinite(max)) return null;
  return [Math.min(min, max), Math.max(min, max)];
}

const PAYMENT_CARD_METHODS = ["visa", "mastercard", "amex"];
const PAYMENT_MOMO_METHODS = ["mtn_momo", "airtel_money"];

function ensureBookingSplit(b) {
  const row = typeof b.toJSON === "function" ? b.toJSON() : { ...b };
  if (row.platform_fee_rwf == null && row.total_price_rwf != null) {
    const s = computePaymentSplit(row.total_price_rwf);
    row.platform_fee_rwf = s.platform_fee_rwf;
    row.vendor_payout_rwf = s.vendor_payout_rwf;
  }
  return row;
}

app.use(
  cors({
    credentials: true,
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      if (localhostRegex.test(origin)) return callback(null, true);
      return callback(new Error("CORS origin not allowed"));
    },
  })
);
app.use(express.json());

function formatUser(user) {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    email_verified: user.email_verified,
  };
}

async function ensureCoupleProfile(userId) {
  let couple = await Couple.findOne({ where: { user_id: userId } });
  if (couple) return couple;
  const user = await User.findByPk(userId);
  if (!user || user.role !== "couple") return null;
  const baseName = String(user.email || "Lumina Couple").split("@")[0].replace(/[._-]+/g, " ").trim();
  const full_name = baseName ? baseName.replace(/\b\w/g, (m) => m.toUpperCase()) : "Lumina Couple";
  const future = new Date();
  future.setMonth(future.getMonth() + 6);
  const wedding_date = future.toISOString().slice(0, 10);
  couple = await Couple.create({
    user_id: userId,
    full_name,
    wedding_date,
    phone: "N/A",
    location: "Kigali",
  });
  return couple;
}

function authRequired(req, res, next) {
  const token = req.cookies?.token || req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    return next();
  };
}

app.use((req, res, next) => {
  const cookieHeader = req.headers.cookie || "";
  req.cookies = Object.fromEntries(
    cookieHeader
      .split(";")
      .map((segment) => segment.trim())
      .filter(Boolean)
      .map((segment) => {
        const [k, ...v] = segment.split("=");
        return [k, decodeURIComponent(v.join("="))];
      })
  );
  next();
});

function setAuthCookie(res, payload) {
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

app.use((req, res, next) => {
  res.cookie = (name, value, options = {}) => {
    const attrs = [
      `${name}=${encodeURIComponent(value)}`,
      `Path=${options.path || "/"}`,
      options.httpOnly ? "HttpOnly" : "",
      options.sameSite ? `SameSite=${options.sameSite}` : "",
      options.secure ? "Secure" : "",
      options.maxAge ? `Max-Age=${Math.floor(options.maxAge / 1000)}` : "",
    ].filter(Boolean);
    res.append("Set-Cookie", attrs.join("; "));
  };
  next();
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "lumina-weddings-api" });
});

app.post("/api/auth/register", async (req, res, next) => {
  try {
    const { role, email, password } = req.body;
    if (!["couple", "vendor"].includes(role)) {
      return res.status(400).json({ message: "Role must be couple or vendor" });
    }

    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(400).json({ message: "Email already exists" });

    const password_hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password_hash,
      role,
      email_verified: role === "couple",
    });

    if (role === "couple") {
      const { full_name, wedding_date, phone, location } = req.body;
      await Couple.create({ user_id: user.id, full_name, wedding_date, phone, location });
    } else {
      const {
        business_name,
        category,
        description,
        price_range,
        location,
        payout_bank_name,
        payout_account_number,
        payout_account_holder,
      } = req.body;
      const parsedRange = parsePriceRange(price_range);
      if (!parsedRange) {
        return res.status(400).json({ message: "Invalid price range. Use '100000-200000' or a single number." });
      }
      const cat = String(category || "").trim();
      if (!VENDOR_SERVICE_CATEGORIES.has(cat)) {
        return res.status(400).json({
          message: "Invalid service category. Choose one of: makeup, photography, catering, venue, music, planner.",
        });
      }
      const [min, max] = parsedRange;
      await Vendor.create({
        user_id: user.id,
        business_name,
        category: cat,
        description,
        price_min: min,
        price_max: max,
        location,
        approved: false,
        payout_bank_name: payout_bank_name || null,
        payout_account_number: payout_account_number || null,
        payout_account_holder: payout_account_holder || null,
      });
    }
    return res.status(201).json({ message: "Registration successful", user: formatUser(user) });
  } catch (error) {
    return next(error);
  }
});

app.post("/api/auth/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    setAuthCookie(res, { id: user.id, role: user.role });
    return res.json({ user: formatUser(user) });
  } catch (error) {
    return next(error);
  }
});

app.get("/api/auth/me", authRequired, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ user: formatUser(user) });
  } catch (error) {
    return next(error);
  }
});

app.post("/api/auth/logout", (_req, res) => {
  res.append("Set-Cookie", "token=; Path=/; HttpOnly; SameSite=lax; Max-Age=0");
  return res.json({ message: "Logged out" });
});

app.get("/api/platform-settings", (_req, res) => {
  return res.json({
    platform_fee_percent: PLATFORM_FEE_PERCENT,
    vendor_payout_percent: 1 - PLATFORM_FEE_PERCENT,
  });
});

app.post("/api/contact", async (req, res, next) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const phone = String(req.body.phone || "").trim() || null;
    const country = String(req.body.country || "").trim() || null;
    const subject = String(req.body.subject || "").trim();
    const inquiry_text = String(req.body.message || req.body.inquiry_text || "").trim();
    if (!name || !email || !subject || !inquiry_text) {
      return res.status(400).json({ message: "Name, email, subject, and message are required." });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Valid email is required." });
    }
    const row = await ContactInquiry.create({
      name,
      email,
      phone,
      country,
      subject,
      inquiry_text,
    });
    sendContactInquiryEmail({ name, email, phone, country, subject, inquiry_text }).catch((err) =>
      console.error("[contact] notify email failed:", err.message)
    );
    return res.status(201).json({ ok: true, id: row.id });
  } catch (error) {
    return next(error);
  }
});

app.get("/api/stats", async (_req, res, next) => {
  try {
    const happy_couples = await Couple.count();
    const trusted_vendors = await Vendor.count({ where: { approved: true } });
    const successful_events = await Booking.count({
      where: { [Op.or]: [{ status: "completed" }, { payment_status: "paid" }] },
    });
    const paidBookings = await Booking.findAll({
      where: { payment_status: "paid" },
      include: [{ model: Couple, attributes: ["location"] }],
    });
    const citySet = new Set();
    paidBookings.forEach((b) => {
      if (b.couple?.location) citySet.add(String(b.couple.location).trim());
    });
    const approvedVendors = await Vendor.findAll({ where: { approved: true }, attributes: ["location"] });
    approvedVendors.forEach((v) => {
      if (v.location) citySet.add(String(v.location).trim());
    });
    const cities_served = citySet.size;
    return res.json({ happy_couples, trusted_vendors, successful_events, cities_served });
  } catch (error) {
    return next(error);
  }
});

app.get("/api/vendors", async (req, res, next) => {
  try {
    const where = { approved: true };
    if (req.query.category) where.category = req.query.category;
    const vendors = await Vendor.findAll({ where, order: [["business_name", "ASC"]] });
    const weddingDate = String(req.query.wedding_date || "").trim();
    if (!weddingDate) return res.json(vendors);

    const bookingsOnDate = await Booking.findAll({
      where: { wedding_date: weddingDate },
      attributes: ["vendor_id"],
    });
    const unavailable = new Set(bookingsOnDate.map((b) => b.vendor_id));
    const enriched = vendors.map((vendor) => {
      const row = vendor.toJSON();
      const isAvailable = !unavailable.has(vendor.id);
      return {
        ...row,
        available: isAvailable,
        unavailable_reason: isAvailable ? null : `Already booked on ${weddingDate}`,
      };
    });
    return res.json(enriched);
  } catch (error) {
    return next(error);
  }
});

app.get("/api/vendors/:id", async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ where: { id: req.params.id, approved: true } });
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });
    return res.json(vendor);
  } catch (error) {
    return next(error);
  }
});

app.post("/api/checklist", authRequired, requireRole("couple"), async (req, res, next) => {
  try {
    const couple = await ensureCoupleProfile(req.user.id);
    if (!couple) return res.status(404).json({ message: "Couple profile not found. Please complete registration again." });
    if (!String(req.body.item_name || "").trim()) {
      return res.status(400).json({ message: "Checklist item name is required." });
    }
    if (!String(req.body.category || "").trim()) {
      return res.status(400).json({ message: "Checklist category is required." });
    }
    const checklistCat = String(req.body.category).trim();
    if (!VENDOR_SERVICE_CATEGORIES.has(checklistCat)) {
      return res.status(400).json({
        message: "Invalid checklist category. Use a service from our site: makeup, photography, catering, venue, music, planner.",
      });
    }
    const item = await ChecklistItem.create({
      couple_id: couple.id,
      item_name: String(req.body.item_name).trim(),
      category: checklistCat,
    });
    return res.status(201).json(item);
  } catch (error) {
    return next(error);
  }
});

app.get("/api/checklist", authRequired, requireRole("couple"), async (req, res, next) => {
  try {
    const couple = await ensureCoupleProfile(req.user.id);
    if (!couple) return res.status(404).json({ message: "Couple profile not found. Please complete registration again." });
    const items = await ChecklistItem.findAll({ where: { couple_id: couple.id }, order: [["created_at", "DESC"]] });
    return res.json(items);
  } catch (error) {
    return next(error);
  }
});

app.put("/api/checklist/:id", authRequired, requireRole("couple"), async (req, res, next) => {
  try {
    const couple = await ensureCoupleProfile(req.user.id);
    if (!couple) return res.status(404).json({ message: "Couple profile not found. Please complete registration again." });
    const item = await ChecklistItem.findOne({ where: { id: req.params.id, couple_id: couple.id } });
    if (!item) return res.status(404).json({ message: "Item not found" });
    if (req.body.category != null) {
      const checklistCat = String(req.body.category).trim();
      if (!VENDOR_SERVICE_CATEGORIES.has(checklistCat)) {
        return res.status(400).json({
          message: "Invalid checklist category. Use: makeup, photography, catering, venue, music, planner.",
        });
      }
    }
    await item.update(req.body);
    return res.json(item);
  } catch (error) {
    return next(error);
  }
});

app.delete("/api/checklist/:id", authRequired, requireRole("couple"), async (req, res, next) => {
  try {
    const couple = await ensureCoupleProfile(req.user.id);
    if (!couple) return res.status(404).json({ message: "Couple profile not found. Please complete registration again." });
    await ChecklistItem.destroy({ where: { id: req.params.id, couple_id: couple.id } });
    return res.json({ message: "Deleted" });
  } catch (error) {
    return next(error);
  }
});

app.post("/api/bookings", authRequired, requireRole("couple"), async (req, res, next) => {
  try {
    const couple = await ensureCoupleProfile(req.user.id);
    if (!couple) return res.status(404).json({ message: "Couple profile not found. Please complete registration again." });
    const vendor = await Vendor.findOne({ where: { id: req.body.vendor_id, approved: true } });
    if (!vendor) {
      return res.status(404).json({ message: "Selected vendor was not found or is not approved." });
    }
    const weddingDate = req.body.wedding_date || couple.wedding_date;
    const existing = await Booking.findOne({
      where: {
        vendor_id: vendor.id,
        wedding_date: weddingDate,
      },
    });
    if (existing) {
      return res.status(409).json({ message: "This vendor is already booked on that date. Please choose another vendor/date." });
    }
    const booking = await Booking.create({
      couple_id: couple.id,
      vendor_id: vendor.id,
      checklist_item_id: req.body.checklist_item_id || null,
      service_description: vendor.business_name,
      wedding_date: weddingDate,
      special_requests: req.body.special_requests || "",
      total_price_rwf: req.body.total_price_rwf,
    });
    return res.status(201).json(booking);
  } catch (error) {
    return next(error);
  }
});

app.put("/api/bookings/:id/pay", authRequired, requireRole("couple"), async (req, res, next) => {
  try {
    const { payment_method, card_number, momo_phone } = req.body;
    const method = String(payment_method || "").toLowerCase();
    if (
      ![...PAYMENT_CARD_METHODS, ...PAYMENT_MOMO_METHODS].includes(method)
    ) {
      return res.status(400).json({ message: "Invalid payment method" });
    }

    const couple = await ensureCoupleProfile(req.user.id);
    const booking = await Booking.findOne({ where: { id: req.params.id, couple_id: couple.id } });
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.payment_status === "paid") {
      return res.status(400).json({ message: "Already paid" });
    }

    let card_brand = null;
    let card_last4 = null;
    let payment_label = method;

    if (PAYMENT_CARD_METHODS.includes(method)) {
      const digits = cardDigits(card_number);
      if (digits.length < 13) {
        return res.status(400).json({ message: "Enter a valid card number" });
      }
      card_brand = detectCardBrand(digits);
      card_last4 = digits.slice(-4);
      payment_label = `${card_brand}_${method}`;
    } else {
      const phoneDigits = cardDigits(momo_phone || req.body.phone);
      if (phoneDigits.length < 9) {
        return res.status(400).json({ message: "Enter a valid mobile money number" });
      }
      card_last4 = phoneDigits.slice(-4);
      payment_label = method;
    }

    const split = computePaymentSplit(booking.total_price_rwf);

    await booking.update({
      payment_status: "paid",
      paid_at: new Date(),
      platform_fee_rwf: split.platform_fee_rwf,
      vendor_payout_rwf: split.vendor_payout_rwf,
    });

    await Payment.create({
      booking_id: booking.id,
      amount_rwf: booking.total_price_rwf,
      payment_method: payment_label,
      transaction_id: `txn_${Date.now()}_${booking.id}_${Math.random().toString(36).slice(2, 8)}`,
      card_brand,
      card_last4,
    });

    if (booking.checklist_item_id) {
      await ChecklistItem.update(
        { is_completed: true, vendor_id: booking.vendor_id },
        { where: { id: booking.checklist_item_id, couple_id: couple.id } }
      );
    }

    const updated = await Booking.findByPk(booking.id, { include: [{ model: Vendor }] });
    return res.json({
      message: "Payment successful",
      booking: updated,
      split: {
        total_rwf: booking.total_price_rwf,
        lumina_platform_fee_rwf: split.platform_fee_rwf,
        vendor_receives_rwf: split.vendor_payout_rwf,
        platform_fee_percent: PLATFORM_FEE_PERCENT,
      },
    });
  } catch (error) {
    return next(error);
  }
});

app.get("/api/couple/bookings", authRequired, requireRole("couple"), async (req, res, next) => {
  try {
    const couple = await ensureCoupleProfile(req.user.id);
    if (!couple) return res.status(404).json({ message: "Couple profile not found. Please complete registration again." });
    const bookings = await Booking.findAll({
      where: { couple_id: couple.id },
      include: [{ model: Vendor }],
      order: [["created_at", "DESC"]],
    });
    return res.json(bookings.map((b) => ensureBookingSplit(b)));
  } catch (error) {
    return next(error);
  }
});

app.get("/api/couple/profile", authRequired, requireRole("couple"), async (req, res, next) => {
  try {
    const couple = await ensureCoupleProfile(req.user.id);
    if (!couple) return res.status(404).json({ message: "Couple profile not found. Please complete registration again." });
    return res.json(couple);
  } catch (error) {
    return next(error);
  }
});

app.get("/api/vendor/paid-couples", authRequired, requireRole("vendor"), async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ where: { user_id: req.user.id } });
    const where = { vendor_id: vendor.id, payment_status: "paid" };
    if (req.query.status === "active") where.status = "pending";
    else if (req.query.status === "completed") where.status = "completed";

    const bookings = await Booking.findAll({
      where,
      include: [{ model: Couple, include: [{ model: User, attributes: ["email"] }] }],
      order: [["paid_at", "DESC"]],
    });
    return res.json(bookings.map((book) => ensureBookingSplit(book)));
  } catch (error) {
    return next(error);
  }
});

app.get("/api/vendor/profile", authRequired, requireRole("vendor"), async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ where: { user_id: req.user.id } });
    if (!vendor) return res.status(404).json({ message: "Vendor profile not found" });
    const paid = await Booking.findAll({
      where: { vendor_id: vendor.id, payment_status: "paid" },
    });
    let totalGross = 0;
    let totalToVendor = 0;
    let totalPlatform = 0;
    paid.forEach((b) => {
      const row = ensureBookingSplit(b);
      totalGross += row.total_price_rwf;
      totalToVendor += row.vendor_payout_rwf;
      totalPlatform += row.platform_fee_rwf;
    });
    return res.json({
      vendor,
      stats: {
        paid_bookings: paid.length,
        total_charged_rwf: totalGross,
        your_earnings_rwf: totalToVendor,
        lumina_fees_rwf: totalPlatform,
        platform_fee_percent: PLATFORM_FEE_PERCENT,
      },
    });
  } catch (error) {
    return next(error);
  }
});

app.put("/api/vendor/payout-account", authRequired, requireRole("vendor"), async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ where: { user_id: req.user.id } });
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });
    const { payout_bank_name, payout_account_number, payout_account_holder } = req.body;
    await vendor.update({
      payout_bank_name: payout_bank_name ?? vendor.payout_bank_name,
      payout_account_number: payout_account_number ?? vendor.payout_account_number,
      payout_account_holder: payout_account_holder ?? vendor.payout_account_holder,
    });
    return res.json(vendor);
  } catch (error) {
    return next(error);
  }
});

app.put("/api/vendor/complete-booking/:id", authRequired, requireRole("vendor"), async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ where: { user_id: req.user.id } });
    const booking = await Booking.findOne({ where: { id: req.params.id, vendor_id: vendor.id, payment_status: "paid" } });
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    await booking.update({ status: "completed" });
    return res.json(booking);
  } catch (error) {
    return next(error);
  }
});

app.get("/api/admin/couples", authRequired, requireRole("admin"), async (_req, res, next) => {
  try {
    const couples = await Couple.findAll({ include: [{ model: User, attributes: ["email"] }] });
    return res.json(couples);
  } catch (error) {
    return next(error);
  }
});

app.get("/api/admin/vendors", authRequired, requireRole("admin"), async (_req, res, next) => {
  try {
    const vendors = await Vendor.findAll({ include: [{ model: User, attributes: ["email"] }] });
    return res.json(vendors);
  } catch (error) {
    return next(error);
  }
});

app.put("/api/admin/vendors/:id/approve", authRequired, requireRole("admin"), async (req, res, next) => {
  try {
    const vendor = await Vendor.findByPk(req.params.id);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });
    await vendor.update({ approved: req.body.approved !== false });
    return res.json(vendor);
  } catch (error) {
    return next(error);
  }
});

app.post("/api/admin/vendors", authRequired, requireRole("admin"), async (req, res, next) => {
  try {
    const vendor = await Vendor.create(req.body);
    return res.status(201).json(vendor);
  } catch (error) {
    return next(error);
  }
});

app.put("/api/admin/vendors/:id", authRequired, requireRole("admin"), async (req, res, next) => {
  try {
    const vendor = await Vendor.findByPk(req.params.id);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });
    await vendor.update(req.body);
    return res.json(vendor);
  } catch (error) {
    return next(error);
  }
});

app.delete("/api/admin/vendors/:id", authRequired, requireRole("admin"), async (req, res, next) => {
  try {
    await Vendor.destroy({ where: { id: req.params.id } });
    return res.json({ message: "Vendor deleted" });
  } catch (error) {
    return next(error);
  }
});

app.get("/api/admin/bookings", authRequired, requireRole("admin"), async (_req, res, next) => {
  try {
    const bookings = await Booking.findAll({
      include: [{ model: Couple }, { model: Vendor }],
      order: [["created_at", "DESC"]],
    });
    return res.json(bookings);
  } catch (error) {
    return next(error);
  }
});

app.post("/api/admin/messages", authRequired, requireRole("admin"), async (req, res, next) => {
  try {
    const msg = await Message.create({
      from_user_id: req.user.id,
      to_user_id: req.body.to_user_id,
      message: req.body.message,
    });
    return res.status(201).json(msg);
  } catch (error) {
    return next(error);
  }
});

app.get("/api/admin/contact-inquiries", authRequired, requireRole("admin"), async (_req, res, next) => {
  try {
    const rows = await ContactInquiry.findAll({ order: [["created_at", "DESC"]] });
    return res.json(rows);
  } catch (error) {
    return next(error);
  }
});

app.patch("/api/admin/contact-inquiries/:id", authRequired, requireRole("admin"), async (req, res, next) => {
  try {
    const row = await ContactInquiry.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: "Not found" });
    if (typeof req.body.is_read === "boolean") {
      await row.update({ is_read: req.body.is_read });
    }
    return res.json(row);
  } catch (error) {
    return next(error);
  }
});

const frontendDist = path.join(__dirname, "../../frontend/dist");
if (process.env.NODE_ENV === "production") {
  app.use(express.static(frontendDist, { index: false }));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) {
      return res.status(404).json({ message: "Not found" });
    }
    res.sendFile(path.join(frontendDist, "index.html"), (err) => {
      if (err) next(err);
    });
  });
}

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

async function start() {
  await sequelize.authenticate();
  await syncDb();
  if (process.env.NODE_ENV === "production" && JWT_SECRET === "change-me-now") {
    console.warn("[warn] Set JWT_SECRET in production (.env).");
  }
  app.listen(PORT, HOST, () => {
    console.log(`Lumina listening on http://${HOST}:${PORT} (NODE_ENV=${process.env.NODE_ENV || "development"})`);
  });
}

start().catch((error) => {
  console.error("Server failed:", error);
  process.exit(1);
});