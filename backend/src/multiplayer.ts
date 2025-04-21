import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import userRouter from './routes/user.routes';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { multiHandler } from './sockets/multiplayer.handler';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:4321', // Removed trailing slash
    methods: ['GET', 'POST']
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Frontend CORS
app.use(cors({
  origin: 'http://localhost:4321',
  credentials: true
}));

// Initialize sockets
multiHandler(io)

// User routes
app.use('/user', userRouter);

// Root route
app.get('/', (req: Request, res: Response) => {
  res.status(200).send('Welcome to my server');
});

// Fallback route
app.use((req: Request, res: Response) => {
  res.status(404).send('Invalid route!');
});

const PORT = process.env.PORT || 3000;

if (!process.env.DATABASE_URI) {
  throw new Error('Missing connection string');
}

// Connect to MongoDB and start server
mongoose
  .connect(process.env.DATABASE_URI)
  .then(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('Connected to MongoDB: tictactoe');
    }
    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
