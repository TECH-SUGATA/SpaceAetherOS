// src/routes/iss.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/issController');
router.get('/position', ctrl.getPosition);
router.get('/crew', ctrl.getCrew);
router.get('/pass', ctrl.getPassTimes);
module.exports = router;
