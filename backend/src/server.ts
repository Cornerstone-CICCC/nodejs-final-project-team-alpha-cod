import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { socketHandler } from './sockets/socket.handler';

dotenv.config();

const app = express();
const ioServer = createServer(app);
const io = new Server(ioServer, {
  cors: {
    origin: 'http://localhost:4321',
    methods: ['GET', 'POST']
  }
});

// Conexión a MongoDB
const MONGO_URI = process.env.DATABASE_URI || 'mongodb://localhost:27017/chatapp';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    // Solo arrancamos el servidor si MongoDB está conectado
    const PORT = 3500;
    ioServer.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Iniciar sockets
socketHandler(io);
