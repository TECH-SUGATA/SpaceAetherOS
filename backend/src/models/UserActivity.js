// src/models/UserActivity.js
const mongoose = require('mongoose');

const userActivitySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    action: {
      type: String,
      enum: ['login', 'logout', 'view_launch', 'view_asteroid', 'view_apod', 'ai_query', 'save_mission', 'bookmark_launch', 'view_iss'],
      required: true,
    },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    ipAddress: { type: String, default: '' },
    userAgent: { type: String, default: '' },
  },
  { timestamps: true }
);

userActivitySchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('UserActivity', userActivitySchema);
