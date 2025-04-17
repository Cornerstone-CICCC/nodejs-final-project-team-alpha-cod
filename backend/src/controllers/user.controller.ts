import {Request, Response } from 'express'
import {User} from  '../types/user'
import bcrypt from 'bcrypt'
import { UserModel, IUser } from '../models/user.models'

/**
 * Find user by username
 * 
 * @param {Request} req
 * @param {Response} res
 * @returns {void} checks for username in cookie session and returns user object
 */
const getUserByUsername = async (req: Request, res: Response) => {
    if (req.session && req.session.username) {
        const user = UserModel.find(req.session.username)
        if (!user) {
            res.status(404).json({message:"User not foun!"})
            return

        }
        res.status(200).json(user)
        return
    } 
    res.status(403).json({message:"Forbidden"})
}

const addUser = async (req: Request, res: Response) => {
  try {
      console.log("Headers received:", req.headers);  // 🔍 Debug headers
      console.log("Raw request body:", req.body);  // 🔍 Debug request body

      if (!req.body || Object.keys(req.body).length === 0) {
          return res.status(400).json({ message: "Request body is empty or malformed" });
      }

      const { firstname, lastname, age, email, password } = req.body;
      console.log("Extracted user data:", firstname, lastname, age, email, password);

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await UserModel.create({ firstname, lastname, age, email, password: hashedPassword });

      res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
      console.error("Signup error:", err);
      res.status(500).json({ message: "Signup failed", error: err });
  }
}
  



//Signup User
const signupUser = async (req: Request, res: Response) => {
  try {
      console.log("Headers received:", req.headers);  // 🔍 Debug headers
      console.log("Raw request body:", req.body);  // 🔍 Debug request body

      if (!req.body || Object.keys(req.body).length === 0) {
          return res.status(400).json({ message: "Request body is empty or malformed" });
      }

      const { firstname, lastname, age, email, password } = req.body;
      console.log("Extracted user data:", firstname, lastname, age, email, password);

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await UserModel.create({ firstname, lastname, age, email, password: hashedPassword });

      res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
      console.error("Signup error:", err);
      res.status(500).json({ message: "Signup failed", error: err });
  }
};




//Login User
const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });

        if(!user) return res.status(400).json({ message: "User not found" })

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) return res.status(400).json({ message: "Invalid password"})

        res.status(200).json({ message: 'Login successful' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Login failed '});
    }

    if (req.session) {
      req.session.isLoggedIn = true
      req.session.email = UserModel
    }
    res.status(200).json(UserModel)
  }

  /**
 * Edit user by ID
 * 
 * @param {Request<{ id: string }, {}, Partial<User>>} req
 * @param {Response} res
 * @returns {void} Returns updated user.
 */
const updateUserById = async (req: Request<{ id: string }, {}, Partial<User>>, res: Response) => {
    console.log('running...')
    const { id,email, password} = req.body
    if (!id) {
        console.log("missing id")
        res.status(500).json({ error: "missing id" })
        return
    }
    
    const user = await UserModel.findByIdAndUpdate(id, { email, password })
    if (!user) {
        console.log('user not found')
      res.status(404).json({ error: "User does not exist!" })
      return
    }
    console.log(user)
    if (req.session) {
        req.session.username = user.email
    }
    res.status(200).json(user)
  }
  
  /**
   * Logs out user
   * 
   * @param {Request} req
   * @param {Response} res
   * @returns {void} Clears session cookie.
   */
  const logoutUser = (req: Request<{}, {}, Omit<User, 'id'>>, res: Response) => {
    req.session = null
    res.status(200).json({ message: "Logged out successfully!" })
  }
  
  export default {
    getUserByUsername,
    addUser,
    loginUser,
    logoutUser,
    updateUserById
  }