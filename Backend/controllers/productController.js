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
//Get product by ID
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('seller', 'name');
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json({ success: true, product });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getProductsBySeller = async (req, res) => {
    try {
        const { id } = req.params;

        const products = await Product.find({ seller: id }).populate('seller', 'name');

        res.status(200).json({ success: true, products });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
// DELETE product by ID (only seller who owns it)
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) return res.status(404).json({ message: "Product not found" });

        if (product.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to delete this product" });
        }

        await Product.deleteOne({ _id: product._id });

        res.status(200).json({ success: true, message: "Product deleted" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// PUT update product by ID
export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) return res.status(404).json({ message: "Product not found" });

        if (product.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to update this product" });
        }

        const { name, description, price, stock, category } = req.body;

        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.stock = stock || product.stock;

        if (category) {
            product.category = Array.isArray(category) ? category : [category];
        }

        if (req.file) {
            const imagePath = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
            product.image = imagePath;
        }

        const updated = await product.save();
        res.status(200).json({ success: true, product: updated });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
