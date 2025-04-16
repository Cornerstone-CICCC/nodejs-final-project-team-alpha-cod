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
};

//Login User
const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if(!user) return res.status(400).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({ message: "Invalid password"});



        res.status(200).json({ message: 'Login successful' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Login failed '});
    }
};

export default {
  createUser,
  registerUser,
  loginUser
}