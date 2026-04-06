import express from 'express';
import { UserRoutes } from '../modules/user/user.route.js';
import { ContentRoutes } from '../modules/content/content.route.js';
import { ProductRoutes } from '../modules/product/product.route.js';
import { OrderRoutes } from '../modules/order/order.route.js';
import { RatingRoutes } from '../modules/rating/rating.route.js';
import { CartRoutes } from '../modules/cart/cart.route.js';

const router = express.Router();

router.use('/auth', UserRoutes);
router.use('/content', ContentRoutes);
router.use('/products', ProductRoutes);
router.use('/orders', OrderRoutes);
router.use('/ratings', RatingRoutes);
router.use('/cart', CartRoutes);

export default router;
