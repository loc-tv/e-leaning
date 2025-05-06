const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

router.get('/', UserController.home);
router.get('/form', UserController.showForm);
router.post('/process', UserController.processSignal);
router.get('/docs', UserController.showDocs);
router.get('/simulation', UserController.showSimulation);
router.get('/quiz', UserController.showQuiz);
router.post('/quiz', UserController.submitQuiz);

module.exports = router;