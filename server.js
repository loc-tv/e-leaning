const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const dotenv = require('dotenv');
const db = require(path.join(__dirname, 'config', 'db'));
const winston = require('winston');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const { isAuthenticated } = require('./middleware/authMiddleware');
const setRole = require('./middleware/setRole');
const TabModel = require('./models/tabModel');


// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Configure Handlebars
const hbs = exphbs.create({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: [
    path.join(__dirname, 'views/partials'),
    path.join(__dirname, 'views')
  ],
  helpers: {
    eq: (a, b) => a === b
  }
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Middleware xác thực và gán role cho các route cần bảo vệ
app.use(setRole);

// API Routes
const apiRoutes = require('./api/v1/routes');
app.use('/api/v1', apiRoutes);

// Web Routes
const userRoutes = require('./routes/userRoutes');
app.use('/', userRoutes);

// Middleware xác thực cho các route cần bảo vệ
app.use(isAuthenticated);

// Các route cần đăng nhập
const adminRoutes = require('./routes/adminRoutes');
app.use('/admin', adminRoutes);

// Trang chủ (yêu cầu đăng nhập)
app.get('/', isAuthenticated, async (req, res) => {
  const tab = await TabModel.getByName('Study Materials');
  res.render('home', {
    title: 'Digital Communication Learning Platform',
    layout: 'main',
    user: req.user,
    tabId: tab ? tab.id : null
  });
});

// Error handling
app.use((err, req, res, next) => {
  logger.error(err.stack);
  console.error('Error stack:', err.stack);
  console.error('Error message:', err.message);
  res.status(500).render('error', {
    message: err.message || 'Something went wrong!',
    error: { status: 500 }
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
