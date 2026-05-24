// src/sockets/socketHandler.js
const issService = require('../services/issService');

let issInterval = null;

const initSockets = (io) => {
  console.log('🔌 Socket.io initialized');

  io.on('connection', (socket) => {
    console.log(`⚡ Client connected: ${socket.id}`);

    // ── ISS LIVE TRACKING ──
    socket.on('subscribe:iss', () => {
      console.log(`📡 ${socket.id} subscribed to ISS tracking`);
      socket.join('iss-room');

      // Send immediately
      issService.getPosition()
        .then((pos) => socket.emit('iss:update', pos))
        .catch(() => {});
    });

    socket.on('unsubscribe:iss', () => {
      socket.leave('iss-room');
    });

    // ── LAUNCH ROOM ──
    socket.on('subscribe:launches', () => {
      socket.join('launch-room');
      socket.emit('launches:joined', { message: 'Subscribed to launch updates' });
    });

    // ── NOTIFICATIONS ──
    socket.on('subscribe:notifications', ({ userId }) => {
      if (userId) {
        socket.join(`user-${userId}`);
        console.log(`🔔 User ${userId} subscribed to notifications`);
      }
    });

    // ── PING/PONG ──
    socket.on('ping', () => {
      socket.emit('pong', { timestamp: Date.now() });
    });

    socket.on('disconnect', (reason) => {
      console.log(`💤 Client disconnected: ${socket.id} — ${reason}`);
    });
  });

  // ── BROADCAST ISS POSITION EVERY 5 SECONDS ──
  if (issInterval) clearInterval(issInterval);
  issInterval = setInterval(async () => {
    const room = io.sockets.adapter.rooms.get('iss-room');
    if (!room || room.size === 0) return;

    try {
      const pos = await issService.getPosition();
      io.to('iss-room').emit('iss:update', pos);
    } catch (err) {
      io.to('iss-room').emit('iss:error', { message: 'ISS data temporarily unavailable' });
    }
  }, 5000);

  // Helper to send notification to specific user
  io.sendUserNotification = (userId, notification) => {
    io.to(`user-${userId}`).emit('notification:new', notification);
  };

  return io;
};

module.exports = initSockets;
