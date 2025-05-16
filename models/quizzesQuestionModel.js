const db = require('../config/db');

const QuizzesQuestionModel = {
  getAll: async () => {
    try {
      const [rows] = await db.execute('SELECT * FROM quizzes_questions');
      return rows.map(q => {
        try {
          return {
            ...q,
            options: Array.isArray(q.options) ? q.options : JSON.parse(q.options)
          };
        } catch (parseError) {
          console.error('Error parsing options for question', q.id, ':', parseError);
          // Nếu không parse được JSON, trả về mảng rỗng
          return {
            ...q,
            options: []
          };
        }
      });
    } catch (error) {
      console.error('Error in getAll:', error);
      throw error;
    }
  },
  getById: async (id) => {
    try {
      const [rows] = await db.execute('SELECT * FROM quizzes_questions WHERE id = ?', [id]);
      if (!rows[0]) return null;
      try {
        return {
          ...rows[0],
          options: Array.isArray(rows[0].options) ? rows[0].options : JSON.parse(rows[0].options)
        };
      } catch (parseError) {
        console.error('Error parsing options for question', id, ':', parseError);
        return {
          ...rows[0],
          options: []
        };
      }
    } catch (error) {
      console.error('Error in getById:', error);
      throw error;
    }
  },
  getByIds: async (ids) => {
    try {
      if (!ids.length) return [];
      const placeholders = ids.map(() => '?').join(',');
      const [rows] = await db.execute(`SELECT * FROM quizzes_questions WHERE id IN (${placeholders})`, ids);
      return rows.map(q => {
        try {
          return {
            ...q,
            options: Array.isArray(q.options) ? q.options : JSON.parse(q.options)
          };
        } catch (parseError) {
          console.error('Error parsing options for question', q.id, ':', parseError);
          return {
            ...q,
            options: []
          };
        }
      });
    } catch (error) {
      console.error('Error in getByIds:', error);
      throw error;
    }
  },
  add: async (question, options, correct_answer, explanation) => {
    try {
      // Kiểm tra các trường bắt buộc
      if (!question || !options || correct_answer === undefined || !explanation) {
        console.error('Missing required fields:', { question, options, correct_answer, explanation });
        throw new Error('Missing required fields when adding quiz question');
      }
      // Đảm bảo options là JSON string
      const optionsJson = typeof options === 'string' ? options : JSON.stringify(options);
      await db.execute(
        'INSERT INTO quizzes_questions (question, options, correct_answer, explanation) VALUES (?, ?, ?, ?)',
        [question, optionsJson, correct_answer, explanation]
      );
    } catch (error) {
      console.error('Error in add:', error);
      throw error;
    }
  },
  update: async (id, question, options, correct_answer, explanation) => {
    try {
      // Đảm bảo options là JSON string
      const optionsJson = typeof options === 'string' ? options : JSON.stringify(options);
      await db.execute(
        'UPDATE quizzes_questions SET question = ?, options = ?, correct_answer = ?, explanation = ? WHERE id = ?',
        [question, optionsJson, correct_answer, explanation, id]
      );
    } catch (error) {
      console.error('Error in update:', error);
      throw error;
    }
  },
  delete: async (id) => {
    try {
      await db.execute('DELETE FROM quizzes_questions WHERE id = ?', [id]);
    } catch (error) {
      console.error('Error in delete:', error);
      throw error;
    }
  }
};

module.exports = QuizzesQuestionModel; 