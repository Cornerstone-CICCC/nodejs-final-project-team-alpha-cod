import { Router } from 'express'
import userController from '../controllers/user.controller'


const userRouter = Router()

userRouter.post('/signup', userController.signupUser)
userRouter.post('/login', userController.loginUser)

export default userRouter