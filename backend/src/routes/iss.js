// src/routes/iss.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/issController');
const { protect } = require('../middleware/auth');

router.get('/position', ctrl.getPosition);
router.get('/crew', ctrl.getCrew);
router.get('/pass', ctrl.getPassTimes);

// Real SGP4-based visibility prediction
router.get('/pass/predict', ctrl.getVisiblePasses);

// Saved locations for pass notifications (auth required)
router.get('/pass/subscriptions', protect, ctrl.listSubscriptions);
router.post('/pass/subscriptions', protect, ctrl.createSubscription);
router.delete('/pass/subscriptions/:id', protect, ctrl.deleteSubscription);

module.exports = router;
