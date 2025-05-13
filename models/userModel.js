const db = require("../config/db.js");

const UserModel = {
  saveSignal: (inputSignal, result, callback) => {
    const query = "INSERT INTO signals (input_signal, result) VALUES (?, ?)";
    db.query(query, [inputSignal, result], callback);
  },
  getAllSignals: (callback) => {
    const query = "SELECT * FROM signals ORDER BY created_at DESC";
    db.query(query, callback);
  },
  getQuizzesQuestions: async () => {
    const [questions] = await db.execute(`
      SELECT * FROM quizzes_questions 
      ORDER BY RAND() 
      LIMIT 10
    `);
    return questions;
  },
  saveQuizzesResult: async (userId, score, totalQuestions, callback) => {
    try {
      await db.execute(
        'INSERT INTO quizzes_results (user_id, score, total_questions, taken_at) VALUES (?, ?, ?, NOW())',
        [userId, score, totalQuestions]
      );
      callback(null);
    } catch (err) {
      callback(err);
    }
  },
  getQuizzesHistory: async (userId, callback) => {
    try {
      const [results] = await db.execute(
        'SELECT * FROM quizzes_results WHERE user_id = ? ORDER BY taken_at DESC',
        [userId]
      );
      callback(null, results);
    } catch (err) {
      callback(err);
    }
  },
  create: async (username, hashedPassword, email) => {
    await db.execute(
      'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
      [username, hashedPassword, email]
    );
  },
  findByUsername: async (username) => {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    return rows[0];
  },
  findById: async (id) => {
    const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  },
};

module.exports = UserModel;
