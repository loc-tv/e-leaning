const db = require('../config/db');

const CommentModel = {
    create: async (userId, tabId, content) => {
        const [result] = await db.execute(
            'INSERT INTO comments (user_id, tab_id, content) VALUES (?, ?, ?)',
            [userId, tabId, content]
        );
        return result.insertId;
    },
    getByTabId: async (tabId) => {
        const [rows] = await db.execute(
            `SELECT c.*, u.username FROM comments c JOIN users u ON c.user_id = u.id WHERE c.tab_id = ? ORDER BY c.created_at DESC`,
            [tabId]
        );
        return rows;
    },
    update: async (commentId, userId, content) => {
        const [result] = await db.execute(
            'UPDATE comments SET content = ? WHERE id = ? AND user_id = ?',
            [content, commentId, userId]
        );
        return result.affectedRows > 0;
    },
    delete: async (commentId, userId) => {
        const [result] = await db.execute(
            'DELETE FROM comments WHERE id = ? AND user_id = ?',
            [commentId, userId]
        );
        return result.affectedRows > 0;
    }
};

module.exports = CommentModel;
