// src/models/ChatHistory.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const chatHistorySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    sessionId: { type: String, required: true },
    messages: [messageSchema],
    title: { type: String, default: 'Space Inquiry' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

chatHistorySchema.index({ user: 1, sessionId: 1 }, { unique: true });
chatHistorySchema.index({ user: 1, updatedAt: -1 });

module.exports = mongoose.model('ChatHistory', chatHistorySchema);
