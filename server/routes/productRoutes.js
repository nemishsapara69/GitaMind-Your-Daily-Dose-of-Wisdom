const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware'); // Import middleware

// Public routes (Anyone can view products)
router.get('/', productController.getProducts);
router.get('/:id', productController.getProduct);

// Admin-only routes (Authenticated users with 'admin' role) for CUD operations
router.post('/', protect, authorize('admin'), productController.createProduct);
router.put('/:id', protect, authorize('admin'), productController.updateProduct);
router.delete('/:id', protect, authorize('admin'), productController.deleteProduct);

module.exports = router;