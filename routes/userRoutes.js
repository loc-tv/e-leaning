const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const { isAuthenticated } = require('../middleware/authMiddleware');
const userController = require('../controllers/userController.js');
const TabModel = require('../models/tabModel');
const QuizzesQuestionModel = require('../models/quizzesQuestionModel');

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
router.get('/home', isAuthenticated, async (req, res) => {
  const tab = await TabModel.getByName('Study Materials');
  console.log('Tab for Study Materials:', tab);
  res.render('home', {
    user: req.user,
    role: req.user.role,
    title: 'Home',
    tabId: tab ? tab.id : null
  });
});

// Study Materials
router.get('/study-materials', isAuthenticated, async (req, res) => {
    const tab = await TabModel.getByName('Study Materials');
    console.log('Tab for Study Materials (route /study-materials):', tab);
    res.render('home', { user: req.user, tabId: tab ? tab.id : null });
});

// Simulations
router.get('/simulations', isAuthenticated, async (req, res) => {
    const tab = await TabModel.getByName('Simulations');
    res.render('simulations', { user: req.user, tabId: tab ? tab.id : null });
});

// Quizzes
router.get('/quizzes', isAuthenticated, async (req, res) => {
    const tab = await TabModel.getByName('Quizzes');
    const questions = await QuizzesQuestionModel.getAll();
    res.render('quizzes', { user: req.user, tabId: tab ? tab.id : null, questions });
});

// Settings (KHÔNG truyền tabId, KHÔNG render comments)
router.get('/settings', isAuthenticated, (req, res) => {
    res.render('settings', { user: req.user });
});

router.post('/settings/change-password', isAuthenticated, userController.changePassword);
router.post('/settings/change-email', isAuthenticated, userController.changeEmail);
router.get('/logout', isAuthenticated, userController.logout);

router.post('/simulations/calculate', isAuthenticated, userController.calculateModulation);
router.post('/quizzes/submit', isAuthenticated, userController.submitQuiz);

// Thêm route nhận token từ client và set cookie
router.post('/set-token', (req, res) => {
  console.log('SET-TOKEN CALLED', req.body); // Log để kiểm tra
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: 'No token provided' });
  res.cookie('token', token, {
    // httpOnly: true, // Tạm thời bỏ để test
    secure: false,
    sameSite: 'lax',
    path: '/',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  });
  res.status(200).json({ success: true });
});

module.exports = router;


