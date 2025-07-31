import express from 'express';
import { confirmOrder,cancelOrder,getUserOrders } from '../controllers/orderController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/confirm', protect, confirmOrder);
router.get('/my-orders', protect, getUserOrders); 
router.put('/cancel/:id', protect, cancelOrder);

export default router;
