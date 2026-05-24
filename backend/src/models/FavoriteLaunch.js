// src/models/FavoriteLaunch.js
const mongoose = require('mongoose');

const favoriteLaunchSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    launchId: {
      type: String,
      required: [true, 'Launch ID is required'],
    },
    name: { type: String, required: true },
    details: { type: String, default: '' },
    dateUtc: { type: Date, default: null },
    rocketName: { type: String, default: '' },
    success: { type: Boolean, default: null },
    upcoming: { type: Boolean, default: false },
    patchImage: { type: String, default: '' },
    webcastUrl: { type: String, default: '' },
    notes: { type: String, default: '', maxlength: 500 },
  },
  { timestamps: true }
);

// Unique per user + launch
favoriteLaunchSchema.index({ user: 1, launchId: 1 }, { unique: true });

module.exports = mongoose.model('FavoriteLaunch', favoriteLaunchSchema);
