// src/server.js
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const connectDB = require('./config/db');
const { initFirebase } = require('./config/firebase');
const initSockets = require('./sockets/socketHandler');
const initCronJobs = require('./jobs/cronJobs');

const PORT = parseInt(process.env.PORT) || 5000;

const startServer = async () => {
  // Connect Database
  await connectDB();

  // Init Firebase (non-blocking)
  initFirebase();

  // Create HTTP server
  const server = http.createServer(app);

  // Socket.io
  const io = new Server(server, {
    cors: {
      origin: [
        process.env.FRONTEND_URL || 'http://localhost:3000',
        'http://localhost:5500',
        'http://127.0.0.1:5500',
        'http://localhost:5173',
        'https://aetheros.vercel.app',
      ],
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  // Attach io to app for use in routes
  app.set('io', io);

  // Initialize socket handlers
  initSockets(io);

  // Start cron jobs
  initCronJobs();

  // Start listening
  server.listen(PORT, () => {
    console.log('');
    console.log('╔══════════════════════════════════════════════╗');
    console.log('║   🚀  AetherOS Backend — ONLINE              ║');
    console.log(`║   Port    : ${PORT}                              ║`);
    console.log(`║   Mode    : ${(process.env.NODE_ENV || 'development').padEnd(12)} ║`);
    console.log('║   Status  : All Systems Nominal              ║');
    console.log('╚══════════════════════════════════════════════╝');
    console.log('');
  });

  // Graceful shutdown
  const shutdown = (signal) => {
    console.log(`\n⚠️  ${signal} received. Shutting down gracefully...`);
    server.close(() => {
      console.log('✅ Server closed.');
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Promise Rejection:', err.message);
  });
  process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err.message);
    process.exit(1);
  });
};

startServer();
