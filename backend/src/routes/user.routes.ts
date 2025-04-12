import { Router } from 'express'
import userController from '../controllers/user.controller'


const userRouter = Router()

userRouter.post('/', userController.createUser)
userRouter.post('/signup', userController.registerUser)
userRouter.post('/login', userController.loginUser)



export default userRouter