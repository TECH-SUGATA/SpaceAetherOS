// src/controllers/spacexController.js
const spacexService = require('../services/spacexService');
const { successResponse } = require('../utils/apiResponse');

exports.getUpcoming = async (req, res, next) => {
  try {
    const data = await spacexService.getUpcomingLaunches();
    return successResponse(res, data, 'Upcoming launches retrieved.');
  } catch (err) { next(err); }
};

exports.getPast = async (req, res, next) => {
  try {
    const { limit = 10, offset = 0 } = req.query;
    const data = await spacexService.getPastLaunches(parseInt(limit), parseInt(offset));
    return successResponse(res, data, 'Past launches retrieved.');
  } catch (err) { next(err); }
};

exports.getLatest = async (req, res, next) => {
  try {
    const data = await spacexService.getLatestLaunch();
    return successResponse(res, data, 'Latest launch retrieved.');
  } catch (err) { next(err); }
};

exports.getRockets = async (req, res, next) => {
  try {
    const data = await spacexService.getRockets();
    return successResponse(res, data, 'Rockets retrieved.');
  } catch (err) { next(err); }
};

exports.getStats = async (req, res, next) => {
  try {
    const data = await spacexService.getLaunchStats();
    return successResponse(res, data, 'Launch stats retrieved.');
  } catch (err) { next(err); }
};
