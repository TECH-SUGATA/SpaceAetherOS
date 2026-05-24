// src/services/chatbotService.js
const axios = require('axios');
const ChatHistory = require('../models/ChatHistory');
const { v4: uuidv4 } = require('crypto');

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

const SPACE_SYSTEM_PROMPT = `You are ORACLE, the AI assistant for AetherOS — a real-time global space command dashboard. 
You are an expert in:
- Space missions (NASA, SpaceX, ESA, ISRO, Roscosmos)
- Orbital mechanics and satellite tracking
- Astronomy, astrophysics, and cosmology
- Mars exploration and future space colonies
- The International Space Station (ISS)
- Rocket science and propulsion systems
- Near-Earth objects and planetary defense
- Space history and future missions

Always respond in a professional yet engaging tone befitting a space command interface.
Keep responses concise but informative. Use technical terminology appropriately.
Prefix your identity as "ORACLE" when introducing yourself.`;

const MOCK_RESPONSES = [
  "The ISS orbits Earth at approximately 408 km altitude, completing 15.5 revolutions per day at 27,600 km/h. It houses up to 10 crew and is the size of a football field.",
  "SpaceX Starship is a fully reusable two-stage launch vehicle designed for Mars colonization. The Super Heavy booster generates 16.7 million pounds of thrust from 33 Raptor engines.",
  "NASA's Artemis program aims to return humans to the Moon's south pole, establishing the Gateway lunar orbital station as a staging point for Mars missions.",
  "The James Webb Space Telescope operates at L2, 1.5 million km from Earth. Its 6.5m gold-plated mirror captures infrared light, revealing galaxies over 13 billion light-years away.",
  "Near-Earth Objects are tracked by NASA's Planetary Defense Coordination Office. The DART mission in 2022 successfully deflected asteroid Dimorphos by 33 minutes in its orbit.",
  "Mars has two small moons — Phobos (27 km diameter) and Deimos (15 km). Phobos orbits Mars faster than Mars rotates and will eventually break apart, forming a ring system.",
  "A black hole forms when a massive star collapses. The event horizon marks the point of no return. Sagittarius A*, our galaxy's central black hole, has 4 million solar masses.",
  "SpaceX's Falcon 9 uses a two-stage design with 9 Merlin engines. The first stage is recoverable via propulsive landing, achieving over 200 successful recoveries to date.",
];

class ChatbotService {
  async sendMessage(userId, message, sessionId = null) {
    const sid = sessionId || require('crypto').randomBytes(16).toString('hex');

    // Try Gemini API if key is configured
    let reply;
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
      reply = await this._queryGemini(message);
    } else {
      // Intelligent fallback responses
      reply = this._getFallbackResponse(message);
    }

    // Save to chat history if user is authenticated
    if (userId) {
      await this._saveToHistory(userId, sid, message, reply);
    }

    return { reply, sessionId: sid };
  }

  async _queryGemini(message) {
    const { data } = await axios.post(
      `${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          { role: 'user', parts: [{ text: `${SPACE_SYSTEM_PROMPT}\n\nUser: ${message}` }] },
        ],
        generationConfig: { temperature: 0.7, maxOutputTokens: 500 },
      },
      { timeout: 15000 }
    );
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to process query at this time.';
  }

  _getFallbackResponse(message) {
    const msg = message.toLowerCase();
    if (msg.includes('iss') || msg.includes('station')) return MOCK_RESPONSES[0];
    if (msg.includes('starship') || msg.includes('spacex')) return MOCK_RESPONSES[1];
    if (msg.includes('artemis') || msg.includes('moon') || msg.includes('lunar')) return MOCK_RESPONSES[2];
    if (msg.includes('webb') || msg.includes('jwst') || msg.includes('telescope')) return MOCK_RESPONSES[3];
    if (msg.includes('asteroid') || msg.includes('dart') || msg.includes('neo')) return MOCK_RESPONSES[4];
    if (msg.includes('mars') || msg.includes('phobos') || msg.includes('deimos')) return MOCK_RESPONSES[5];
    if (msg.includes('black hole') || msg.includes('sagittarius')) return MOCK_RESPONSES[6];
    if (msg.includes('falcon') || msg.includes('rocket')) return MOCK_RESPONSES[7];
    return MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
  }

  async _saveToHistory(userId, sessionId, userMsg, assistantMsg) {
    try {
      await ChatHistory.findOneAndUpdate(
        { user: userId, sessionId },
        {
          $push: {
            messages: [
              { role: 'user', content: userMsg },
              { role: 'assistant', content: assistantMsg },
            ],
          },
          $setOnInsert: { title: userMsg.slice(0, 50) },
        },
        { upsert: true, new: true }
      );
    } catch (_) {}
  }

  async getChatHistory(userId, limit = 10) {
    return ChatHistory.find({ user: userId })
      .sort({ updatedAt: -1 })
      .limit(limit)
      .select('sessionId title messages createdAt updatedAt');
  }

  async deleteSession(userId, sessionId) {
    return ChatHistory.findOneAndDelete({ user: userId, sessionId });
  }
}

module.exports = new ChatbotService();
