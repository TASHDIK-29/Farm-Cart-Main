import express from 'express';
import { OrderController } from './order.controller.js';

const router = express.Router();

router.post('/', OrderController.createOrder);
router.get('/consumer/:consumerId', OrderController.getConsumerOrders);
router.get('/farmer/:farmerId', OrderController.getFarmerOrders);
router.patch('/:orderId/status', OrderController.updateOrderStatus);

export const OrderRoutes = router;
