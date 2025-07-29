import express from 'express';
import { addProduct, getAllProducts,getProductsBySeller ,deleteProduct,updateProduct} from '../controllers/productController.js';
import { protect } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.post('/add', protect, upload.single('image'), addProduct); 
router.get('/all', getAllProducts);
router.get('/seller/:id', getProductsBySeller);
router.delete('/:id', protect, deleteProduct);
router.put('/:id', protect, upload.single('image'), updateProduct);

export default router;
