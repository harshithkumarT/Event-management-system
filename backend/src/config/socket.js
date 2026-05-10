import { Server } from 'socket.io';
import { verifyAccessToken } from '../utils/jwt.js';

let ioInstance = null;

export const initializeSocket = (httpServer) => {
  ioInstance = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  ioInstance.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = verifyAccessToken(token);
      socket.user = decoded;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  ioInstance.on('connection', (socket) => {
    socket.join(`user:${socket.user.id}`);
    socket.join(socket.user.role === 'admin' ? 'admins' : 'users');

    socket.on('subscribe:event', (eventId) => {
      socket.join(`event:${eventId}`);
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return ioInstance;
};

export const getIO = () => {
  if (!ioInstance) {
    throw new Error('Socket.IO has not been initialized');
  }

  return ioInstance;
};