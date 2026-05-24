// src/services/nasaService.js
const axios = require('axios');
const cache = require('../utils/cache');

const NASA_BASE = 'https://api.nasa.gov';
const KEY = () => process.env.NASA_API_KEY || 'DEMO_KEY';
const TTL = parseInt(process.env.CACHE_TTL) || 300;

class NASAService {
  /**
   * Astronomy Picture of the Day
   */
  async getAPOD(date = null, count = null) {
    const cacheKey = `apod_${date || 'today'}_${count || 1}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const params = { api_key: KEY() };
    if (date) params.date = date;
    if (count) params.count = Math.min(count, 12);

    const { data } = await axios.get(`${NASA_BASE}/planetary/apod`, { params, timeout: 8000 });
    cache.set(cacheKey, data, TTL);
    return data;
  }

  /**
   * Mars Rover Photos
   */
  async getMarsRoverPhotos({ rover = 'curiosity', sol = 1000, camera = null, page = 1 } = {}) {
    const cacheKey = `mars_${rover}_${sol}_${camera}_${page}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const params = { sol, page, api_key: KEY() };
    if (camera) params.camera = camera;

    const { data } = await axios.get(`${NASA_BASE}/mars-photos/api/v1/rovers/${rover}/photos`, { params, timeout: 10000 });
    cache.set(cacheKey, data, TTL);
    return data;
  }

  /**
   * Near-Earth Objects (Asteroids)
   */
  async getAsteroids(startDate = null, endDate = null) {
    const today = new Date().toISOString().slice(0, 10);
    const start = startDate || today;
    const end = endDate || today;
    const cacheKey = `asteroids_${start}_${end}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const { data } = await axios.get(`${NASA_BASE}/neo/rest/v1/feed`, {
      params: { start_date: start, end_date: end, api_key: KEY() },
      timeout: 10000,
    });

    // Flatten and enrich
    const allNeos = Object.values(data.near_earth_objects || {}).flat();
    const result = {
      total: data.element_count || allNeos.length,
      dateRange: { start, end },
      hazardous: allNeos.filter((n) => n.is_potentially_hazardous_asteroid).length,
      objects: allNeos.map((n) => ({
        id: n.id,
        name: n.name,
        diameter: n.estimated_diameter?.kilometers,
        isHazardous: n.is_potentially_hazardous_asteroid,
        closestApproach: n.close_approach_data?.[0]
          ? {
              date: n.close_approach_data[0].close_approach_date,
              missDistanceKm: n.close_approach_data[0].miss_distance?.kilometers,
              velocityKmS: n.close_approach_data[0].relative_velocity?.kilometers_per_second,
            }
          : null,
      })),
    };

    cache.set(cacheKey, result, TTL);
    return result;
  }

  /**
   * NASA Image and Video Library search
   */
  async searchImages(query = 'galaxy', page = 1) {
    const cacheKey = `nasa_images_${query}_${page}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const { data } = await axios.get('https://images-api.nasa.gov/search', {
      params: { q: query, media_type: 'image', page },
      timeout: 8000,
    });

    const items = (data.collection?.items || []).slice(0, 20).map((item) => ({
      id: item.data?.[0]?.nasa_id,
      title: item.data?.[0]?.title,
      description: item.data?.[0]?.description,
      date: item.data?.[0]?.date_created,
      imageUrl: item.links?.[0]?.href,
    }));

    cache.set(cacheKey, items, TTL);
    return items;
  }
}

module.exports = new NASAService();
