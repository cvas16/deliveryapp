import pool from '../db.js';
import bcrypt from 'bcrypt';

class User {
    static async create(userData) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const [result] = await pool.query(
            `INSERT INTO users (first_name, last_name, email, phone, address, password, is_admin) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [userData.firstName, userData.lastName, userData.email, userData.phone, userData.address, hashedPassword, userData.isAdmin || false]
        );
        return result.insertId;
    }

    static async findByEmail(email) {
        const [rows] = await pool.query(`SELECT * FROM users WHERE email = ?`, [email]);
        return rows[0];
    }

    static async countUsers() {
        const [rows] = await pool.query('SELECT COUNT(*) AS total FROM users');
        return rows[0].total;
    }
}

export default User;
