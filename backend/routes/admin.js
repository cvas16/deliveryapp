import express from 'express';
import * as adminController from '../controllers/adminController.js';

const router = express.Router();

// Dashboard stats endpoint
router.get('/stats', adminController.getDashboardStats);

// Delivery persons endpoint
router.get('/delivery-persons', adminController.getDeliveryPersons);

// User management routes (commented out as not implemented)
// router.get('/users', adminController.getAllUsers);
// router.get('/users/:id', adminController.getUserById);
// router.post('/users', adminController.createUser);
// router.put('/users/:id', adminController.updateUser);
// router.delete('/users/:id', adminController.deleteUser);

export default router;
