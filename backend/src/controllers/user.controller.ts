import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { User, IUser } from '../models/user.model'


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
      const user = await User.create({ firstname, lastname, age, email, password: hashedPassword });

      res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
      console.error("Signup error:", err);
      res.status(500).json({ message: "Signup failed", error: err });
  }
};






import jwt from 'jsonwebtoken';

// Add this where you define constants
const SECRET = process.env.JWT_SECRET || 'default_secret';

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.firstname },
      SECRET,
      { expiresIn: '1d' }
    );

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // true in production with HTTPS
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    return res.status(200).json({
      message: 'Login successful',
      user: {
        name: user.firstname,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
export const logoutUser = (req: Request, res: Response) => {
  res.clearCookie('token');
  return res.status(200).json({ message: 'Logged out successfully' });
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select('-password'); // Exclude passwords
    return res.status(200).json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    return res.status(500).json({ message: 'Failed to fetch users' });
  }
};

export const getUserByEmail = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ email: req.params.email }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.status(200).json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({ message: 'Failed to fetch user' });
  }
};



export default {
  signupUser,
  getAllUsers,
  logoutUser,
  getUserByEmail,


  loginUser
}