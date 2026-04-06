import express from 'express';
import { RatingController } from './rating.controller.js';

const router = express.Router();

router.post('/', RatingController.submitRating);
router.get('/farmer/:farmerId', RatingController.getFarmerRatings);

export const RatingRoutes = router;
