const UserModel = require('../models/userModel');

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
    res.render('simulation', { title: 'Signal Modulation Simulation' });
  },
  showQuiz: (req, res) => {
    UserModel.getQuizQuestions((err, questions) => {
      if (err) return res.status(500).send('Database error');
      res.render('quiz', { title: 'Quiz', questions });
    });
  },
  submitQuiz: (req, res) => {
    UserModel.getQuizQuestions((err, questions) => {
      if (err) return res.status(500).send('Database error');
      let score = 0;
      questions.forEach((q, i) => {
        if (req.body[`answer${q.id}`] == q.correct_answer) score++;
      });
      UserModel.saveQuizResult(score, questions.length, (err) => {
        if (err) return res.status(500).send('Database error');
        res.render('quizResult', { title: 'Quiz Result', score, total: questions.length });
      });
    });
  }
};

module.exports = UserController;