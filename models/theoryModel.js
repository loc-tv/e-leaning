const db = require('../config/db');

const TheoryModel = {
  getAll: async () => {
    const [rows] = await db.execute('SELECT * FROM theories');
    return rows;
  },
  add: async (title, content) => {
    await db.execute(
      'INSERT INTO theories (title, content) VALUES (?, ?)',
      [title, content]
    );
  },
  update: async (id, title, content) => {
    await db.execute(
      'UPDATE theories SET title = ?, content = ? WHERE id = ?',
      [title, content, id]
    );
  },
  delete: async (id) => {
    await db.execute('DELETE FROM theories WHERE id = ?', [id]);
  },
  getById: async (id) => {
    const [rows] = await db.execute('SELECT * FROM theories WHERE id = ?', [id]);
    return rows[0];
  }
};

module.exports = TheoryModel; 