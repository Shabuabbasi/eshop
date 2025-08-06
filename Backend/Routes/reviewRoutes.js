// routes/reviewRoutes.js
import express from 'express';
import { addReview, getProductReviews,getMyReviews,getSellerProductReviews } from '../controllers/reviewController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// POST: Add a review (only after delivery)
router.post('/add-review', protect, addReview);

// GET: Get all reviews for a product
router.get('/get/:id', getProductReviews);
router.get('/my-reviews', protect, getMyReviews);
router.get('/seller-reviews', protect, getSellerProductReviews);

export default router;
