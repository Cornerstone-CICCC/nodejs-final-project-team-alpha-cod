"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = require("../models/user.model");
// Create new student
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstname, lastname, age, email, password } = req.body;
        const user = yield user_model_1.User.create({ firstname, lastname, age, email, password });
        res.status(201).json(user);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Unable to add user' });
    }
});
//Register User
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstname, lastname, age, email, password } = req.body;
        //Hash the password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const user = yield user_model_1.User.create({
            firstname,
            lastname,
            age,
            email,
            password: hashedPassword,
        });
        res.status(201).json({ message: 'User registered successfully', user });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Signup failed' });
    }
});
//Login User
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield user_model_1.User.findOne({ email });
        if (!user)
            return res.status(400).json({ message: "User not found" });
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ message: "Invalid password" });
        /// cookie
        res.cookie('userId', user._id.toString(), {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000
        });
        res.status(200).json({ message: 'Login successful' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Login failed ' });
    }
});
exports.default = {
    createUser,
    registerUser,
    loginUser
};
