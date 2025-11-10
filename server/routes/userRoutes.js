const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); // Make sure this path is correct
const authController = require('../controllers/authController'); // Make sure this path is correct
const { protect } = require('../middleware/authMiddleware'); // For protected routes

// Get and Update user profile
router.route('/profile')
    .get(protect, userController.getUserProfile)
    .put(protect, userController.updateUserProfile);

// Change user password (specific endpoint for this important action)
router.put('/change-password', protect, authController.changePassword);

module.exports = router;