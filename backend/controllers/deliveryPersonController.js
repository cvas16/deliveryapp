import DeliveryPerson from '../models/DeliveryPerson.js';

export async function getAllDeliveryPersons(req, res) {
  try {
    let deliveryPersons;
    console.log('Query recibido:', req.query);
    if (req.query.available && (req.query.available === '1' || req.query.available === 1)) {
      deliveryPersons = await DeliveryPerson.findAvailable();
      console.log('Repartidores disponibles:', deliveryPersons.length);
    } else {
      deliveryPersons = await DeliveryPerson.findAll();
      console.log('Todos los repartidores:', deliveryPersons.length);
    }
    res.json(deliveryPersons);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching delivery persons' });
  }
}

export async function createDeliveryPerson(req, res) {
  try {
    const data = req.body;
    const newPerson = await DeliveryPerson.create(data);
    res.status(201).json(newPerson);
  } catch (error) {
    res.status(500).json({ error: 'Error creating delivery person' });
  }
}

export async function updateDeliveryPersonStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const success = await DeliveryPerson.updateStatus(id, status);
    if (success) {
      res.json({ message: 'Status updated' });
    } else {
      res.status(404).json({ error: 'Delivery person not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error updating status' });
  }
}

export async function assignDeliveryPersonToOrder(req, res) {
  try {
    const { deliveryPersonId, orderId } = req.body;
    await DeliveryPerson.assignToOrder(deliveryPersonId, orderId);
    res.json({ message: 'Delivery person assigned to order' });
  } catch (error) {
    res.status(500).json({ error: 'Error assigning delivery person' });
  }
}

export async function completeDelivery(req, res) {
  try {
    const { deliveryPersonId } = req.body;
    await DeliveryPerson.completeDelivery(deliveryPersonId);
    res.json({ message: 'Delivery completed' });
  } catch (error) {
    res.status(500).json({ error: 'Error completing delivery' });
  }
}
