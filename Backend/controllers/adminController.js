import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import Order from '../models/orderModel.js';

export const getAdminStats = async (req, res) => {
  try {
    const roles = ['Customer', 'Seller', 'Courier', 'Admin'];
    const counts = await Promise.all(
      roles.map(role => User.countDocuments({ role }))
    );

    const stats = {};
    roles.forEach((role, i) => {
      stats[role.toLowerCase() + 's'] = counts[i];
    });
    stats.totalUsers = counts.reduce((a, b) => a + b, 0);

    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({ success: true, users });
  } catch (err) {
    console.error("Get all users error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('seller', 'name email');
    res.status(200).json({ success: true, products });
  } catch (err) {
    console.error("Get all products error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('courier', 'name email')
      .populate({
        path: 'items.product',
        populate: {
          path: 'seller',
          select: 'name email'
        }
      });

    res.status(200).json({ success: true, orders });
  } catch (err) {
    console.error('Get all orders error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
export const getAllCouriers = async (req, res) => {
  try {
    const couriers = await User.find({ role: 'Courier' }).select('-password');
    res.status(200).json({ success: true, couriers });
  } catch (err) {
    console.error('Error fetching couriers:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
