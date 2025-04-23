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
exports.getUserByEmail = exports.getAllUsers = exports.logoutUser = exports.loginUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = require("../models/user.model");
//Signup User
const signupUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Headers received:", req.headers); // 🔍 Debug headers
        console.log("Raw request body:", req.body); // 🔍 Debug request body
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: "Request body is empty or malformed" });
        }
        const { firstname, lastname, age, email, password } = req.body;
        console.log("Extracted user data:", firstname, lastname, age, email, password);
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const user = yield user_model_1.User.create({ firstname, lastname, age, email, password: hashedPassword });
        res.status(201).json({ message: "User registered successfully", user });
    }
    catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ message: "Signup failed", error: err });
    }
});
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Add this where you define constants
const SECRET = process.env.JWT_SECRET || 'default_secret';
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield user_model_1.User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        // Create JWT token
        const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email, name: user.firstname }, SECRET, { expiresIn: '1d' });
        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: false, // true in production with HTTPS
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });
        return res.status(200).json({
            message: 'Login successful',
            user: {
                name: user.firstname,
                email: user.email
            }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.loginUser = loginUser;
const logoutUser = (req, res) => {
    res.clearCookie('token');
    return res.status(200).json({ message: 'Logged out successfully' });
};
exports.logoutUser = logoutUser;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_model_1.User.find().select('-password'); // Exclude passwords
        return res.status(200).json({ users });
    }
    catch (error) {
        console.error('Get users error:', error);
        return res.status(500).json({ message: 'Failed to fetch users' });
    }
});
exports.getAllUsers = getAllUsers;
const getUserByEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.findOne({ email: req.params.email }).select('-password');
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        return res.status(200).json({ user });
    }
    catch (error) {
        console.error('Get user error:', error);
        return res.status(500).json({ message: 'Failed to fetch user' });
    }
});
exports.getUserByEmail = getUserByEmail;
exports.default = {
    signupUser,
    getAllUsers: exports.getAllUsers,
    logoutUser: exports.logoutUser,
    getUserByEmail: exports.getUserByEmail,
    loginUser: exports.loginUser
};
