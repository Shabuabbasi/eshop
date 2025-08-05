import Order from '../models/orderModel.js';

export const getAssignedOrders = async (req, res) => {
  try {
    const courierId = req.user._id;

    const orders = await Order.find({ courier: courierId })
      .populate('user', 'name email')
      .populate('items.product', 'name price image')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("getAssignedOrders error:", error);
    res.status(500).json({ success: false, message: 'Failed to fetch assigned orders' });
  }
};
