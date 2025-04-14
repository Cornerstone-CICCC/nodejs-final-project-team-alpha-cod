import express, { Request, Response } from 'express'
import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'
import userRouter from './routes/user.routes'
import cors from 'cors'

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//Frontend
app.use(cors({
  //Astro port
  origin: "http://localhost:4321",
  //Cookie transfer
  credentials: true
}));


// Users
app.use('/user', userRouter)

//Welcome to my server
app.get('/', (req: Request, res: Response) => {
    res.status(200).send("Welcome to my server")
})

app.use((req: Request, res: Response) => {
  res.status(404).send('Invalid route!')
})


const PORT = process.env.PORT || 3000
if (!process.env.DATABASE_URI) {
  throw Error("Missing connection string")
}

mongoose
  .connect(process.env.DATABASE_URI, { 
    dbName: 'tictactoe', 
    useNewUrlParser: true, 
    useUnifiedTopology: true })
  .then(() => {
    console.log(`Connected to MongoDB: tictactoe`);
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`)
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err)
  })