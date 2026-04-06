import express from 'express';
import { ContentController } from './content.controller.js';
import { upload } from '../../middlewares/upload.js';

const router = express.Router();

router.post('/', upload.single('mediaFile'), ContentController.createPost);
router.get('/farmer/:farmerId', ContentController.getFarmerPosts);
router.get('/timeline', ContentController.getAllTimelinePosts);

export const ContentRoutes = router;
