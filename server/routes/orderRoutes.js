const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

// --- Admin Specific Routes (place first to avoid conflicts for general GET /api/orders) ---
// Get all orders (Admin only)
router.get('/', protect, authorize('admin'), orderController.getAllOrders);

// --- User Specific Routes ---
// Place a new order (from cart)
router.post('/', protect, orderController.placeOrder);

// Get logged-in user's orders
router.get('/myorders', protect, orderController.getMyOrders);

// Get a specific order by ID (owner or admin)
router.get('/:id', protect, orderController.getOrderById);

// Admin routes for updating order status
router.put('/:id/pay', protect, authorize('admin'), orderController.updateOrderToPaid);
router.put('/:id/deliver', protect, authorize('admin'), orderController.updateOrderToDelivered);

module.exports = router;