// src/middleware/requestTimer.js
// Records per-route latency and status code for every request.
// Route is grouped by req.route.path (falls back to req.path) so
// "/api/nasa/apod?date=x" and "/api/nasa/apod?date=y" collapse into
// one bucket instead of exploding the metrics map.

const metrics = require('../utils/metrics');

const requestTimer = (req, res, next) => {
  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const end = process.hrtime.bigint();
    const ms = Number(end - start) / 1e6;
    const routePath = req.route?.path
      ? `${req.baseUrl}${req.route.path}`
      : req.path;
    metrics.recordHttpRequest(req.method, routePath, ms, res.statusCode);
  });

  next();
};

module.exports = requestTimer;
