// src/routes/nasa.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/nasaController');

router.get('/apod', ctrl.getAPOD);
router.get('/mars', ctrl.getMarsPhotos);
router.get('/asteroids', ctrl.getAsteroids);
router.get('/images', ctrl.searchImages);

module.exports = router;
