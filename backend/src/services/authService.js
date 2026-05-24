// src/services/authService.js
const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { verifyFirebaseToken } = require('../config/firebase');
const UserActivity = require('../models/UserActivity');

class AuthService {
  /**
   * Register a new user
   */
  async register({ name, email, password }) {
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) throw Object.assign(new Error('Email already registered.'), { statusCode: 409 });

    const user = await User.create({ name, email: email.toLowerCase(), password, authProvider: 'local' });
    const token = generateToken({ id: user._id, email: user.email, role: user.role });

    await this._logActivity(user._id, 'login', { method: 'register' });
    return { user: user.toPublicJSON(), token };
  }

  /**
   * Login with email/password
   */
  async login({ email, password }) {
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) throw Object.assign(new Error('Invalid credentials.'), { statusCode: 401 });
    if (user.authProvider !== 'local') throw Object.assign(new Error(`Please sign in with ${user.authProvider}.`), { statusCode: 400 });

    const valid = await user.comparePassword(password);
    if (!valid) throw Object.assign(new Error('Invalid credentials.'), { statusCode: 401 });

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken({ id: user._id, email: user.email, role: user.role });
    await this._logActivity(user._id, 'login', { method: 'email' });
    return { user: user.toPublicJSON(), token };
  }

  /**
   * Firebase Google authentication
   */
  async googleLogin(idToken) {
    const firebaseUser = await verifyFirebaseToken(idToken);
    if (!firebaseUser) throw Object.assign(new Error('Firebase auth not configured.'), { statusCode: 503 });

    let user = await User.findOne({
      $or: [{ firebaseUid: firebaseUser.uid }, { email: firebaseUser.email?.toLowerCase() }],
    });

    if (!user) {
      user = await User.create({
        name: firebaseUser.name || firebaseUser.email?.split('@')[0],
        email: firebaseUser.email?.toLowerCase(),
        firebaseUid: firebaseUser.uid,
        avatar: firebaseUser.picture || '',
        authProvider: 'google',
        password: undefined,
      });
    } else if (!user.firebaseUid) {
      user.firebaseUid = firebaseUser.uid;
      user.authProvider = 'google';
      if (firebaseUser.picture && !user.avatar) user.avatar = firebaseUser.picture;
      await user.save({ validateBeforeSave: false });
    }

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken({ id: user._id, email: user.email, role: user.role });
    await this._logActivity(user._id, 'login', { method: 'google' });
    return { user: user.toPublicJSON(), token };
  }

  async _logActivity(userId, action, metadata = {}) {
    try {
      await UserActivity.create({ user: userId, action, metadata });
    } catch (_) {}
  }
}

module.exports = new AuthService();
