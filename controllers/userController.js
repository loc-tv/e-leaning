const UserModel = require('../models/userModel.js');
const bcrypt = require('bcrypt');
const User = require('../models/userModel.js');
const pool = require('../config/db');

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
  showSimulation: (req, res) => {
    res.render('simulations', { 
      title: 'Signal Modulation Simulation',
      defaultValues: {
        carrierFreq: 10,
        messageFreq: 1,
        timePoints: 100,
        modulationType: 'AM'
      }
    });
  },
  calculateModulation: (req, res) => {
    const { carrierFreq, messageFreq, timePoints, modulationType } = req.body;
    const time = Array.from({ length: timePoints }, (_, i) => i / timePoints);
    
    let result = [];
    switch (modulationType) {
      case 'AM':
        result = time.map(t => simulateAM(Number(carrierFreq), Number(messageFreq), t));
        break;
      case 'FM':
        result = time.map(t => simulateFM(Number(carrierFreq), Number(messageFreq), t));
        break;
      case 'PSK':
        // For PSK, we'll use a simple binary message
        const message = time.map(t => Math.sin(2 * Math.PI * Number(messageFreq) * t) > 0 ? 1 : -1);
        result = time.map((t, i) => simulatePSK(Number(carrierFreq), message[i], t));
        break;
    }

    res.json({
      time: time,
      result: result,
      carrier: time.map(t => Math.sin(2 * Math.PI * Number(carrierFreq) * t)),
      message: time.map(t => Math.sin(2 * Math.PI * Number(messageFreq) * t))
    });
  },
  showQuiz: async (req, res) => {
    try {
      const questions = await UserModel.getQuizzesQuestions();
      res.render('quizzes', { 
        title: 'Digital Communication Quiz',
        questions: questions
      });
    } catch (err) {
      res.status(500).send('Error loading quiz questions');
    }
  },
  submitQuiz: async (req, res) => {
    try {
      const answers = req.body;
      const questions = await UserModel.getQuizzesQuestions();
      
      let score = 0;
      const feedback = [];
      
      questions.forEach(question => {
        const userAnswer = parseInt(answers[question.id]);
        const isCorrect = userAnswer === question.correct_answer;
        
        if (isCorrect) {
          score++;
        }
        
        feedback.push({
          questionId: question.id,
          correctAnswer: question.correct_answer,
          explanation: question.explanation
        });
      });
      
      // Save quiz result
      await UserModel.saveQuizzesResult(req.session.userId, score, questions.length);
      
      res.json({
        score: score,
        total: questions.length,
        feedback: feedback
      });
    } catch (err) {
      res.status(500).send('Error processing quiz submission');
    }
  },
  register: async (req, res) => {
    const { username, password, email } = req.body;
    try {
      // Kiểm tra username đã tồn tại chưa
      const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
      if (rows.length > 0) {
        return res.status(400).send('Tài khoản đã tồn tại');
      }
      // Mã hóa mật khẩu
      const hashedPassword = await bcrypt.hash(password, 10);
      // Lưu vào database
      await pool.query('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [username, hashedPassword, email]);
      res.redirect('/login');
    } catch (err) {
      res.status(500).send('Lỗi server');
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
    res.redirect('/');
  },
  showSettings: (req, res) => {
    res.render('settings', { title: 'Cài đặt tài khoản' });
  },
  changePassword: async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.session.userId);
    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) return res.render('settings', { error: 'Mật khẩu cũ không đúng' });
    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashed, user.id]);
    res.render('settings', { success: 'Đổi mật khẩu thành công' });
  },
  changeEmail: async (req, res) => {
    const { newEmail } = req.body;
    await pool.query('UPDATE users SET email = ? WHERE id = ?', [newEmail, req.session.userId]);
    res.render('settings', { success: 'Đổi email thành công' });
  },
  logout: (req, res) => {
    req.session.destroy();
    res.redirect('/login');
  }
};

module.exports = UserController;