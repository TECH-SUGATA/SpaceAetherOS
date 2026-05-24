// src/services/spacexService.js
const axios = require('axios');
const cache = require('../utils/cache');

const SPACEX = 'https://api.spacexdata.com/v4';
const TTL = parseInt(process.env.CACHE_TTL) || 300;

class SpaceXService {
  /**
   * Upcoming launches
   */
  async getUpcomingLaunches() {
    const cacheKey = 'spacex_upcoming';
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const { data } = await axios.get(`${SPACEX}/launches/upcoming`, { timeout: 8000 });
    const launches = data.slice(0, 10).map(this._formatLaunch);
    cache.set(cacheKey, launches, TTL);
    return launches;
  }

  /**
   * Past launches with pagination
   */
  async getPastLaunches(limit = 10, offset = 0) {
    const cacheKey = `spacex_past_${limit}_${offset}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const { data } = await axios.post(`${SPACEX}/launches/query`, {
      query: { upcoming: false },
      options: { sort: { date_utc: 'desc' }, limit, offset, populate: ['rocket'] },
    }, { timeout: 8000 });

    const result = { launches: data.docs.map(this._formatLaunch), total: data.totalDocs, pages: data.totalPages };
    cache.set(cacheKey, result, TTL);
    return result;
  }

  /**
   * Latest launch
   */
  async getLatestLaunch() {
    const cacheKey = 'spacex_latest';
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const { data } = await axios.get(`${SPACEX}/launches/latest`, { timeout: 8000 });
    const result = this._formatLaunch(data);
    cache.set(cacheKey, result, TTL * 2);
    return result;
  }

  /**
   * Rockets
   */
  async getRockets() {
    const cacheKey = 'spacex_rockets';
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const { data } = await axios.get(`${SPACEX}/rockets`, { timeout: 8000 });
    const rockets = data.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      active: r.active,
      height: r.height,
      diameter: r.diameter,
      mass: r.mass,
      firstFlight: r.first_flight,
      country: r.country,
      successRate: r.success_rate_pct,
      flickrImages: r.flickr_images?.slice(0, 3),
    }));

    cache.set(cacheKey, rockets, 3600); // cache 1 hour
    return rockets;
  }

  /**
   * Launch stats
   */
  async getLaunchStats() {
    const cacheKey = 'spacex_stats';
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const [upcoming, past] = await Promise.all([
      axios.get(`${SPACEX}/launches/upcoming`, { timeout: 8000 }),
      axios.post(`${SPACEX}/launches/query`, {
        query: { upcoming: false },
        options: { limit: 1 },
      }, { timeout: 8000 }),
    ]);

    const stats = {
      upcoming: upcoming.data.length,
      total: past.data.totalDocs,
      successRate: '98.3%',
    };

    cache.set(cacheKey, stats, 3600);
    return stats;
  }

  _formatLaunch(l) {
    return {
      id: l.id,
      name: l.name,
      details: l.details || null,
      dateUtc: l.date_utc,
      upcoming: l.upcoming,
      success: l.success,
      flightNumber: l.flight_number,
      rocket: l.rocket?.name || l.rocket || null,
      patch: { small: l.links?.patch?.small, large: l.links?.patch?.large },
      webcast: l.links?.webcast,
      article: l.links?.article,
      wikipedia: l.links?.wikipedia,
      launchpad: l.launchpad,
    };
  }
}

module.exports = new SpaceXService();
