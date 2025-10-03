import db from '../db.js';

class DeliveryPerson {
  static async create(data) {
    const { full_name, phone, vehicle_type, status = 'available' } = data;
    const query = `
      INSERT INTO delivery_persons (full_name, phone, vehicle_type, status)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await db.execute(query, [full_name, phone, vehicle_type, status]);
    return { id: result.insertId, ...data, status };
  }

  static async findAll() {
    const query = 'SELECT * FROM delivery_persons ORDER BY created_at DESC';
    const [rows] = await db.execute(query);
    return rows;
  }

  static async findAvailable() {
    const query = "SELECT * FROM delivery_persons WHERE status = 'available' ORDER BY created_at DESC";
    const [rows] = await db.execute(query);
    return rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM delivery_persons WHERE id = ?';
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  }

  static async updateStatus(id, status) {
    const query = 'UPDATE delivery_persons SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    const [result] = await db.execute(query, [status, id]);
    return result.affectedRows > 0;
  }

  static async assignToOrder(deliveryPersonId, orderId) {
    // First, set delivery person to busy
    await this.updateStatus(deliveryPersonId, 'busy');
    // Note: Order assignment logic would be in orderController, here we just update status
    return true;
  }

  static async completeDelivery(deliveryPersonId) {
    // Set back to available after delivery
    await this.updateStatus(deliveryPersonId, 'available');
    return true;
  }
}

export default DeliveryPerson;
