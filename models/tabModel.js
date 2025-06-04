const db = require('../config/db');

class TabModel {
    // Lấy tất cả các tab
    static async getAll() {
        try {
            const [rows] = await db.query('SELECT * FROM tabs ORDER BY id');
            return rows;
        } catch (error) {
            console.error('Error in TabModel.getAll:', error);
            throw error;
        }
    }

    // Lấy tab theo ID
    static async getById(id) {
        try {
            const [rows] = await db.query('SELECT * FROM tabs WHERE id = ?', [id]);
            return rows[0];
        } catch (error) {
            console.error('Error in TabModel.getById:', error);
            throw error;
        }
    }

    // Lấy tab theo tên
    static async getByName(name) {
        try {
            const [rows] = await db.query('SELECT * FROM tabs WHERE name = ?', [name]);
            return rows[0];
        } catch (error) {
            console.error('Error in TabModel.getByName:', error);
            throw error;
        }
    }

    // Tạo tab mới
    static async create(name, content) {
        try {
            const [result] = await db.query(
                'INSERT INTO tabs (name, content) VALUES (?, ?)',
                [name, content]
            );
            return result.insertId;
        } catch (error) {
            console.error('Error in TabModel.create:', error);
            throw error;
        }
    }

    // Cập nhật tab
    static async update(id, name, content) {
        try {
            const [result] = await db.query(
                'UPDATE tabs SET name = ?, content = ? WHERE id = ?',
                [name, content, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error in TabModel.update:', error);
            throw error;
        }
    }

    // Xóa tab
    static async delete(id) {
        try {
            const [result] = await db.query('DELETE FROM tabs WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error in TabModel.delete:', error);
            throw error;
        }
    }
}

module.exports = TabModel; 