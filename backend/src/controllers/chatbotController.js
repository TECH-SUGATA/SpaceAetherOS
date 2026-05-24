// src/controllers/chatbotController.js
const chatbotService = require('../services/chatbotService');
const { successResponse, errorResponse } = require('../utils/apiResponse');

exports.sendMessage = async (req, res, next) => {
  try {
    const { message, sessionId } = req.body;
    if (!message?.trim()) return errorResponse(res, 'Message cannot be empty.', 400);
    const userId = req.user?._id || null;
    const result = await chatbotService.sendMessage(userId, message.trim(), sessionId);
    return successResponse(res, result, 'AI response generated.');
  } catch (err) { next(err); }
};

exports.getHistory = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    const data = await chatbotService.getChatHistory(req.user._id, parseInt(limit));
    return successResponse(res, data, 'Chat history retrieved.');
  } catch (err) { next(err); }
};

exports.deleteSession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    await chatbotService.deleteSession(req.user._id, sessionId);
    return successResponse(res, null, 'Session deleted.');
  } catch (err) { next(err); }
};
