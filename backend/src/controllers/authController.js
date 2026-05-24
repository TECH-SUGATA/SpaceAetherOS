// src/controllers/authController.js
const authService = require('../services/authService');
const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const result = await authService.register({ name, email, password });
    return successResponse(res, result, 'Registration successful. Welcome to AetherOS.', 201);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    return successResponse(res, result, 'Login successful.');
  } catch (err) {
    next(err);
  }
};

const googleLogin = async (req, res, next) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return errorResponse(res, 'Firebase ID token required.', 400);
    const result = await authService.googleLogin(idToken);
    return successResponse(res, result, 'Google authentication successful.');
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res) => {
  return successResponse(res, req.user.toPublicJSON(), 'User profile retrieved.');
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, avatar, sector, notificationsEnabled } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (avatar !== undefined) updates.avatar = avatar;
    if (sector) updates.sector = sector;
    if (notificationsEnabled !== undefined) updates.notificationsEnabled = notificationsEnabled;

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    return successResponse(res, user.toPublicJSON(), 'Profile updated.');
  } catch (err) {
    next(err);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (req.user.authProvider !== 'local') {
      return errorResponse(res, 'Password change not available for social login.', 400);
    }
    const user = await User.findById(req.user._id).select('+password');
    const valid = await user.comparePassword(currentPassword);
    if (!valid) return errorResponse(res, 'Current password is incorrect.', 401);

    user.password = newPassword;
    await user.save();
    return successResponse(res, null, 'Password updated successfully.');
  } catch (err) {
    next(err);
  }
};

const logout = (req, res) => {
  return successResponse(res, null, 'Logged out successfully.');
};

module.exports = { register, login, googleLogin, getMe, updateProfile, changePassword, logout };
