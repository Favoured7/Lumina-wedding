const validateRegistration = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = [];

  if (!name || name.length < 2) {
    errors.push("Name must be at least 2 characters");
  }

  if (!email || !email.includes("@") || !email.includes(".")) {
    errors.push("Valid email is required");
  }

  if (!password || password.length < 6) {
    errors.push("Password must be at least 6 characters");
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  next();
};

const validateBooking = (req, res, next) => {
  const { vendorId, eventDate, totalAmount } = req.body;
  const errors = [];

  if (!vendorId) {
    errors.push("Vendor ID is required");
  }

  if (!eventDate) {
    errors.push("Event date is required");
  }

  if (!totalAmount || totalAmount <= 0) {
    errors.push("Valid total amount is required");
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

const validateVendor = (req, res, next) => {
  const { businessName, vendorType, priceRange } = req.body;
  const errors = [];

  if (!businessName) {
    errors.push("Business name is required");
  }

  if (!vendorType) {
    errors.push("Vendor type is required");
  }

  if (!priceRange) {
    errors.push("Price range is required");
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

const validateReview = (req, res, next) => {
  const { rating, comment } = req.body;
  const errors = [];

  if (!rating || rating < 1 || rating > 5) {
    errors.push("Rating must be between 1 and 5");
  }

  if (!comment || comment.length < 10) {
    errors.push("Comment must be at least 10 characters");
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateBooking,
  validateVendor,
  validateReview,
};