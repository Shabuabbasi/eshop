import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';

export const getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.user._id;

    // Get all products of the seller
    const sellerProducts = await Product.find({ seller: sellerId }).select('_id');
    const productIds = sellerProducts.map(p => p._id.toString());

    // Find orders containing any of the seller's products
    const orders = await Order.find({ "items.product": { $in: productIds } })
      .populate("user", "name email")
      .populate({
        path: "items.product",
        select: "name image price seller", 
        populate: {
          path: "seller",
          select: "_id"
        }
      });

    // Filter each order's items to include only seller's products
    const filteredOrders = orders.map(order => {
      const filteredItems = order.items.filter(
        item => item.product?.seller?._id?.toString() === sellerId.toString()
      );

      return {
        _id: order._id,
        user: order.user,
        status: order.status,
        createdAt: order.createdAt,
        items: filteredItems,
      };
    });

    res.json({ success: true, orders: filteredOrders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
