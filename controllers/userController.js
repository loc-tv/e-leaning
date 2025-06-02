const UserModel = require('../models/userModel.js');
const bcrypt = require('bcrypt');
const User = require('../models/userModel.js');
const pool = require('../config/db');
const QuizzesQuestionModel = require('../models/quizzesQuestionModel');

const calculateDFT = (signal) => {
  const N = signal.length;
  const result = [];
  for (let k = 0; k < N; k++) {
    let sum = { real: 0, imag: 0 };
    for (let n = 0; n < N; n++) {
      const angle = (2 * Math.PI * k * n) / N;
      sum.real += signal[n] * Math.cos(angle);
      sum.imag -= signal[n] * Math.sin(angle);
    }
    result.push({ real: sum.real.toFixed(2), imag: sum.imag.toFixed(2) });
  }
  return result;
};

const simulateAM = (carrierFreq, messageFreq, time) => {
  const carrier = Math.sin(2 * Math.PI * carrierFreq * time);
  const message = Math.sin(2 * Math.PI * messageFreq * time);
  return (1 + 0.5 * message) * carrier;
};

const simulateFM = (carrierFreq, messageFreq, time) => {
  const message = Math.sin(2 * Math.PI * messageFreq * time);
  return Math.sin(2 * Math.PI * (carrierFreq * time + 0.5 * message));
};

const simulatePSK = (carrierFreq, message, time) => {
  const phase = message > 0 ? 0 : Math.PI;
  return Math.sin(2 * Math.PI * carrierFreq * time + phase);
};

const UserController = {
  home: (req, res) => {
    UserModel.getAllSignals((err, results) => {
      if (err) return res.status(500).send('Database error');
      res.render('home', { title: 'Digital Communication Learning', signals: results });
    });
  },
  showForm: (req, res) => {
    res.render('form', { title: 'Input Signal' });
  },
  processSignal: (req, res) => {
    const input = req.body.signal;
    const signalArray = input.split(',').map(Number);
    if (signalArray.some(isNaN)) {
      return res.render('result', { title: 'Result', error: 'Invalid input' });
    }
    const dftResult = calculateDFT(signalArray);
    const resultString = JSON.stringify(dftResult);
    UserModel.saveSignal(input, resultString, (err) => {
      if (err) return res.status(500).send('Database error');
      res.render('result', { title: 'Result', input, result: dftResult });
    });
  },
  showDocs: (req, res) => {
    res.render('docs', { title: 'Learning Materials' });
  },
  showSimulation: async (req, res) => {
    try {
      res.render('simulations', {
        user: req.user,
        title: 'Signal Simulation'
      });
    } catch (error) {
      res.status(500).render('error', {
        message: 'Error loading simulation',
        error: { status: 500 }
      });
    }
  },
  calculateModulation: async (req, res) => {
    try {
      const { carrierFreq, messageFreq, timePoints, modulationType } = req.body;
      const N = Number(timePoints) || 100;
      const carrierF = Number(carrierFreq) || 10;
      const messageF = Number(messageFreq) || 1;
      const time = Array.from({ length: N }, (_, i) => i / N);
      let result = [];
      let carrier = time.map(t => Math.sin(2 * Math.PI * carrierF * t));
      let message = time.map(t => Math.sin(2 * Math.PI * messageF * t));
      if (modulationType === 'AM') {
        result = time.map(t => (1 + 0.5 * Math.sin(2 * Math.PI * messageF * t)) * Math.sin(2 * Math.PI * carrierF * t));
      } else if (modulationType === 'FM') {
        result = time.map(t => Math.sin(2 * Math.PI * (carrierF * t + 0.5 * Math.sin(2 * Math.PI * messageF * t))));
      } else if (modulationType === 'PSK') {
        const messageBits = time.map(t => Math.sin(2 * Math.PI * messageF * t) > 0 ? 1 : -1);
        result = time.map((t, i) => Math.sin(2 * Math.PI * carrierF * t + (messageBits[i] > 0 ? 0 : Math.PI)));
      }
      res.json({ time, carrier, message, result });
    } catch (error) {
      console.error('Simulation error:', error);
      res.status(500).json({ error: 'Simulation error' });
    }
  },
  showQuiz: async (req, res) => {
    try {
      const questions = await QuizzesQuestionModel.getAll();
      res.render('quizzes', {
        user: req.user,
        questions,
        title: 'Quiz'
      });
    } catch (error) {
      console.error('Error loading quiz:', error);
      res.status(500).render('error', {
        message: 'Error loading quiz',
        error: { status: 500 }
      });
    }
  },
  submitQuiz: async (req, res) => {
    try {
      const { answers, questionOrder } = req.body;
      const ids = Object.keys(answers);
      const questions = await QuizzesQuestionModel.getByIds(ids);
      let score = 0;
      let wrongAnswers = [];
      questions.forEach(q => {
        const qid = String(q.id);
        let userAnswer = answers[qid];
        const originalIndex = questionOrder ? questionOrder.indexOf(qid) : -1;
        if (
          userAnswer !== null &&
          userAnswer !== undefined &&
          !isNaN(userAnswer) &&
          Number(userAnswer) >= 0 && Number(userAnswer) < q.options.length &&
          Number(userAnswer) === Number(q.correct_answer)
        ) {
          score++;
        } else {
          wrongAnswers.push({
            question: q.question,
            options: q.options,
            yourAnswer: (userAnswer !== null && userAnswer !== undefined && !isNaN(userAnswer) && Number(userAnswer) >= 0 && Number(userAnswer) < q.options.length) ? q.options[Number(userAnswer)] : null,
            correctAnswer: q.options[q.correct_answer],
            explanation: q.explanation,
            originalIndex: originalIndex
          });
        }
      });
      res.json({ score, totalQuestions: questions.length, wrongAnswers });
    } catch (error) {
      console.error('Error submitting quiz:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },
  register: async (req, res) => {
    const { username, password, email } = req.body;
    try {
      const existingUser = await UserModel.findByUsername(username);
      if (existingUser) {
        return res.render('register', { error: 'Tài khoản đã tồn tại', title: 'Register' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      await UserModel.create(username, hashedPassword, email); // luôn có role = 'user'
      res.redirect('/login');
    } catch (err) {
      res.status(500).render('register', { error: 'Lỗi server', title: 'Register' });
    }
  },
  login: async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findByUsername(username);
    if (!user) {
      return res.render('login', { error: 'Invalid username or password.' });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.render('login', { error: 'Invalid username or password.' });
    }
    req.session.userId = user.id;
    req.session.role = user.role;
    res.redirect('/');
  },
  showSettings: async (req, res) => {
    try {
      res.render('settings', {
        user: req.user,
        title: 'Settings'
      });
    } catch (error) {
      res.status(500).render('error', {
        message: 'Error loading settings',
        error: { status: 500 }
      });
    }
  },
  changePassword: async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = await UserModel.findById(req.user.id);

      // Kiểm tra mật khẩu hiện tại
      const validPassword = await bcrypt.compare(currentPassword, user.password);
      if (!validPassword) {
        return res.render('settings', {
          user: req.user,
          error: 'Current password is incorrect',
          title: 'Settings'
        });
      }

      // Mã hóa mật khẩu mới
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await UserModel.updatePassword(req.user.id, hashedPassword);

      res.render('settings', {
        user: req.user,
        success: 'Password updated successfully',
        title: 'Settings'
      });
    } catch (error) {
      res.status(500).render('error', {
        message: 'Error changing password',
        error: { status: 500 }
      });
    }
  },
  changeEmail: async (req, res) => {
    try {
      const { newEmail } = req.body;
      await UserModel.updateEmail(req.user.id, newEmail);

      res.render('settings', {
        user: req.user,
        success: 'Email updated successfully',
        title: 'Settings'
      });
    } catch (error) {
      res.status(500).render('error', {
        message: 'Error changing email',
        error: { status: 500 }
      });
    }
  },
  logout: (req, res) => {
    req.session.destroy();
    res.redirect('/login');
  }
};

module.exports = UserController;