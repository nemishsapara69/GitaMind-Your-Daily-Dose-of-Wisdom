const Product = require('../models/Product');
const Category = require('../models/Category'); // Needed to validate category ID

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
    try {
        // Populate 'category' to get category name and slug instead of just ID
        const products = await Product.find().populate('category', 'name slug');
        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category', 'name slug');
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error(`Error fetching product ${req.params.id}:`, error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
    try {
        // Validate if category exists before creating product
        const categoryExists = await Category.findById(req.body.category);
        if (!categoryExists) {
            return res.status(400).json({ success: false, message: 'Invalid Category ID provided' });
        }

        const product = await Product.create(req.body);
        res.status(201).json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('Error creating product:', error);
        if (error.code === 11000) { // Duplicate key error for unique fields (like slug)
            return res.status(400).json({ success: false, message: `Duplicate field value: ${Object.keys(error.keyValue)[0]} already exists.` });
        }
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }
        res.status(500).json({ success: false, message: 'Server error during product creation' });
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // If category is being updated, validate it
        if (req.body.category) {
            const categoryExists = await Category.findById(req.body.category);
            if (!categoryExists) {
                return res.status(400).json({ success: false, message: 'Invalid Category ID provided' });
            }
        }

        // Generate new slug if name is changed
        if (req.body.name && req.body.name !== product.name) {
            req.body.slug = req.body.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        }

        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Return the updated document
            runValidators: true // Run Mongoose validators
        });

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error(`Error updating product ${req.params.id}:`, error);
        if (error.code === 11000) { // Duplicate key error
            return res.status(400).json({ success: false, message: `Duplicate field value: ${Object.keys(error.keyValue)[0]} already exists.` });
        }
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }
        res.status(500).json({ success: false, message: 'Server error during product update' });
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        await product.deleteOne(); // Mongoose 6+ method for deleting a document

        res.status(200).json({
            success: true,
            data: {} // Respond with empty object or success message
        });
    } catch (error) {
        console.error(`Error deleting product ${req.params.id}:`, error);
        res.status(500).json({ success: false, message: 'Server error during product deletion' });
    }
};