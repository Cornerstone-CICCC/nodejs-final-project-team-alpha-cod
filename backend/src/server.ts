import express, {Request, Response } from 'express'
import cors from 'cors'
import cookiesession from 'cookie-session'
import userRouter from './routes/user.routes'
import dotenv from 'dotenv'
import pointsRouter from './routes/points.routes'; // ✅ Import the correct router
import mongoose from 'mongoose'



dotenv.config();

const app = express();


//front

app.use(cors({
    origin: 'http://localhost:4321',
    credentials: true
}));

const SIGN_kEY = process.env.COOKIE_SIGN_KEY;
const ENCRYPT_KEY = process.env.COOKIE_ENCRYPT_KEY;
if (!SIGN_kEY || !ENCRYPT_KEY) {
    throw new Error('Cookie keys not found!');
}
app.use(cookiesession({
    name: 'session',
    keys:[SIGN_kEY, ENCRYPT_KEY],
    maxAge: 5 * 60 * 1000
}));
app.use(express.json())

app.use('/users', userRouter)
 app.use((req: Request, res: Response) => {
    res.status(404).send('page not found')
 })

 app.use('/points', pointsRouter) // ✅ Now it works!
 app.use((req: Request, res: Response) => {
    res.status(404).send('points page not found')
 })
 

 const PORT = process.env.PORT || 3000
if (!process.env.DATABASE_URI) {
  throw Error("Missing connection string")
}

mongoose
  .connect(process.env.DATABASE_URI!, { dbName: 'tictactoe' })
  .then(() => {
    console.log(`Connected to MongoDB: tictactoe`);
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit on failure
  });