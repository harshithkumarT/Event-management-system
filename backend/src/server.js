import dotenv from 'dotenv';
import http from 'http';
import app from './app.js';
import pool from './config/db.js';
import { initializeSocket } from './config/socket.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

initializeSocket(server);

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

process.on('SIGINT', async () => {
  await pool.end();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await pool.end();
  process.exit(0);
});