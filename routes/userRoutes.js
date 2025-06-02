const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const { isAuthenticated } = require('../middleware/authMiddleware');
const userController = require('../controllers/userController.js');

// Đăng ký
router.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    
    // Kiểm tra username đã tồn tại
    const existingUser = await UserModel.findByUsername(username);
    if (existingUser) {
      return res.render('register', { 
        error: 'Username already exists',
        title: 'Register'
      });
    }

    // Mã hóa password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Tạo user mới
    await UserModel.create(username, hashedPassword, email);
    
    res.redirect('/login');
  } catch (error) {
    res.render('register', { 
      error: 'Registration failed',
      title: 'Register'
    });
  }
});

// Đăng nhập
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await UserModel.findByUsername(username);
    if (!user) {
      return res.render('login', { 
        error: 'Invalid username or password',
        title: 'Login'
      });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.render('login', { 
        error: 'Invalid username or password',
        title: 'Login'
      });
    }

    // Tạo JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Lưu token vào cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });
    // Chuyển hướng dựa vào role
    if (user.role === 'admin') {
      res.send(`
        <html>
          <body>
            <script>window.location.href = '/admin/dashboard';</script>
          </body>
        </html>
      `);
    } else {
      res.send(`
        <html>
          <body>
            <script>window.location.href = '/';</script>
          </body>
        </html>
      `);
    }
  } catch (error) {
    res.render('login', { 
      error: 'Login failed',
      title: 'Login'
    });
  }
});

// Đăng xuất
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
});

// Trang đăng nhập
router.get('/login', (req, res) => {
  res.render('login', { 
    title: 'Login'
  });
});

// Trang đăng ký
router.get('/register', (req, res) => {
  res.render('register', { 
    title: 'Register'
  });
});

// Trang chủ (yêu cầu đăng nhập)
router.get('/home', isAuthenticated, (req, res) => {
  res.render('home', {
    user: req.user,
    role: req.user.role,
    title: 'Home'
  });
});

router.get('/settings', isAuthenticated, (req, res) => {
  res.render('settings', {
    user: req.user,
    role: req.user.role,
    title: 'Settings'
  });
});
router.post('/settings/change-password', isAuthenticated, userController.changePassword);
router.post('/settings/change-email', isAuthenticated, userController.changeEmail);
router.get('/logout', isAuthenticated, userController.logout);

router.get('/simulations', isAuthenticated, (req, res) => {
  res.render('simulations', {
    user: req.user,
    role: req.user.role,
    title: 'Simulations'
  });
});
router.post('/simulations/calculate', isAuthenticated, userController.calculateModulation);

router.get('/quizzes', isAuthenticated, userController.showQuiz);
router.post('/quizzes/submit', isAuthenticated, userController.submitQuiz);

module.exports = router;


