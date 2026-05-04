const jwt = require("jsonwebtoken");
const sessionService = require('../services/sessionService');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }
    
    // Use session service to validate token
    const session = sessionService.validateSession(token);
    
    if (!session.valid) {
      return res.status(401).json({ error: session.message });
    }
    
    req.userId = session.user.id;
    req.userRole = session.user.role;
    req.user = session.user;
    
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token." });
  }
};

// Session check middleware (for requests that may or may not have token)
const checkSession = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      req.userId = null;
      req.userRole = null;
      req.user = null;
      return next();
    }
    
    const session = sessionService.validateSession(token);
    
    if (session.valid) {
      req.userId = session.user.id;
      req.userRole = session.user.role;
      req.user = session.user;
    } else {
      req.userId = null;
      req.userRole = null;
      req.user = null;
    }
    
    next();
  } catch (error) {
    req.userId = null;
    req.userRole = null;
    req.user = null;
    next();
  }
};

const adminOnly = (req, res, next) => {
  if (req.userRole !== "admin") {
    return res.status(403).json({ error: "Admin access required." });
  }
  next();
};

const vendorOnly = (req, res, next) => {
  if (req.userRole !== "vendor") {
    return res.status(403).json({ error: "Vendor access required." });
  }
  next();
};

const coupleOnly = (req, res, next) => {
  if (req.userRole !== "couple") {
    return res.status(403).json({ error: "Couple access required." });
  }
  next();
};

module.exports = {
  authMiddleware,
  checkSession,
  adminOnly,
  vendorOnly,
  coupleOnly,
};