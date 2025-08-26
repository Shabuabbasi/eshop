// routes/sellerRoutes.js or extend existing route
import express from 'express';
import { getSellerOrders } from '../controllers/sellerOrderController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/orders-received', protect, getSellerOrders);

export default router;
