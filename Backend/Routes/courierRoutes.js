import express from 'express';
import { getAssignedOrders } from '../controllers/courierController.js';
import { protect } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.get('/assigned-orders', protect, getAssignedOrders);

export default router;
