import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { User, IUser } from '../models/user.model'


// Create new student
const createUser = async (req: Request<{}, {}, IUser>, res: Response) => {
  try {
    const { firstname, lastname, age, email, password } = req.body
    const user = await User.create({ firstname, lastname, age, email, password })
    res.status(201).json(user)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Unable to add user' })
  }
}

//Register User
const registerUser = async (req: Request<{}, {}, IUser>, res: Response) => {
    try {
        const { firstname, lastname, age, email, password} = req.body;

        //Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            firstname,
            lastname,
            age,
            email,
            password: hashedPassword,
        });

        res.status(201).json({ message: 'User registered successfully', user })
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Signup failed' });
    }
}

//Login User
/**
   * Logs in user
   * 
   * @param {Request<{}, {}, Omit<User, 'id'>>} req
   * @param {Response} res
   * @returns {void} Checks username and password and set session cookie.
   */
const loginUser = async (req: Request<{}, {}, Omit<IUser, 'User'>>, res: Response) => {
  const { firstname, password } = req.body
  const user = await firstname
  if (!user) {
    res.status(500).json({ message: "Username/password is incorrect!" })
    return
  }
  if (req.session) {
    req.session.isLoggedIn = true
    req.session.username = User
  }
  res.status(200).json(user)
}

/**
 * Find user by username
 * 
 * @param {Request} req
 * @param {Response} res
 * @returns {void} checks for username in cookie session and returns user object
 */
const getUserByUsername = async (req: Request, res: Response) => {
  if (req.session && req.session.username) {
      const user = User.find(req.session.username)
      if (!user) {
          res.status(404).json({message:"User not foun!"})
          return

      }
      res.status(200).json(user)
      return
  } 
  res.status(403).json({message:"Forbidden"})
}


export default {
  createUser,
  registerUser,
  loginUser,
  getUserByUsername

}