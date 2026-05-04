const authRoutes = require("./auth");
const userRoutes = require("./users");
const vendorRoutes = require("./vendors");
const serviceRoutes = require("./services");
const bookingRoutes = require("./bookings");
const paymentRoutes = require("./payments");
const reviewRoutes = require("./reviews");
const savedVendorRoutes = require("./saved-vendors");

module.exports = {
  authRoutes,
  userRoutes,
  vendorRoutes,
  serviceRoutes,
  bookingRoutes,
  paymentRoutes,
  reviewRoutes,
  savedVendorRoutes,
};