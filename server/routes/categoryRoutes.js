const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { protect, authorize } = require('../middleware/authMiddleware'); // Import middleware

// Public routes (Anyone can view categories)
router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategory);

// Admin-only routes (Authenticated users with 'admin' role)
// You can also add 'user' if you want users to create categories, but usually it's admin.
router.post('/', protect, authorize('admin'), categoryController.createCategory);
router.put('/:id', protect, authorize('admin'), categoryController.updateCategory);
router.delete('/:id', protect, authorize('admin'), categoryController.deleteCategory);


module.exports = router;