// src/utils/metrics.js
// Lightweight in-process metrics collector — no extra packages needed.
// Tracks: HTTP request latency (per route), external API call latency
// (per provider), cache hit/miss counts, and Socket.io broadcast latency.
// Exposed via GET /api/metrics for the paper's evaluation section.

const MAX_SAMPLES = 500; // ring-buffer size per bucket, keeps memory bounded

class RollingWindow {
  constructor(maxSize = MAX_SAMPLES) {
    this.maxSize = maxSize;
    this.samples = [];
  }

  push(value) {
    this.samples.push(value);
    if (this.samples.length > this.maxSize) this.samples.shift();
  }

  percentile(p) {
    if (this.samples.length === 0) return 0;
    const sorted = [...this.samples].sort((a, b) => a - b);
    const idx = Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length));
    return sorted[idx];
  }

  avg() {
    if (this.samples.length === 0) return 0;
    return this.samples.reduce((a, b) => a + b, 0) / this.samples.length;
  }

  min() {
    return this.samples.length ? Math.min(...this.samples) : 0;
  }

  max() {
    return this.samples.length ? Math.max(...this.samples) : 0;
  }

  count() {
    return this.samples.length;
  }

  summary() {
    return {
      count: this.count(),
      avgMs: round(this.avg()),
      p50Ms: round(this.percentile(50)),
      p95Ms: round(this.percentile(95)),
      p99Ms: round(this.percentile(99)),
      minMs: round(this.min()),
      maxMs: round(this.max()),
    };
  }
}

const round = (n) => Math.round(n * 100) / 100;

class Metrics {
  constructor() {
    this.startedAt = Date.now();
    this.httpRoutes = new Map(); // "METHOD path" -> RollingWindow
    this.httpStatusCounts = new Map(); // statusCode -> count
    this.externalApis = new Map(); // provider name -> RollingWindow
    this.socketBroadcasts = new RollingWindow();
    this.cache = { hits: 0, misses: 0, sets: 0 };
    this.requestCount = 0;
    this.errorCount = 0;
  }

  // ── HTTP request timing (per-route) ──
  recordHttpRequest(method, routePath, ms, statusCode) {
    this.requestCount += 1;
    const key = `${method} ${routePath}`;
    if (!this.httpRoutes.has(key)) this.httpRoutes.set(key, new RollingWindow());
    this.httpRoutes.get(key).push(ms);

    this.httpStatusCounts.set(statusCode, (this.httpStatusCounts.get(statusCode) || 0) + 1);
    if (statusCode >= 500) this.errorCount += 1;
  }

  // ── External API call timing (NASA, SpaceX, ISS, News, Gemini) ──
  recordExternalCall(provider, ms) {
    if (!this.externalApis.has(provider)) this.externalApis.set(provider, new RollingWindow());
    this.externalApis.get(provider).push(ms);
  }

  // ── Cache instrumentation ──
  recordCacheHit() {
    this.cache.hits += 1;
  }

  recordCacheMiss() {
    this.cache.misses += 1;
  }

  recordCacheSet() {
    this.cache.sets += 1;
  }

  // ── Socket.io broadcast latency (time to fetch + emit) ──
  recordSocketBroadcast(ms) {
    this.socketBroadcasts.push(ms);
  }

  // ── Snapshot for /api/metrics ──
  snapshot() {
    const routes = {};
    for (const [key, window] of this.httpRoutes.entries()) routes[key] = window.summary();

    const external = {};
    for (const [key, window] of this.externalApis.entries()) external[key] = window.summary();

    const totalCacheOps = this.cache.hits + this.cache.misses;
    const hitRate = totalCacheOps > 0 ? round((this.cache.hits / totalCacheOps) * 100) : 0;

    const statusCounts = {};
    for (const [code, count] of this.httpStatusCounts.entries()) statusCounts[code] = count;

    return {
      uptimeSeconds: Math.floor((Date.now() - this.startedAt) / 1000),
      totals: {
        requests: this.requestCount,
        errors: this.errorCount,
        errorRatePct: this.requestCount ? round((this.errorCount / this.requestCount) * 100) : 0,
      },
      httpStatusCounts: statusCounts,
      httpRoutes: routes,
      externalApiLatency: external,
      socketBroadcastLatency: this.socketBroadcasts.summary(),
      cache: {
        hits: this.cache.hits,
        misses: this.cache.misses,
        sets: this.cache.sets,
        hitRatePct: hitRate,
      },
      generatedAt: new Date().toISOString(),
    };
  }
}

module.exports = new Metrics();