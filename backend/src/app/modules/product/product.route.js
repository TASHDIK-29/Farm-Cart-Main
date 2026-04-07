import express from 'express';
import { ProductController } from './product.controller.js';
import { upload } from '../../middlewares/upload.js';

const router = express.Router();

router.post('/', upload.single('image'), ProductController.createProduct);
router.get('/farmer/:farmerId', ProductController.getFarmerProducts);
router.get('/', ProductController.getAllProducts);
router.put('/:id', upload.single('image'), ProductController.updateProduct);
router.delete('/:id', ProductController.deleteProduct);

export const ProductRoutes = router;
