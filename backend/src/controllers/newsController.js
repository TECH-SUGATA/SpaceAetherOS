// src/controllers/newsController.js
const newsService = require('../services/newsService');
const { successResponse } = require('../utils/apiResponse');

exports.getArticles = async (req, res, next) => {
  try {
    const { limit = 12, offset = 0, search = '' } = req.query;
    const data = await newsService.getArticles({ limit: parseInt(limit), offset: parseInt(offset), search });
    return successResponse(res, data, 'News articles retrieved.');
  } catch (err) { next(err); }
};

exports.getBlogs = async (req, res, next) => {
  try {
    const { limit = 6 } = req.query;
    const data = await newsService.getBlogs({ limit: parseInt(limit) });
    return successResponse(res, data, 'Blog posts retrieved.');
  } catch (err) { next(err); }
};

exports.getReports = async (req, res, next) => {
  try {
    const { limit = 4 } = req.query;
    const data = await newsService.getReport({ limit: parseInt(limit) });
    return successResponse(res, data, 'Reports retrieved.');
  } catch (err) { next(err); }
};
