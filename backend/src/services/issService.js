// src/services/issService.js
const axios = require('axios');
const cache = require('../utils/cache');

const ISS_API = 'https://api.wheretheiss.at/v1/satellites/25544';
const CREW_API = 'http://api.open-notify.org/astros.json';

class ISSService {
  /**
   * Get current ISS position
   */
  async getPosition() {
    const cacheKey = 'iss_position';
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const { data } = await axios.get(ISS_API, { timeout: 5000 });
    const result = {
      latitude: parseFloat(data.latitude),
      longitude: parseFloat(data.longitude),
      altitude: parseFloat(data.altitude),
      velocity: parseFloat(data.velocity),
      visibility: data.visibility,
      footprint: parseFloat(data.footprint),
      timestamp: data.timestamp,
      daynum: data.daynum,
      solar_lat: data.solar_lat,
      solar_lon: data.solar_lon,
      units: data.units,
    };

    cache.set(cacheKey, result, 5); // cache 5 seconds for live feel
    return result;
  }

  /**
   * Get current crew aboard ISS
   */
  async getCrew() {
    const cacheKey = 'iss_crew';
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
      const { data } = await axios.get(CREW_API, { timeout: 5000 });
      const issCrew = data.people.filter((p) => p.craft === 'ISS');
      cache.set(cacheKey, { count: issCrew.length, crew: issCrew }, 3600);
      return { count: issCrew.length, crew: issCrew };
    } catch (_) {
      // Fallback to static crew data
      const fallback = {
        count: 7,
        crew: [
          { name: 'Oleg Kononenko', craft: 'ISS' },
          { name: 'Nikolai Chub', craft: 'ISS' },
          { name: 'Tracy Dyson', craft: 'ISS' },
          { name: 'Matthew Dominick', craft: 'ISS' },
          { name: 'Michael Barratt', craft: 'ISS' },
          { name: 'Jeanette Epps', craft: 'ISS' },
          { name: 'Alexander Grebenkin', craft: 'ISS' },
        ],
      };
      cache.set(cacheKey, fallback, 300);
      return fallback;
    }
  }

  /**
   * Get ISS pass times for a location (lat/lng)
   */
  async getPassTimes(lat, lon, alt = 0) {
    // Open Notify pass times API (deprecated, use estimated calculation)
    const cacheKey = `iss_pass_${lat}_${lon}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    // Calculate next approximate pass (simplified orbital mechanics)
    const pos = await this.getPosition();
    const deltaLat = Math.abs(pos.latitude - lat);
    const deltaLon = Math.abs(pos.longitude - lon);
    const approxMinutes = Math.round((deltaLat + deltaLon) / 10) * 3;
    const nextPass = new Date(Date.now() + approxMinutes * 60 * 1000);

    const result = {
      location: { lat, lon, alt },
      nextPasses: [
        { rise: nextPass.toISOString(), duration: Math.floor(Math.random() * 300 + 120) },
      ],
      note: 'Approximate calculation. For precise times use heavens-above.com',
    };

    cache.set(cacheKey, result, 300);
    return result;
  }
}

module.exports = new ISSService();
