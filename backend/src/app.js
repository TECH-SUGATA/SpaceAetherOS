// src/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { apiLimiter } = require('./middleware/rateLimiter');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();

// ── SECURITY ──
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false, // Relax for API
}));

// ── CORS ──
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'http://localhost:5173',
  'https://aetheros.vercel.app',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.some((o) => origin.startsWith(o))) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── BODY PARSERS ──
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── LOGGING ──
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// ── RATE LIMIT ──
app.use('/api/', apiLimiter);

// ── HEALTH CHECK ──
app.get('/health', (req, res) => {
  res.json({
    status: 'operational',
    service: 'AetherOS Backend',
    version: '1.0.0',
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

app.get('/', (req, res) => {
  res.json({
    message: '🚀 AetherOS API — Real-Time Global Space Dashboard',
    version: '1.0.0',
    docs: '/api/docs',
    health: '/health',
    endpoints: {
      auth: '/api/auth',
      nasa: '/api/nasa',
      spacex: '/api/spacex',
      iss: '/api/iss',
      asteroids: '/api/asteroids',
      news: '/api/news',
      chatbot: '/api/chatbot',
      dashboard: '/api/dashboard',
    },
  });
});

// ── ROUTES ──
app.use('/api/auth', require('./routes/auth'));
app.use('/api/nasa', require('./routes/nasa'));
app.use('/api/spacex', require('./routes/spacex'));
app.use('/api/iss', require('./routes/iss'));
app.use('/api/asteroids', require('./routes/nasa')); // Reuse nasa route for asteroids
app.use('/api/news', require('./routes/news'));
app.use('/api/chatbot', require('./routes/chatbot'));
app.use('/api/dashboard', require('./routes/dashboard'));

// ── 404 & ERROR HANDLERS ──
app.use(notFound);
app.use(errorHandler);

module.exports = app;
