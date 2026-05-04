const IMG_KIGALI_CONVENTION_CENTRE =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Kigali_Convention_center%2C_Rwanda.jpg/960px-Kigali_Convention_center%2C_Rwanda.jpg";

function normalizeVendorName(name) {
  if (!name) return "";
  return String(name)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const KNOWN_VENDOR_IMAGES = {
  "lensmen rwanda":
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
  "kigali serenade":
    "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80",
  "kigali convention centre": IMG_KIGALI_CONVENTION_CENTRE,
  "kigali convention center": IMG_KIGALI_CONVENTION_CENTRE,
  "dj pius":
    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=80",
  "glam by grace":
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=80",
  "lumina event planners":
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
  // Static demo names (ServicesPage fallbacks) — category-appropriate stock
  "umucyo photography":
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
  "elite photos":
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80",
  "africana catering":
    "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80",
  "tasty catering":
    "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1200&q=80",
  "kigali heights venue":
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80",
  "grand palace":
    "https://images.unsplash.com/photo-1464366400600-7168b5af6536?auto=format&fit=crop&w=1200&q=80",
  "kigali entertainment":
    "https://images.unsplash.com/photo-1501612780327-45045538702b?auto=format&fit=crop&w=1200&q=80",
  "melody strings":
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80",
  "elegant weddings":
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
  "perfect day planners":
    "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80",
  "glow by clarisse":
    "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1200&q=80",
  "beauty by lisa":
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
  "elegant faces":
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=80",
};

function knownImageForName(businessName) {
  const key = normalizeVendorName(businessName);
  if (!key) return null;
  if (KNOWN_VENDOR_IMAGES[key]) return KNOWN_VENDOR_IMAGES[key];
  if (key.includes("kigali convention")) return IMG_KIGALI_CONVENTION_CENTRE;
  return null;
}

function hashToIndex(seed, length) {
  const s = String(seed);
  let h = 2166136261;
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h) % length;
}

const CATEGORY_STOCK = {
  photography: [
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=1200&q=80",
  ],
  venue: [
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1464366400600-7168b5af6536?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1520854221050-0f4c88645c8f?auto=format&fit=crop&w=1200&q=80",
  ],
  catering: [
    "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
  ],
  music: [
    "https://images.unsplash.com/photo-1501612780327-45045538702b?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80",
  ],
  makeup: [
    "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1200&q=80",
  ],
  planner: [
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1523438885200-e635d2d84e04?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1522673606160-b79d64620990?auto=format&fit=crop&w=1200&q=80",
  ],
};

export const SERVICE_SLUG_TO_DB_CATEGORY = {
  makeup: "makeup",
  photography: "photography",
  catering: "catering",
  venues: "venue",
  musician: "music",
  planner: "planner",
};

export function pickCategoryStockImage(dbCategory, id) {
  const cat = String(dbCategory || "").trim();
  const pool = CATEGORY_STOCK[cat] || CATEGORY_STOCK.photography;
  return pool[hashToIndex(`${cat}:${id}`, pool.length)];
}

export function resolveVendorImage({ businessName, dbCategory, id }) {
  const fromKnown = knownImageForName(businessName);
  if (fromKnown) return fromKnown;
  return pickCategoryStockImage(dbCategory, id ?? 0);
}

export function pickVendorStockImage(seed) {
  return pickCategoryStockImage("photography", seed);
}
