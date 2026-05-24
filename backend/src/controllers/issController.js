// src/controllers/issController.js
const issService = require('../services/issService');
const { successResponse } = require('../utils/apiResponse');

exports.getPosition = async (req, res, next) => {
  try {
    const data = await issService.getPosition();
    return successResponse(res, data, 'ISS position retrieved.');
  } catch (err) { next(err); }
};

exports.getCrew = async (req, res, next) => {
  try {
    const data = await issService.getCrew();
    return successResponse(res, data, 'ISS crew retrieved.');
  } catch (err) { next(err); }
};

exports.getPassTimes = async (req, res, next) => {
  try {
    const { lat, lon, alt = 0 } = req.query;
    if (!lat || !lon) return res.status(400).json({ success: false, message: 'lat and lon required.' });
    const data = await issService.getPassTimes(parseFloat(lat), parseFloat(lon), parseFloat(alt));
    return successResponse(res, data, 'Pass times retrieved.');
  } catch (err) { next(err); }
};
