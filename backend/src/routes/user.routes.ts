import { Router } from 'express'
import userController from '../controllers/user.controller'
import { authenticateUser } from '../middleware/auth.middleware';



const userRouter = Router()

userRouter.post('/signup', userController.signupUser)
userRouter.post('/login', userController.loginUser)
userRouter.get('/profile', authenticateUser, (req, res) => {
    const user = (req as any).user;
    res.json({ message: `Welcome, ${user.name}`, user });
  });
  
  userRouter.get('/all', authenticateUser, userController.getAllUsers);
  userRouter.get('/:email', authenticateUser, userController.getUserByEmail);
  

export default userRouter
