import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';

export const getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.user._id;

    // Find all products by this seller
    const sellerProducts = await Product.find({ seller: sellerId }).select('_id');
    const productIds = sellerProducts.map(p => p._id.toString());

    // Find orders that include any of these products
    const orders = await Order.find({ "items.product": { $in: productIds } })
      .populate("user", "name email")
      .populate("items.product", "name image price");

    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
