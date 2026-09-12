// src/controllers/issController.js
const issService = require('../services/issService');
const passPredictorService = require('../services/passPredictorService');
const PassSubscription = require('../models/PassSubscription');
const { successResponse, errorResponse } = require('../utils/apiResponse');

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

/**
 * Real SGP4-based visible pass prediction (see services/passPredictorService.js).
 * Replaces the crude lat/lon-delta heuristic in getPassTimes above with actual
 * orbital propagation and topocentric look angles.
 */
exports.getVisiblePasses = async (req, res, next) => {
  try {
    const { lat, lon, alt = 0, hours = 48, minElevation = 10 } = req.query;
    if (lat === undefined || lon === undefined) {
      return errorResponse(res, 'lat and lon query params are required.', 400);
    }
    const latN = parseFloat(lat);
    const lonN = parseFloat(lon);
    if (Number.isNaN(latN) || Number.isNaN(lonN) || latN < -90 || latN > 90 || lonN < -180 || lonN > 180) {
      return errorResponse(res, 'lat/lon out of valid range.', 400);
    }

    const data = await passPredictorService.predictPasses(latN, lonN, parseFloat(alt), {
      hoursAhead: Math.min(parseFloat(hours) || 48, 168), // cap at 7 days
      minElevationDeg: parseFloat(minElevation) || 10,
    });
    return successResponse(res, data, 'Visible ISS passes predicted.');
  } catch (err) { next(err); }
};

// ── Pass-notification subscriptions (requires auth) ──

exports.listSubscriptions = async (req, res, next) => {
  try {
    const subs = await PassSubscription.find({ user: req.user._id }).sort('-createdAt');
    return successResponse(res, subs, 'Subscriptions retrieved.');
  } catch (err) { next(err); }
};

exports.createSubscription = async (req, res, next) => {
  try {
    const { label, lat, lon, altMeters = 0, minElevationDeg = 20, notifyMinutesBefore = 15 } = req.body;
    if (lat === undefined || lon === undefined) {
      return errorResponse(res, 'lat and lon are required.', 400);
    }
    const sub = await PassSubscription.create({
      user: req.user._id,
      label,
      lat,
      lon,
      altMeters,
      minElevationDeg,
      notifyMinutesBefore,
    });
    return successResponse(res, sub, 'Pass notification subscription created.', 201);
  } catch (err) { next(err); }
};

exports.deleteSubscription = async (req, res, next) => {
  try {
    const sub = await PassSubscription.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!sub) return errorResponse(res, 'Subscription not found.', 404);
    return successResponse(res, null, 'Subscription removed.');
  } catch (err) { next(err); }
};
