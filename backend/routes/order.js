import express from 'express';
import { createOrder, getUserOrders, getAllOrders, updateOrderStatus } from '../controllers/orderController.js';

const router = express.Router();

// Create order (from cart checkout)
router.post('/create', createOrder);

// Get user's orders (for "Mis pedidos")
router.get('/user', getUserOrders);

// Get all orders (for admin)
router.get('/admin', getAllOrders);

// Update order status (admin only)
router.put('/:orderId/status', updateOrderStatus);

export default router;
