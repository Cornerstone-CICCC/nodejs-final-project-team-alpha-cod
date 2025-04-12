import { Request, Response } from 'express'
import { User, IUser } from '../models/user.model'


// Create new student
const createUser = async (req: Request<{}, {}, IUser>, res: Response) => {
  try {
    const { firstname, lastname, age } = req.body
    const user = await User.create({ firstname, lastname, age })
    res.status(201).json(user)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Unable to add user' })
  }
}

export default {
  createUser,
}