import jwt from 'jsonwebtoken'
import { IUser } from '../models/user.model'

const SECRET = 'JWT_SECRET' // Replace with env variable in production

export const generateToken = (user: IUser) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname
    },
    SECRET,
    { expiresIn: '1d' }
  )
}

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, SECRET)
  } catch (err) {
    return null
  }
}
