// src/routes/spacex.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/spacexController');
router.get('/upcoming', ctrl.getUpcoming);
router.get('/past', ctrl.getPast);
router.get('/latest', ctrl.getLatest);
router.get('/rockets', ctrl.getRockets);
router.get('/stats', ctrl.getStats);
module.exports = router;
