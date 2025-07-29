import express from 'express';
import { addProduct, getAllProducts } from '../controllers/productController.js';
import { protect } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.post('/add', protect, upload.single('image'), addProduct); 
router.get('/all', getAllProducts);

export default router;
