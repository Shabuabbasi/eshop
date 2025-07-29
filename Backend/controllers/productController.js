import Product from '../models/productModel.js';

export const addProduct = async (req, res) => {
    try {
        if (req.user.role !== 'Seller') {
            return res.status(403).json({ message: 'Only sellers can add products' });
        }

        const { name, description, price, stock } = req.body;
        const categories = req.body.category;

        if (!req.file) {
            return res.status(400).json({ message: 'Image is required' });
        }

        const imagePath = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        const product = await Product.create({
            name,
            description,
            price,
            stock,
            image: imagePath,
            category: Array.isArray(categories) ? categories : [categories],
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
