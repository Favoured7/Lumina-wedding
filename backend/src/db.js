const { Sequelize, DataTypes, Op } = require("sequelize");

const databaseUrl = process.env.DATABASE_URL || "sqlite:./lumina.sqlite";
const sequelize = new Sequelize(databaseUrl, {
  logging: false,
});

const User = sequelize.define(
  "users",
  {
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password_hash: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM("couple", "vendor", "admin"), allowNull: false },
    email_verified: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  },
  { underscored: true }
);

const Couple = sequelize.define(
  "couples",
  {
    user_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
    full_name: { type: DataTypes.STRING, allowNull: false },
    wedding_date: { type: DataTypes.DATEONLY, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    location: { type: DataTypes.ENUM("Kigali", "Musanze", "Nyagatare"), allowNull: false },
  },
  { underscored: true, timestamps: false }
);

const Vendor = sequelize.define(
  "vendors",
  {
    user_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
    business_name: { type: DataTypes.STRING, allowNull: false },
    category: {
      type: DataTypes.ENUM(
        "photography",
        "catering",
        "venue",
        "florist",
        "music",
        "cake",
        "makeup",
        "gown",
        "transport",
        "mc",
        "planner"
      ),
      allowNull: false,
    },
    description: { type: DataTypes.TEXT, allowNull: false },
    price_min: { type: DataTypes.INTEGER, allowNull: false },
    price_max: { type: DataTypes.INTEGER, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: false },
    rating: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 4.5 },
    approved: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    payout_bank_name: { type: DataTypes.STRING, allowNull: true },
    payout_account_number: { type: DataTypes.STRING, allowNull: true },
    payout_account_holder: { type: DataTypes.STRING, allowNull: true },
  },
  { underscored: true, timestamps: false }
);

const ChecklistItem = sequelize.define(
  "checklist_items",
  {
    couple_id: { type: DataTypes.INTEGER, allowNull: false },
    item_name: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    is_completed: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    vendor_id: { type: DataTypes.INTEGER, allowNull: true },
  },
  { underscored: true }
);

const Booking = sequelize.define(
  "bookings",
  {
    couple_id: { type: DataTypes.INTEGER, allowNull: false },
    vendor_id: { type: DataTypes.INTEGER, allowNull: false },
    checklist_item_id: { type: DataTypes.INTEGER, allowNull: true },
    service_description: { type: DataTypes.STRING, allowNull: false },
    wedding_date: { type: DataTypes.DATEONLY, allowNull: false },
    special_requests: { type: DataTypes.TEXT, allowNull: true },
    total_price_rwf: { type: DataTypes.INTEGER, allowNull: false },
    platform_fee_rwf: { type: DataTypes.INTEGER, allowNull: true },
    vendor_payout_rwf: { type: DataTypes.INTEGER, allowNull: true },
    status: { type: DataTypes.ENUM("pending", "completed"), allowNull: false, defaultValue: "pending" },
    payment_status: { type: DataTypes.ENUM("unpaid", "paid"), allowNull: false, defaultValue: "unpaid" },
    paid_at: { type: DataTypes.DATE, allowNull: true },
  },
  { underscored: true, createdAt: "created_at", updatedAt: false }
);

const Payment = sequelize.define(
  "payments",
  {
    booking_id: { type: DataTypes.INTEGER, allowNull: false },
    amount_rwf: { type: DataTypes.INTEGER, allowNull: false },
    payment_method: { type: DataTypes.STRING, allowNull: false },
    transaction_id: { type: DataTypes.STRING, allowNull: false, unique: true },
    card_brand: { type: DataTypes.STRING, allowNull: true },
    card_last4: { type: DataTypes.STRING, allowNull: true },
  },
  { underscored: true, createdAt: "created_at", updatedAt: false }
);

const Message = sequelize.define(
  "messages",
  {
    from_user_id: { type: DataTypes.INTEGER, allowNull: false },
    to_user_id: { type: DataTypes.INTEGER, allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    is_read: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  },
  { underscored: true, createdAt: "created_at", updatedAt: false }
);

const ContactInquiry = sequelize.define(
  "contact_inquiries",
  {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: true },
    country: { type: DataTypes.STRING, allowNull: true },
    subject: { type: DataTypes.STRING, allowNull: false },
    inquiry_text: { type: DataTypes.TEXT, allowNull: false },
    is_read: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  },
  { underscored: true, createdAt: "created_at", updatedAt: "updated_at" }
);

User.hasOne(Couple, { foreignKey: "user_id" });
Couple.belongsTo(User, { foreignKey: "user_id" });
User.hasOne(Vendor, { foreignKey: "user_id" });
Vendor.belongsTo(User, { foreignKey: "user_id" });
Couple.hasMany(ChecklistItem, { foreignKey: "couple_id" });
ChecklistItem.belongsTo(Couple, { foreignKey: "couple_id" });
Couple.hasMany(Booking, { foreignKey: "couple_id" });
Booking.belongsTo(Couple, { foreignKey: "couple_id" });
Vendor.hasMany(Booking, { foreignKey: "vendor_id" });
Booking.belongsTo(Vendor, { foreignKey: "vendor_id" });
Booking.hasMany(Payment, { foreignKey: "booking_id" });
Payment.belongsTo(Booking, { foreignKey: "booking_id" });

async function syncDb() {
  try {
    await sequelize.sync({ alter: true });
  } catch {
    await sequelize.sync();
  }
}

module.exports = {
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
};
