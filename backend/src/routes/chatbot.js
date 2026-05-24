// src/routes/chatbot.js
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { optionalAuth, protect } = require('../middleware/auth');
const { chatLimiter } = require('../middleware/rateLimiter');
const ctrl = require('../controllers/chatbotController');

router.post('/',
  chatLimiter,
  optionalAuth,
  validate([body('message').trim().notEmpty().withMessage('Message required').isLength({ max: 1000 }).withMessage('Message too long')]),
  ctrl.sendMessage
);
router.get('/history', protect, ctrl.getHistory);
router.delete('/session/:sessionId', protect, ctrl.deleteSession);

module.exports = router;
