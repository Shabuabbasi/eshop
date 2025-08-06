// controllers/reviewController.js
import Review from '../models/reviewModel.js';
import Product from '../models/productModel.js';
import Order from '../models/orderModel.js';

export const addReview = async (req, res) => {
  const { productId, rating, message, orderId } = req.body;
  const userId = req.user._id;

  try {
    const order = await Order.findOne({
      _id: orderId,
      user: userId,
      status: "Delivered",
      "items.product": productId,
    });

    if (!order) {
      return res.status(400).json({ message: "You can only review after delivery." });
    }

    const alreadyReviewed = await Review.findOne({ user: userId, product: productId, order: orderId });
    if (alreadyReviewed) {
      return res.status(400).json({ message: "You've already reviewed this product." });
    }

    await Review.create({
      user: userId,
      product: productId,
      rating,
      message,
      order: orderId,
    });

    await updateProductRating(productId); // ✅ clean and reusable

    res.status(201).json({ message: "Review added successfully." });
  } catch (err) {
    console.error("Review error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.id })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
// Add to reviewController.js
export const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .populate('product', 'name image')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    console.error("Get my reviews error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
export const getSellerProductReviews = async (req, res) => {
  try {
    const sellerId = req.user._id;

    // Get all products by this seller
    const sellerProducts = await Product.find({ seller: sellerId }).select('_id');

    const productIds = sellerProducts.map(p => p._id);

    // Get reviews for those products
    const reviews = await Review.find({ product: { $in: productIds } })
      .populate('product', 'name image')
      .populate('user', 'name email') // if needed
      .sort({ createdAt: -1 });

    res.json({ success: true, reviews });
  } catch (err) {
    console.error("Error fetching seller product reviews:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateProductRating = async (productId) => {
  const reviews = await Review.find({ product: productId });

  const numReviews = reviews.length;
  const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / numReviews;

  await Product.findByIdAndUpdate(productId, {
    averageRating: averageRating.toFixed(1),
    numReviews,
  });
};
