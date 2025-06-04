const express = require('express');
const router = express.Router();
const authController = require('./controllers/authController');
const userController = require('./controllers/userController');
const quizController = require('./controllers/quizController');
const theoryController = require('./controllers/theoryController');
const simulationController = require('./controllers/simulationController');
const commentController = require('./controllers/commentController');
const { isAuthenticated, isAdmin } = require('./middleware/authMiddleware');

// Auth Routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/logout', isAuthenticated, authController.logout);
router.post('/auth/refresh-token', authController.refreshToken);

// User Routes
router.get('/users/me', isAuthenticated, userController.getProfile);
router.put('/users/me', isAuthenticated, userController.updateProfile);
router.get('/users/:id', isAuthenticated, userController.getUserById);
router.put('/users/password', isAuthenticated, userController.changePassword);
router.put('/users/email', isAuthenticated, userController.changeEmail);

// Quiz Routes
router.get('/quizzes', isAuthenticated, quizController.getQuizzes);
router.get('/quizzes/:id', isAuthenticated, quizController.getQuizById);
router.post('/quizzes/:id/submit', isAuthenticated, quizController.submitQuiz);
router.get('/quizzes/results', isAuthenticated, quizController.getQuizResults);

// Theory Routes
router.get('/theories', isAuthenticated, theoryController.getTheories);
router.get('/theories/:id', isAuthenticated, theoryController.getTheoryById);

// Simulation Routes
router.get('/simulations', isAuthenticated, simulationController.getSimulations);
router.post('/simulations/calculate', isAuthenticated, simulationController.calculateModulation);

// Comment Routes
router.post('/comments', isAuthenticated, commentController.createComment);
router.get('/comments', isAuthenticated, commentController.getComments);
router.put('/comments/:commentId', isAuthenticated, commentController.updateComment);
router.delete('/comments/:commentId', isAuthenticated, commentController.deleteComment);

// Admin Routes
router.get('/admin/users', isAuthenticated, isAdmin, userController.getAllUsers);
router.put('/admin/users/:id/role', isAuthenticated, isAdmin, userController.updateUserRole);

router.get('/admin/quizzes', isAuthenticated, isAdmin, quizController.getAllQuizzes);
router.post('/admin/quizzes', isAuthenticated, isAdmin, quizController.createQuiz);
router.put('/admin/quizzes/:id', isAuthenticated, isAdmin, quizController.updateQuiz);
router.delete('/admin/quizzes/:id', isAuthenticated, isAdmin, quizController.deleteQuiz);

router.get('/admin/theories', isAuthenticated, isAdmin, theoryController.getAllTheories);
router.post('/admin/theories', isAuthenticated, isAdmin, theoryController.createTheory);
router.put('/admin/theories/:id', isAuthenticated, isAdmin, theoryController.updateTheory);
router.delete('/admin/theories/:id', isAuthenticated, isAdmin, theoryController.deleteTheory);

module.exports = router; 