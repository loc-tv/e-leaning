const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');
const UserModel = require('../models/userModel');
const QuizzesQuestionModel = require('../models/quizzesQuestionModel');
const TheoryModel = require('../models/theoryModel');

// Middleware kiểm tra quyền admin
router.use(isAuthenticated, isAdmin);

// Trang quản lý admin
router.get('/dashboard', (req, res) => {
  res.render('admin/dashboard', {
    user: req.user,
    title: 'Admin Dashboard'
  });
});

// Quản lý người dùng
router.get('/users', async (req, res) => {
  try {
    const users = await UserModel.getAllUsers();
    res.render('admin/users', { 
      users,
      user: req.user,
      title: 'Quản lý người dùng'
    });
  } catch (error) {
    res.status(500).render('error', {
      message: 'Server error',
      error: { status: 500 }
    });
  }
});

// Cập nhật role người dùng
router.post('/users/:userId/role', async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    
    // Kiểm tra role hợp lệ
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).render('error', {
        message: 'Invalid role',
        error: { status: 400 }
      });
    }

    await UserModel.updateRole(userId, role);
    res.redirect('/admin/users');
  } catch (error) {
    res.status(500).render('error', {
      message: 'Server error',
      error: { status: 500 }
    });
  }
});

// Quản lý câu hỏi
router.get('/questions', async (req, res) => {
  try {
    const questions = await QuizzesQuestionModel.getAll();
    res.render('admin/questions', {
      user: req.user,
      title: 'Quản lý câu hỏi',
      questions
    });
  } catch (error) {
    res.status(500).render('error', {
      message: 'Server error',
      error: { status: 500 }
    });
  }
});

// Quản lý lý thuyết
router.get('/theory', async (req, res) => {
  try {
    const theories = await TheoryModel.getAll();
    res.render('admin/theory', {
      user: req.user,
      title: 'Quản lý lý thuyết',
      theories
    });
  } catch (error) {
    res.status(500).render('error', {
      message: 'Server error',
      error: { status: 500 }
    });
  }
});

// Thêm lý thuyết mới
router.post('/theory/add', async (req, res) => {
  try {
    const { title, content } = req.body;
    await TheoryModel.add(title, content);
    res.redirect('/admin/theory');
  } catch (error) {
    res.status(500).render('error', {
      message: 'Server error',
      error: { status: 500 }
    });
  }
});

// Trang sửa lý thuyết
router.get('/theory/edit/:id', async (req, res) => {
  try {
    const theory = await TheoryModel.getById(req.params.id);
    res.render('admin/theory_edit', {
      user: req.user,
      title: 'Sửa lý thuyết',
      theory
    });
  } catch (error) {
    res.status(500).render('error', {
      message: 'Server error',
      error: { status: 500 }
    });
  }
});

// Xử lý sửa lý thuyết
router.post('/theory/edit/:id', async (req, res) => {
  try {
    const { title, content } = req.body;
    await TheoryModel.update(req.params.id, title, content);
    res.redirect('/admin/theory');
  } catch (error) {
    res.status(500).render('error', {
      message: 'Server error',
      error: { status: 500 }
    });
  }
});

// Xóa lý thuyết
router.post('/theory/delete/:id', async (req, res) => {
  try {
    await TheoryModel.delete(req.params.id);
    res.redirect('/admin/theory');
  } catch (error) {
    res.status(500).render('error', {
      message: 'Server error',
      error: { status: 500 }
    });
  }
});

// Thêm câu hỏi mới
router.post('/questions/add', async (req, res) => {
  try {
    const { question, optionA, optionB, optionC, optionD, correct, explanation } = req.body;
    // Build options array
    const options = [optionA, optionB, optionC, optionD];
    // Chuyển đáp án đúng từ A/B/C/D sang index 0/1/2/3
    const correctMap = { A: 0, B: 1, C: 2, D: 3 };
    const correct_answer = correctMap[correct];
    await QuizzesQuestionModel.add(question, options, correct_answer, explanation);
    res.redirect('/admin/questions');
  } catch (error) {
    res.status(500).render('error', {
      message: 'Server error',
      error: { status: 500 }
    });
  }
});

// Trang sửa câu hỏi
router.get('/questions/edit/:id', async (req, res) => {
  try {
    const question = await QuizzesQuestionModel.getById(req.params.id);
    res.render('admin/questions_edit', {
      user: req.user,
      title: 'Sửa câu hỏi',
      question
    });
  } catch (error) {
    res.status(500).render('error', {
      message: 'Server error',
      error: { status: 500 }
    });
  }
});

// Xử lý sửa câu hỏi
router.post('/questions/update', async (req, res) => {
  try {
    const { id, question, options, correct_answer, explanation } = req.body;
    await QuizzesQuestionModel.update(id, question, options, correct_answer, explanation);
    res.redirect('/admin/questions');
  } catch (error) {
    res.status(500).render('error', {
      message: 'Server error',
      error: { status: 500 }
    });
  }
});

// Xóa câu hỏi (hỗ trợ form POST)
router.post('/questions/delete/:id', async (req, res) => {
  try {
    await QuizzesQuestionModel.delete(req.params.id);
    res.redirect('/admin/questions');
  } catch (error) {
    res.status(500).render('error', {
      message: 'Server error',
      error: { status: 500 }
    });
  }
});

module.exports = router; 