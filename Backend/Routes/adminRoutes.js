import express from 'express';
import { getAdminStats,getAllUsers,getAllProducts,getAllOrders,getAllCouriers } from '../controllers/adminController.js';
import { protect, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/stats', protect, isAdmin, getAdminStats);
router.get('/users', protect, isAdmin, getAllUsers);
router.get('/products', protect, isAdmin, getAllProducts);
router.get('/orders', protect, isAdmin, getAllOrders);
router.get('/couriers', protect, isAdmin, getAllCouriers);



export default router;
