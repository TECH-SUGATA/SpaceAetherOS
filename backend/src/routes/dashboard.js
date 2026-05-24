// src/routes/dashboard.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const ctrl = require('../controllers/dashboardController');

// Public
router.get('/summary', ctrl.getSummary);

// Protected
router.get('/user', protect, ctrl.getUserDashboard);
router.get('/favorites', protect, ctrl.getFavorites);
router.post('/favorites', protect, ctrl.addFavorite);
router.delete('/favorites/:launchId', protect, ctrl.removeFavorite);
router.get('/missions', protect, ctrl.getMissions);
router.post('/missions', protect, ctrl.saveMission);
router.delete('/missions/:id', protect, ctrl.deleteMission);
router.get('/notifications', protect, ctrl.getNotifications);
router.put('/notifications/read', protect, ctrl.markRead);

module.exports = router;
