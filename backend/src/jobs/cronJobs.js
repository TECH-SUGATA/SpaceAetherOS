// src/jobs/cronJobs.js
const cron = require('node-cron');
const nasaService = require('../services/nasaService');
const spacexService = require('../services/spacexService');
const issService = require('../services/issService');
const newsService = require('../services/newsService');
const passPredictorService = require('../services/passPredictorService');
const PassSubscription = require('../models/PassSubscription');
const Notification = require('../models/Notification');
const cache = require('../utils/cache');

const initCronJobs = (io = null) => {
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

  // ── ISS PASS NOTIFICATIONS ──
  // Every 5 minutes: for each active subscription, predict passes and fire a
  // notification once a pass enters the user's configured lead-time window.
  // lastNotifiedPassAt de-dupes so the same pass doesn't notify twice.
  cron.schedule('*/5 * * * *', async () => {
    try {
      const subs = await PassSubscription.find({ active: true });
      if (subs.length === 0) return;

      let notified = 0;
      for (const sub of subs) {
        try {
          const prediction = await passPredictorService.predictPasses(sub.lat, sub.lon, sub.altMeters, {
            hoursAhead: 6, // only need the near-term window for alerting
            minElevationDeg: sub.minElevationDeg,
          });

          const nextPass = prediction.passes[0];
          if (!nextPass) continue;

          const riseTime = new Date(nextPass.rise).getTime();
          const minutesUntilRise = (riseTime - Date.now()) / 60000;
          const alreadyNotified = sub.lastNotifiedPassAt &&
            new Date(sub.lastNotifiedPassAt).getTime() === riseTime;

          if (
            minutesUntilRise > 0 &&
            minutesUntilRise <= sub.notifyMinutesBefore &&
            !alreadyNotified
          ) {
            const message = `ISS visible from ${sub.label} in ~${Math.round(minutesUntilRise)} min — ` +
              `max elevation ${nextPass.maxElevationDeg}° (${nextPass.direction}), duration ${nextPass.durationSeconds}s.`;

            const notification = await Notification.create({
              user: sub.user,
              type: 'iss',
              title: '🛰️ ISS Pass Incoming',
              message,
              priority: nextPass.maxElevationDeg >= 45 ? 'high' : 'medium',
              data: { pass: nextPass, subscriptionId: sub._id },
            });

            sub.lastNotifiedPassAt = new Date(nextPass.rise);
            await sub.save();

            if (io) io.sendUserNotification(String(sub.user), notification);
            notified += 1;
          }
        } catch (innerErr) {
          console.error(`❌ Pass check failed for subscription ${sub._id}:`, innerErr.message);
        }
      }
      if (notified > 0) console.log(`🛰️ ISS pass notifications sent: ${notified}`);
    } catch (err) {
      console.error('❌ ISS pass-notification cron failed:', err.message);
    }
  });
};

module.exports = initCronJobs;
