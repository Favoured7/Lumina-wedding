const upload = {
  single: (fieldName) => {
    return (req, res, next) => {
      next();
    };
  },
  array: (fieldName) => {
    return (req, res, next) => {
      next();
    };
  }
};

module.exports = upload;