// src/services/newsService.js
const axios = require('axios');
const cache = require('../utils/cache');

const NEWS_API = 'https://api.spaceflightnewsapi.net/v4';
const TTL = parseInt(process.env.CACHE_TTL) || 300;

class NewsService {
  async getArticles({ limit = 12, offset = 0, search = '' } = {}) {
    const cacheKey = `news_articles_${limit}_${offset}_${search}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const params = { limit, offset, ...(search && { search }) };
    const { data } = await axios.get(`${NEWS_API}/articles`, { params, timeout: 8000 });

    const result = {
      total: data.count,
      articles: (data.results || []).map((a) => ({
        id: a.id,
        title: a.title,
        summary: a.summary,
        url: a.url,
        imageUrl: a.image_url,
        newsSite: a.news_site,
        publishedAt: a.published_at,
        updatedAt: a.updated_at,
      })),
    };

    cache.set(cacheKey, result, TTL);
    return result;
  }

  async getBlogs({ limit = 6 } = {}) {
    const cacheKey = `news_blogs_${limit}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const { data } = await axios.get(`${NEWS_API}/blogs`, { params: { limit }, timeout: 8000 });
    const result = (data.results || []).map((b) => ({
      id: b.id,
      title: b.title,
      summary: b.summary,
      url: b.url,
      imageUrl: b.image_url,
      newsSite: b.news_site,
      publishedAt: b.published_at,
    }));

    cache.set(cacheKey, result, TTL);
    return result;
  }

  async getReport({ limit = 4 } = {}) {
    const cacheKey = `news_reports_${limit}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const { data } = await axios.get(`${NEWS_API}/reports`, { params: { limit }, timeout: 8000 });
    const result = (data.results || []).map((r) => ({
      id: r.id,
      title: r.title,
      url: r.url,
      imageUrl: r.image_url,
      newsSite: r.news_site,
      publishedAt: r.published_at,
    }));

    cache.set(cacheKey, result, TTL);
    return result;
  }
}

module.exports = new NewsService();
