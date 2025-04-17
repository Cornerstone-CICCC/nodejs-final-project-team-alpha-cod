import {Router} from 'express'
import userController from '../controllers/user.controller'
import {checkLoggedIn} from '../middleware/auth.middleware'

const userRouter = Router()

userRouter.post('/signup',userController.addUser)
userRouter.post('/login', userController.loginUser)
userRouter.get('/check-auth', checkLoggedIn, userController.getUserByUsername)
userRouter.get('/logout', userController.logoutUser)
userRouter.put('/update', userController.updateUserById) // PUT /users/:id


export default userRouter