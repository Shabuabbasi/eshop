import express from 'express';
import { addProduct, getAllProducts } from '../controllers/productController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/add', protect, addProduct);
router.get('/all', getAllProducts);           

export default router;
