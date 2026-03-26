const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');

// Process chat message
router.post('/message', chatbotController.processChatMessage);

// Get quick actions
router.get('/quick-actions', chatbotController.getQuickActions);

module.exports = router;
