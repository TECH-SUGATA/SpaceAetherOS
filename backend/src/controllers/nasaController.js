// src/controllers/nasaController.js
const nasaService = require('../services/nasaService');
const { successResponse, errorResponse } = require('../utils/apiResponse');

exports.getAPOD = async (req, res, next) => {
  try {
    const { date, count } = req.query;
    const data = await nasaService.getAPOD(date, count ? parseInt(count) : null);
    return successResponse(res, data, 'APOD retrieved.');
  } catch (err) { next(err); }
};

exports.getMarsPhotos = async (req, res, next) => {
  try {
    const { rover = 'curiosity', sol = 1000, camera, page = 1 } = req.query;
    const data = await nasaService.getMarsRoverPhotos({ rover, sol, camera, page });
    return successResponse(res, data, 'Mars rover photos retrieved.');
  } catch (err) { next(err); }
};

exports.getAsteroids = async (req, res, next) => {
  try {
    const { start_date, end_date } = req.query;
    const data = await nasaService.getAsteroids(start_date, end_date);
    return successResponse(res, data, 'Asteroid data retrieved.');
  } catch (err) { next(err); }
};

exports.searchImages = async (req, res, next) => {
  try {
    const { q = 'galaxy', page = 1 } = req.query;
    const data = await nasaService.searchImages(q, parseInt(page));
    return successResponse(res, data, 'NASA images retrieved.');
  } catch (err) { next(err); }
};
