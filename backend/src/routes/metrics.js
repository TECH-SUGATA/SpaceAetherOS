// src/routes/metrics.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/metricsController');

router.get('/', ctrl.getMetrics);

module.exports = router;
