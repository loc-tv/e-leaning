const authMiddleware = (req, res, next) => {
  const isAuthenticated = false; // Giả lập xác thực
  if (isAuthenticated) {
      next(); // Cho phép truy cập
  } else {
      res.status(403).send('Access Denied');
  }
};

module.exports = authMiddleware;
