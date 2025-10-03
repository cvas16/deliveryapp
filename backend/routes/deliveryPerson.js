import express from 'express';
import { getAllDeliveryPersons, createDeliveryPerson, updateDeliveryPersonStatus, assignDeliveryPersonToOrder, completeDelivery } from '../controllers/deliveryPersonController.js';

const router = express.Router();

router.get('/', getAllDeliveryPersons);
router.post('/', createDeliveryPerson);
router.put('/:id/status', updateDeliveryPersonStatus);
router.post('/assign', assignDeliveryPersonToOrder);
router.post('/complete', completeDelivery);

export default router;
