const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware'); // Only 'protect' needed for user-specific cart

// All cart routes require user authentication
router.route('/')
    .get(protect, cartController.getUserCart)
    .post(protect, cartController.addItemToCart)
    .delete(protect, cartController.clearCart); // To clear the entire cart

router.route('/:productId')
    .put(protect, cartController.updateCartItemQuantity) // Update quantity of a specific item
    .delete(protect, cartController.removeItemFromCart); // Remove a specific item

module.exports = router;