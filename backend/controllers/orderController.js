import Order from '../models/Order.js';
import User from '../models/User.js';

export const createOrder = async (req, res) => {
  try {
    const { userId, items, total } = req.body;
    if (!userId || !items || items.length === 0) {
      return res.status(400).json({ error: 'Datos de orden incompletos' });
    }

    // Assume first item for restaurant_id and category (simplify; in real, group by restaurant)
    const restaurant_id = items[0].restaurantId;
    const category = items[0].category || 'General';

    const orderData = {
      user_id: userId,
      restaurant_id,
      category,
      total,
      items
    };

    const orderId = await Order.create(orderData);
    res.json({ message: 'Orden creada exitosamente', orderId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear orden' });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.query.userId || req.user?.id; // Assume auth middleware sets req.user
    const status = req.query.status;
    const orders = await Order.getUserOrders(userId, status);
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al obtener órdenes' });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.getAllOrders();
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener todas las órdenes' });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const success = await Order.updateStatus(orderId, status);
    if (success) {
      res.json({ message: 'Estado de orden actualizado' });
    } else {
      res.status(404).json({ error: 'Orden no encontrada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar estado' });
  }
};
