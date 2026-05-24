// src/jobs/cronJobs.js
const cron = require('node-cron');
const nasaService = require('../services/nasaService');
const spacexService = require('../services/spacexService');
const issService = require('../services/issService');
const newsService = require('../services/newsService');
const cache = require('../utils/cache');

const initCronJobs = () => {
  console.log('⏰ Cron jobs initialized');

  // Pre-warm APOD cache every day at midnight UTC
  cron.schedule('0 0 * * *', async () => {
    try {
      cache.del('apod_today_1');
      await nasaService.getAPOD();
      console.log('✅ APOD cache refreshed');
    } catch (err) {
      console.error('❌ APOD cron failed:', err.message);
    }
  });

  // Refresh SpaceX upcoming launches every hour
  cron.schedule('0 * * * *', async () => {
    try {
      cache.del('spacex_upcoming');
      await spacexService.getUpcomingLaunches();
      console.log('✅ SpaceX cache refreshed');
    } catch (err) {
      console.error('❌ SpaceX cron failed:', err.message);
    }
  });

  // Refresh space news every 30 minutes
  cron.schedule('*/30 * * * *', async () => {
    try {
      cache.del('news_articles_12_0_');
      await newsService.getArticles({ limit: 12 });
      console.log('✅ News cache refreshed');
    } catch (err) {
      console.error('❌ News cron failed:', err.message);
    }
  });

  // Refresh asteroid data every 6 hours
  cron.schedule('0 */6 * * *', async () => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      cache.del(`asteroids_${today}_${today}`);
      await nasaService.getAsteroids();
      console.log('✅ Asteroid cache refreshed');
    } catch (err) {
      console.error('❌ Asteroid cron failed:', err.message);
    }
  });

  // Health check log every 5 minutes
  cron.schedule('*/5 * * * *', () => {
    const memMB = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
    console.log(`💚 Health: ${new Date().toUTCString()} | Cache: ${cache.size()} keys | Mem: ${memMB}MB`);
  });
};

module.exports = initCronJobs;
