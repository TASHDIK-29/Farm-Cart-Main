import express from 'express';
import { ProductController } from './product.controller.js';
import { upload } from '../../middlewares/upload.js';

const router = express.Router();

router.post('/', upload.single('image'), ProductController.createProduct);
router.get('/farmer/:farmerId', ProductController.getFarmerProducts);
router.get('/', ProductController.getAllProducts);

export const ProductRoutes = router;
