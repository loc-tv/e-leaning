const db = require("../config/db");

const UserModel = {
  saveSignal: (inputSignal, result, callback) => {
    const query = "INSERT INTO signals (input_signal, result) VALUES (?, ?)";
    db.query(query, [inputSignal, result], callback);
  },
  getAllSignals: (callback) => {
    const query = "SELECT * FROM signals ORDER BY created_at DESC";
    db.query(query, callback);
  },
  getQuizQuestions: (callback) => {
    const query = "SELECT * FROM quiz_questions";
    db.query(query, callback);
  },
  saveQuizResult: (score, total, callback) => {
    const query = "INSERT INTO quiz_results (score, total) VALUES (?, ?)";
    db.query(query, [score, total], callback);
  },
};

module.exports = UserModel;
