import User from '../models/User.js';
import Order from '../models/Order.js';
import DeliveryPerson from '../models/DeliveryPerson.js';

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countUsers();
    const totalOrders = await Order.getTotalOrders();
    const ordersPerHour = await Order.getOrdersPerHour();
    const topCategories = await Order.getTopCategories();

    res.json({
      totalUsers,
      totalOrders,
      ordersPerHour,
      topCategories
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Error fetching dashboard stats' });
  }
};

export const getDeliveryPersons = async (req, res) => {
  try {
    const deliveryPersons = await DeliveryPerson.findAll();
    res.json(deliveryPersons);
  } catch (error) {
    console.error('Error fetching delivery persons:', error);
    res.status(500).json({ error: 'Error fetching delivery persons' });
  }
};
