"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const userRouter = (0, express_1.Router)();
userRouter.post('/signup', user_controller_1.default.signupUser);
userRouter.post('/login', user_controller_1.default.loginUser);
userRouter.get('/profile', auth_middleware_1.authenticateUser, (req, res) => {
    const user = req.user;
    res.json({ message: `Welcome, ${user.name}`, user });
});
userRouter.get('/all', auth_middleware_1.authenticateUser, user_controller_1.default.getAllUsers);
userRouter.get('/:email', auth_middleware_1.authenticateUser, user_controller_1.default.getUserByEmail);
exports.default = userRouter;
