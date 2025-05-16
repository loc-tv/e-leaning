const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.redirect('/login');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(decoded.id);
    
    if (!user) {
      return res.redirect('/login');
    }

    // Kiểm tra role hợp lệ
    if (!['user', 'admin'].includes(user.role)) {
      user.role = 'user'; // Mặc định là user nếu role không hợp lệ
      await UserModel.updateRole(user.id, 'user');
    }

    req.user = user;
    req.session.role = user.role;
    next();
  } catch (error) {
    res.clearCookie('token');
    return res.redirect('/login');
  }
};

const isAdmin = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).render('error', {
        message: 'Access denied. Admin only.',
        error: { status: 403 }
      });
    }
    next();
  } catch (error) {
    return res.status(500).render('error', {
      message: 'Server error',
      error: { status: 500 }
    });
  }
};

// Middleware để kiểm tra quyền truy cập vào các route cụ thể
const hasPermission = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.redirect('/login');
    }

    if (requiredRole === 'admin' && req.user.role !== 'admin') {
      return res.status(403).render('error', {
        message: 'Access denied. Admin only.',
        error: { status: 403 }
      });
    }

    next();
  };
};

module.exports = {
  isAuthenticated,
  isAdmin,
  hasPermission
};
