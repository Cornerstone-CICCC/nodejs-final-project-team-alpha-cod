import {Request, Response } from 'express'
import {User} from  '../types/user'
import userModel from '../models/user.models'

/**
 * Find user by username
 * 
 * @param {Request} req
 * @param {Response} res
 * @returns {void} checks for username in cookie session and returns user object
 */
const getUserByUsername = async (req: Request, res: Response) => {
    if (req.session && req.session.username) {
        const user = userModel.findByUsername(req.session.username)
        if (!user) {
            res.status(404).json({message:"User not foun!"})
            return

        }
        res.status(200).json(user)
        return
    } 
    res.status(403).json({message:"Forbidden"})
}

/**
 * Create new user
 * 
 * @param {Request<{}, {}, Omit<User, 'id'>>} req
 * @param {Response} res
 * @returns {void} Adds user and returns success message.
 */
const addUser = async (req: Request<{}, {}, Omit<User, 'id'>>, res: Response) => {
    const { username, password, firstname, lastname } = req.body
    if (!username || !password) {
      res.status(500).json({ message: "Username or password is missing" })
      return
    }
    const user = await userModel.create({
      username,
      password,
      firstname,
      lastname,
    })
    if (!user) {
      res.status(409).json({ message: "Username is taken!" })
      return
    }
    res.status(201).json({ message: "User created successfully!" })
  }
  
  /**
   * Logs in user
   * 
   * @param {Request<{}, {}, Omit<User, 'id'>>} req
   * @param {Response} res
   * @returns {void} Checks username and password and set session cookie.
   */
  const loginUser = async (req: Request<{}, {}, Omit<User, 'id'>>, res: Response) => {
    const { username, password } = req.body
    const user = await userModel.login(username, password)
    if (!user) {
      res.status(500).json({ message: "Username/password is incorrect!" })
      return
    }
    if (req.session) {
      req.session.isLoggedIn = true
      req.session.username = user.username
    }
    res.status(200).json(user)
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
    const { id,username, password} = req.body
    if (!id) {
        console.log("missing id")
        res.status(500).json({ error: "missing id" })
        return
    }
    
    const user = await userModel.editUserById(id, { username, password })
    if (!user) {
        console.log('user not found')
      res.status(404).json({ error: "User does not exist!" })
      return
    }
    console.log(user)
    if (req.session) {
        req.session.username = user.username
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