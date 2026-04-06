import express from 'express';
import { UserController } from './user.controller.js';

const router = express.Router();

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/farmers', UserController.getAllFarmers);
router.get('/farmer/:farmerId', UserController.getFarmerById);

export const UserRoutes = router;
