import express, { Request, Response } from 'express'
import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'

const app = express()

app.use(express.json())

//Routes
app.get('/', (req: Request, res: Response) => {
    res.status(200).send('Welcome to my server')
})

app.use((req: Request, res: Response) => {
    res.status(404).send('Invalid route!')
})

//Connect to server
const PORT = process.env.PORT || 3000
const MONGODB_URI = process.env.DATABASE_URI!

mongoose
    .connect(MONGODB_URI, { dbName: 'tictactoe' })
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