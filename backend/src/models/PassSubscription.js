// src/models/PassSubscription.js
const mongoose = require('mongoose');

const passSubscriptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    label: { type: String, default: 'My Location', trim: true, maxlength: 60 },
    lat: { type: Number, required: true, min: -90, max: 90 },
    lon: { type: Number, required: true, min: -180, max: 180 },
    altMeters: { type: Number, default: 0 },
    minElevationDeg: { type: Number, default: 20, min: 0, max: 90 },
    notifyMinutesBefore: { type: Number, default: 15, min: 1, max: 180 },
    active: { type: Boolean, default: true },
    lastNotifiedPassAt: { type: Date, default: null }, // rise time of the last pass we notified about
  },
  { timestamps: true }
);

passSubscriptionSchema.index({ active: 1 });

module.exports = mongoose.model('PassSubscription', passSubscriptionSchema);
