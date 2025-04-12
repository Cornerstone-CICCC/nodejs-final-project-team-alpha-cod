"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const userRouter = (0, express_1.Router)();
userRouter.post('/', user_controller_1.default.createUser);
userRouter.post('/signup', user_controller_1.default.registerUser);
userRouter.post('/login', user_controller_1.default.loginUser);
exports.default = userRouter;
