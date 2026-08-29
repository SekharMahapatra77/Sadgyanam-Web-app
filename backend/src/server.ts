import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import app from './app';
import { env } from './config/env';
import { connectDB } from './config/db';

const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: [env.CLIENT_URL, 'http://localhost:3000'],
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log(`[Socket] New client connected: ${socket.id}`);

  socket.on('join_batch', (batchId) => {
    socket.join(`batch_${batchId}`);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket] Client disconnected: ${socket.id}`);
  });
});

const startServer = async () => {
  await connectDB();

  server.listen(env.PORT, () => {
    console.log(`🚀 [SADGYANAM API] Server running on http://localhost:${env.PORT}`);
    console.log(`📡 [API v1 Endpoint] http://localhost:${env.PORT}/api/v1`);
  });
};

startServer();
