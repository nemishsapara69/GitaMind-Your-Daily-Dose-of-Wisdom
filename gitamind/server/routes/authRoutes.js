const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // Import the controller

// Public Routes
router.post('/register', authController.registerUser); // Route for user signup
router.post('/login', authController.loginUser);     // Route for user login

module.exports = router;