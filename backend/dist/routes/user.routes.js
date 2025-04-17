"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const userRouter = (0, express_1.Router)();
userRouter.post('/signup', user_controller_1.default.addUser);
userRouter.post('/login', user_controller_1.default.loginUser);
userRouter.get('/check-auth', auth_middleware_1.checkLoggedIn, user_controller_1.default.getUserByUsername);
userRouter.get('/logout', user_controller_1.default.logoutUser);
userRouter.put('/update', user_controller_1.default.updateUserById); // PUT /users/:id
exports.default = userRouter;
