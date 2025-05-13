const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

router.get('/', UserController.home);
router.get('/form', UserController.showForm);
router.post('/process', UserController.processSignal);
router.get('/docs', UserController.showDocs);
router.get('/simulations', UserController.showSimulation);
router.get('/quizzes', UserController.showQuiz);
router.post('/quizzes', UserController.submitQuiz);

module.exports = router;