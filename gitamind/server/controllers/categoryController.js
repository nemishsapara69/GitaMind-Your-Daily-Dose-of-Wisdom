const Category = require('../models/Category');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public (or Protected if you want only logged-in users)
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
exports.getCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
        res.status(200).json({
            success: true,
            data: category
        });
    } catch (error) {
        console.error(`Error fetching category ${req.params.id}:`, error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Create new category
// @route   POST /api/categories
// @access  Private/Admin
exports.createCategory = async (req, res) => {
    try {
        const category = await Category.create(req.body);
        res.status(201).json({
            success: true,
            data: category
        });
    } catch (error) {
        console.error('Error creating category:', error);
        if (error.code === 11000) { // Duplicate key error for unique fields
            return res.status(400).json({ success: false, message: `Duplicate field value: ${Object.keys(error.keyValue)}` });
        }
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }
        res.status(500).json({ success: false, message: 'Server error during category creation' });
    }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
exports.updateCategory = async (req, res) => {
    try {
        let category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        // Ensure unique slug if name is changed
        if (req.body.name && req.body.name !== category.name) {
            req.body.slug = req.body.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        }

        category = await Category.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Return the updated document
            runValidators: true // Run Mongoose validators
        });

        res.status(200).json({
            success: true,
            data: category
        });
    } catch (error) {
        console.error(`Error updating category ${req.params.id}:`, error);
        if (error.code === 11000) { // Duplicate key error
            return res.status(400).json({ success: false, message: `Duplicate field value: ${Object.keys(error.keyValue)}` });
        }
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }
        res.status(500).json({ success: false, message: 'Server error during category update' });
    }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        await category.deleteOne(); // Mongoose 6+ uses deleteOne() or deleteMany()

        res.status(200).json({
            success: true,
            data: {} // Respond with empty object or success message
        });
    } catch (error) {
        console.error(`Error deleting category ${req.params.id}:`, error);
        res.status(500).json({ success: false, message: 'Server error during category deletion' });
    }
};