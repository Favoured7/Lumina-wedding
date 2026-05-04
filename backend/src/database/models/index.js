const sequelize = require('../../config/database'); // Note: path may vary
const UserModel = require('./user');
const VendorModel = require('./vendors');
const BookingModel = require('./bookings');
const PaymentModel = require('./payment');
const SavedVendorModel = require('./savedvendors');
const ServiceModel = require('./services');
const SessionModel = require('./sessions');
const VendorReviewModel = require('./vendorReviews');

const User = UserModel(sequelize);
const Vendor = VendorModel(sequelize);
const Booking = BookingModel(sequelize);
const Payment = PaymentModel(sequelize);
const SavedVendor = SavedVendorModel(sequelize);
const Service = ServiceModel(sequelize);
const Session = SessionModel(sequelize);
const VendorReview = VendorReviewModel(sequelize);

// Set up associations if needed
User.hasMany(Booking, { foreignKey: 'userId' });
Booking.belongsTo(User, { foreignKey: 'userId' });

Vendor.hasMany(Booking, { foreignKey: 'vendorId' });
Booking.belongsTo(Vendor, { foreignKey: 'vendorId' });

Booking.hasMany(Payment, { foreignKey: 'bookingId' });
Payment.belongsTo(Booking, { foreignKey: 'bookingId' });

User.hasMany(Payment, { foreignKey: 'userId' });
Payment.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(SavedVendor, { foreignKey: 'userId' });
SavedVendor.belongsTo(User, { foreignKey: 'userId' });

Vendor.hasMany(SavedVendor, { foreignKey: 'vendorId' });
SavedVendor.belongsTo(Vendor, { foreignKey: 'vendorId' });

Vendor.hasMany(Service, { foreignKey: 'vendorId' });
Service.belongsTo(Vendor, { foreignKey: 'vendorId' });

User.hasMany(VendorReview, { foreignKey: 'userId' });
VendorReview.belongsTo(User, { foreignKey: 'userId' });

Vendor.hasMany(VendorReview, { foreignKey: 'vendorId' });
VendorReview.belongsTo(Vendor, { foreignKey: 'vendorId' });

module.exports = {
  sequelize, // Export the sequelize instance
  User,
  Vendor,
  Booking,
  Payment,
  SavedVendor,
  Service,
  Session,
  VendorReview
};