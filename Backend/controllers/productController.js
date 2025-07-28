import Product from '../models/productModel.js';

export const addProduct = async (req, res) => {
    try {
        if (req.user.role !== 'Seller') {
            return res.status(403).json({ message: 'Only sellers can add products' });
        }

        const product = await Product.create({
            ...req.body,
            seller: req.user._id,
        });
        const populatedProduct = await Product.findById(product._id).populate('seller', 'name');

        res.status(201).json({ success: true, product: populatedProduct });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Get all products
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('seller', 'name');

        res.json({ success: true, products });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
