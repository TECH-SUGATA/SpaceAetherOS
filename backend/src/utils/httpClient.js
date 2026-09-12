// src/utils/httpClient.js
// Thin wrapper around axios that records call latency per external provider
// into utils/metrics.js. Drop-in replacement for `require('axios')` — same
// .get/.post/.put/.delete signatures — so services need only change the
// import line.

const axios = require('axios');
const metrics = require('./metrics');

/**
 * Resolve a short provider label from a URL so metrics group sensibly
 * (e.g. "https://api.nasa.gov/..." -> "nasa").
 */
function providerFromUrl(url) {
  try {
    const host = new URL(url).hostname;
    if (host.includes('nasa')) return 'nasa';
    if (host.includes('spacex')) return 'spacex';
    if (host.includes('wheretheiss')) return 'iss-position';
    if (host.includes('open-notify')) return 'iss-crew';
    if (host.includes('spaceflightnewsapi')) return 'spaceflight-news';
    if (host.includes('celestrak')) return 'celestrak-tle';
    if (host.includes('generativelanguage') || host.includes('gemini')) return 'gemini';
    return host;
  } catch (_) {
    return 'unknown';
  }
}

async function timed(method, url, ...rest) {
  const provider = providerFromUrl(url);
  const start = Date.now();
  try {
    const result = await axios[method](url, ...rest);
    metrics.recordExternalCall(provider, Date.now() - start);
    return result;
  } catch (err) {
    metrics.recordExternalCall(`${provider}:error`, Date.now() - start);
    throw err;
  }
}

module.exports = {
  get: (url, config) => timed('get', url, config),
  post: (url, data, config) => timed('post', url, data, config),
  put: (url, data, config) => timed('put', url, data, config),
  delete: (url, config) => timed('delete', url, config),
};
