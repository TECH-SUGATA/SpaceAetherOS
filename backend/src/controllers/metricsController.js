// src/controllers/metricsController.js
const metrics = require('../utils/metrics');
const cache = require('../utils/cache');
const { successResponse } = require('../utils/apiResponse');

exports.getMetrics = async (req, res, next) => {
  try {
    const snapshot = metrics.snapshot();
    snapshot.cacheKeysInMemory = cache.size();
    return successResponse(res, snapshot, 'Metrics snapshot retrieved.');
  } catch (err) { next(err); }
};
