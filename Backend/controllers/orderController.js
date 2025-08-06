import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';
import Review from '../models/reviewModel.js';

export const confirmOrder = async (req, res) => {
  try {
    console.log("REQ.BODY:", req.body);
    const { cart } = req.body;
    const items = cart;
    const userId = req.user._id;

    const updates = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ message: `Product ${item.productId} not found` });

      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `${product.name} is out of stock.` });
      }

      product.stock -= item.quantity;
      updates.push(product.save());
    }

    await Promise.all(updates);

    const order = await Order.create({
      user: userId,
      items: items.map(i => ({ product: i.productId, quantity: i.quantity })),
      status: 'Pending',
      estimatedDelivery: new Date(Date.now() + Math.floor(Math.random() * 4 + 2) * 24 * 60 * 60 * 1000) // 2–5 days
    });


    res.status(201).json({ success: true, message: "Order confirmed", order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    // Step 1: Fetch all orders by the user
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name price image')
      .sort({ createdAt: -1 });

    // Step 2: Fetch all reviews by this user
    const reviews = await Review.find({ user: req.user._id });

    // Step 3: Add a "reviewed" flag to each product in each order
    const reviewedMap = {};
    reviews.forEach((review) => {
      reviewedMap[`${review.order}_${review.product}`] = true;
    });

    const ordersWithReviewFlags = orders.map((order) => {
      const updatedItems = order.items.map((item) => {
        const hasReviewed = reviewedMap[`${order._id}_${item.product._id}`] || false;
        return {
          ...item.toObject(),
          reviewed: hasReviewed,
        };
      });

      return {
        ...order.toObject(),
        items: updatedItems,
      };
    });

    res.json({ success: true, orders: ordersWithReviewFlags });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


//Cancel Order
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.product");

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.status === "Cancelled") {
      return res.status(400).json({ message: "Order is already cancelled" });
    }
    if (order.status === "Shipped") {
      return res.status(401).json({ message: "Order has already been shipped and cannot be cancelled." });
    }

    if (order.status === "Delivered") {
      return res.status(401).json({ message: "Order has already been delivered. Contact support for returns." });
    }
    // Restore stock
    if (["Pending", "Confirmed"].includes(order.status)) {
      for (const item of order.items) {
        const product = await Product.findById(item.product._id);
        if (product) {
          product.stock += item.quantity;
          await product.save();
        }
      }
    }

    order.status = "Cancelled";
    await order.save();

    res.json({ message: "Order cancelled and stock restored." });
  } catch (err) {
    console.error("Cancel order error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCourierOrders = async (req, res) => {
  try {
    const { courierId } = req.params;

    const orders = await Order.find({ courier: courierId })
      .populate('user', 'name email')
      .populate('items.product', 'name price image')
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status;
    await order.save();

    res.json({ success: true, message: 'Status updated', order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
export const assignCourier = async (req, res) => {
  try {
    const { courierId } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const courier = await User.findById(courierId);
    if (!courier || courier.role !== 'Courier') {
      return res.status(400).json({ message: 'Invalid courier ID or user is not a courier' });
    }

    // Assign courier and update status
    order.courier = courierId;
    order.status = 'Confirmed';

    await order.save();

    res.json({ success: true, message: 'Courier assigned and order confirmed', order });
  } catch (err) {
    console.error("Assign courier error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

