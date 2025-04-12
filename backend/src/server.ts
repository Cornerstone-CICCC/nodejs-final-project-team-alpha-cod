import express, { Request, Response } from 'express'
import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'
import userRouter from './routes/user.routes'

const app = express()

app.use(express.json())

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
  .connect(process.env.DATABASE_URI, { dbName: 'tictactoe' })
  .then(() => {
    console.log(`Connected to MongoDB`)
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`)
    })
  })
  .catch(err => {
    console.error(err)
    throw err
  })