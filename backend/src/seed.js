require("dotenv").config();
const bcrypt = require("bcryptjs");
const { sequelize, syncDb, User, Couple, Vendor, Booking, Payment } = require("./db");

const vendorSeeds = [
  ["Lensmen Rwanda", "photography", "350000-750000", "Kigali"],
  ["Kigali Serenade", "catering", "15000-35000", "Kigali"],
  ["Kigali Convention Centre", "venue", "500000-2500000", "Kigali"],
  ["DJ Pius", "music", "200000-500000", "Kigali"],
  ["Glam by Grace", "makeup", "70000-150000", "Kigali"],
  ["Lumina Event Planners", "planner", "200000-800000", "Kigali"],
];

async function upsertUser(email, password, role, email_verified) {
  const password_hash = await bcrypt.hash(password, 10);
  const [user] = await User.findOrCreate({
    where: { email },
    defaults: { password_hash, role, email_verified },
  });
  return user;
}

async function seed() {
  await sequelize.authenticate();
  await syncDb();

  await upsertUser("admin@luminaweddings.rw", "Admin123!", "admin", true);

  let firstVendorId = null;
  for (const [business_name, category, priceRange, location] of vendorSeeds) {
    const email = `${business_name.toLowerCase().replace(/\s+/g, ".").replace(/[^a-z.]/g, "")}@luminaweddings.rw`;
    const user = await upsertUser(email, "Vendor123!", "vendor", true);
    const [min, max] = priceRange.split("-").map(Number);
    const [vendor, created] = await Vendor.findOrCreate({
      where: { user_id: user.id },
      defaults: {
        user_id: user.id,
        business_name,
        category,
        description: `${business_name} wedding ${category} services in Rwanda.`,
        price_min: min,
        price_max: max,
        location,
        rating: 4.5,
        approved: true,
      },
    });
    if (!created) {
      await vendor.update({ approved: true });
    }
    if (!firstVendorId) firstVendorId = vendor.id;
  }

  const demoCouples = [
    ["demo.couple1@luminaweddings.rw", "Couple123!", "Jean & Marie", "2026-06-15", "+250788000001", "Kigali"],
    ["demo.couple2@luminaweddings.rw", "Couple123!", "Eric & Grace", "2026-09-20", "+250788000002", "Musanze"],
  ];

  let firstCoupleId = null;
  for (const [email, password, full_name, wedding_date, phone, location] of demoCouples) {
    const user = await upsertUser(email, password, "couple", true);
    const [couple] = await Couple.findOrCreate({
      where: { user_id: user.id },
      defaults: { user_id: user.id, full_name, wedding_date, phone, location },
    });
    if (!firstCoupleId) firstCoupleId = couple.id;
  }

  if (firstVendorId && firstCoupleId) {
    const existing = await Booking.findOne({ where: { couple_id: firstCoupleId, vendor_id: firstVendorId } });
    if (!existing) {
      const total = 750000;
      const platform = Math.round(total * 0.2);
      const booking = await Booking.create({
        couple_id: firstCoupleId,
        vendor_id: firstVendorId,
        checklist_item_id: null,
        service_description: "Wedding photography package",
        wedding_date: "2026-06-15",
        special_requests: "Outdoor ceremony",
        total_price_rwf: total,
        platform_fee_rwf: platform,
        vendor_payout_rwf: total - platform,
        status: "completed",
        payment_status: "paid",
        paid_at: new Date(),
      });
      await Payment.create({
        booking_id: booking.id,
        amount_rwf: booking.total_price_rwf,
        payment_method: "visa_demo",
        transaction_id: `seed_txn_${booking.id}`,
        card_brand: "visa",
        card_last4: "4242",
      });
    }
  }

  console.log(
    "Seed complete. Admin + demo couples + approved vendors + sample booking (if missing). Demo login: demo.couple1@luminaweddings.rw / Couple123!"
  );
   process.exit(0);
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
