import express from 'express';
import { confirmOrder,cancelOrder,getUserOrders,getCourierOrders,updateOrderStatus,assignCourier } from '../controllers/orderController.js';
import { protect,isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/confirm', protect, confirmOrder);
router.get('/my-orders', protect, getUserOrders); 
router.put('/cancel/:id', protect, cancelOrder);

router.get('/courier/:courierId', getCourierOrders); 
router.put('/:id/status', updateOrderStatus); 
router.put('/:id/assign-courier',protect,isAdmin, assignCourier); 

export default router;
