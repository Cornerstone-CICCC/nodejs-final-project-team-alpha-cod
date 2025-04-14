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
      res.status(500).json({ message: "Signup failed", error: err.message });
  }
};




//Login User
const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if(!user) return res.status(400).json({ message: "User not found" })

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) return res.status(400).json({ message: "Invalid password"})

        res.status(200).json({ message: 'Login successful' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Login failed '});
    }
};

export default {
  signupUser,
  loginUser
}