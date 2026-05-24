// src/models/SavedMission.js
const mongoose = require('mongoose');

const savedMissionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    missionId: { type: String, required: true },
    title: { type: String, required: true },
    agency: { type: String, default: '' },
    description: { type: String, default: '' },
    launchDate: { type: Date, default: null },
    status: { type: String, enum: ['planned', 'active', 'completed', 'scrubbed'], default: 'planned' },
    type: { type: String, enum: ['nasa', 'spacex', 'esa', 'other'], default: 'other' },
    imageUrl: { type: String, default: '' },
    notes: { type: String, default: '', maxlength: 1000 },
  },
  { timestamps: true }
);

savedMissionSchema.index({ user: 1, missionId: 1 }, { unique: true });

module.exports = mongoose.model('SavedMission', savedMissionSchema);
