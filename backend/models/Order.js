import pool from '../db.js';

class Order {
  static async create(orderData) {
    const { user_id, restaurant_id, category, total, items } = orderData;
    const [result] = await pool.query(
      'INSERT INTO orders (user_id, restaurant_id, category, total, items) VALUES (?, ?, ?, ?, ?)',
      [user_id, restaurant_id, category, total, JSON.stringify(items)]
    );
    return result.insertId;
  }

  static async getUserOrders(userId, status) {
    let query = 'SELECT * FROM orders WHERE user_id = ?';
    const params = [userId];
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    query += ' ORDER BY created_at DESC';
    const [rows] = await pool.query(query, params);
    return rows;
  }

  static async getAllOrders() {
    const [rows] = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    return rows;
  }

  static async updateStatus(orderId, status) {
    const [result] = await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
    return result.affectedRows > 0;
  }

  static async getTotalOrders() {
    const [rows] = await pool.query('SELECT COUNT(*) AS total FROM orders');
    return rows[0].total;
  }

  static async getOrdersPerHour() {
    const [rows] = await pool.query(
      `SELECT HOUR(created_at) AS hour, COUNT(*) AS count
       FROM orders
       GROUP BY hour
       ORDER BY hour`
    );
    // Create array with 24 hours initialized to 0
    const result = Array(24).fill(0);
    rows.forEach(row => {
      result[row.hour] = row.count;
    });
    return result;
  }

  static async getTopCategories() {
    const [rows] = await pool.query(
      `SELECT category, COUNT(*) AS count
       FROM orders
       GROUP BY category
       ORDER BY count DESC
       LIMIT 5`
    );
    return rows;
  }
}

export default Order;
