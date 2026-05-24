// src/controllers/dashboardController.js
const issService = require('../services/issService');
const spacexService = require('../services/spacexService');
const nasaService = require('../services/nasaService');
const newsService = require('../services/newsService');
const FavoriteLaunch = require('../models/FavoriteLaunch');
const SavedMission = require('../models/SavedMission');
const Notification = require('../models/Notification');
const { successResponse } = require('../utils/apiResponse');

// Full dashboard summary in one request
exports.getSummary = async (req, res, next) => {
  try {
    const [issPos, upcoming, apod, news] = await Promise.allSettled([
      issService.getPosition(),
      spacexService.getUpcomingLaunches(),
      nasaService.getAPOD(),
      newsService.getArticles({ limit: 4 }),
    ]);

    const summary = {
      iss: issPos.status === 'fulfilled' ? issPos.value : null,
      upcomingLaunches: upcoming.status === 'fulfilled' ? upcoming.value.slice(0, 3) : [],
      apod: apod.status === 'fulfilled' ? apod.value : null,
      latestNews: news.status === 'fulfilled' ? news.value.articles?.slice(0, 4) : [],
      stats: {
        activeSatellites: 8432,
        neoThreats: 0,
        deepSpaceProbes: 14,
        networkLatency: '12ms',
      },
      generatedAt: new Date().toISOString(),
    };

    return successResponse(res, summary, 'Dashboard summary retrieved.');
  } catch (err) { next(err); }
};

// User-specific dashboard (requires auth)
exports.getUserDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const [favorites, missions, notifications] = await Promise.all([
      FavoriteLaunch.find({ user: userId }).sort({ createdAt: -1 }).limit(5),
      SavedMission.find({ user: userId }).sort({ createdAt: -1 }).limit(5),
      Notification.find({ user: userId, read: false }).sort({ createdAt: -1 }).limit(10),
    ]);

    return successResponse(res, {
      favorites,
      missions,
      notifications,
      unreadCount: notifications.length,
    }, 'User dashboard retrieved.');
  } catch (err) { next(err); }
};

// Favorites
exports.addFavorite = async (req, res, next) => {
  try {
    const fav = await FavoriteLaunch.create({ user: req.user._id, ...req.body });
    return successResponse(res, fav, 'Launch bookmarked.', 201);
  } catch (err) { next(err); }
};

exports.removeFavorite = async (req, res, next) => {
  try {
    await FavoriteLaunch.findOneAndDelete({ user: req.user._id, launchId: req.params.launchId });
    return successResponse(res, null, 'Bookmark removed.');
  } catch (err) { next(err); }
};

exports.getFavorites = async (req, res, next) => {
  try {
    const favs = await FavoriteLaunch.find({ user: req.user._id }).sort({ createdAt: -1 });
    return successResponse(res, favs, 'Favorites retrieved.');
  } catch (err) { next(err); }
};

// Saved Missions
exports.saveMission = async (req, res, next) => {
  try {
    const mission = await SavedMission.create({ user: req.user._id, ...req.body });
    return successResponse(res, mission, 'Mission saved.', 201);
  } catch (err) { next(err); }
};

exports.getMissions = async (req, res, next) => {
  try {
    const missions = await SavedMission.find({ user: req.user._id }).sort({ createdAt: -1 });
    return successResponse(res, missions, 'Saved missions retrieved.');
  } catch (err) { next(err); }
};

exports.deleteMission = async (req, res, next) => {
  try {
    await SavedMission.findOneAndDelete({ user: req.user._id, _id: req.params.id });
    return successResponse(res, null, 'Mission removed.');
  } catch (err) { next(err); }
};

// Notifications
exports.getNotifications = async (req, res, next) => {
  try {
    const notifs = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(20);
    return successResponse(res, notifs, 'Notifications retrieved.');
  } catch (err) { next(err); }
};

exports.markRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
    return successResponse(res, null, 'All notifications marked as read.');
  } catch (err) { next(err); }
};
