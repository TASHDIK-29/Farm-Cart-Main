import express from 'express';
import { CartController } from './cart.controller.js';

const router = express.Router();

router.post('/', CartController.addToCart);
router.get('/:consumerId', CartController.getConsumerCart);
router.delete('/:cartItemId', CartController.removeFromCart);

export const CartRoutes = router;
