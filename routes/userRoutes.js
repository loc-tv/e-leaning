const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');
const { requireLogin } = require('../middleware/authMiddleware');

router.get('/register', (req, res) => res.render('register'));
router.post('/register', userController.register);

router.get('/login', (req, res) => res.render('login'));
router.post('/login', userController.login);

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

router.get('/settings', requireLogin, userController.showSettings);
router.post('/settings/change-password', requireLogin, userController.changePassword);
router.post('/settings/change-email', requireLogin, userController.changeEmail);
router.get('/logout', requireLogin, userController.logout);

router.get('/simulations', requireLogin, userController.showSimulation);
router.post('/simulations/calculate', requireLogin, userController.calculateModulation);

router.get('/quizzes', requireLogin, userController.showQuiz);
router.post('/quizzes/submit', requireLogin, userController.submitQuiz);

module.exports = router;


