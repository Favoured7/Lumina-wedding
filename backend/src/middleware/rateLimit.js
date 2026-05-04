const rateLimit = {
  limiter: (req, res, next) => {
    next();
  },
  loginLimiter: (req, res, next) => {
    next();
  }
};

module.exports = rateLimit;