// src/routes/news.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/newsController');
router.get('/', ctrl.getArticles);
router.get('/blogs', ctrl.getBlogs);
router.get('/reports', ctrl.getReports);
module.exports = router;
