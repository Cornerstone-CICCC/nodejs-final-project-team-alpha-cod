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
const user_models_1 = require("../models/user.models");
/**
 * Find user by username
 *
 * @param {Request} req
 * @param {Response} res
 * @returns {void} checks for username in cookie session and returns user object
 */
const getUserByUsername = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.session && req.session.username) {
        const user = user_models_1.UserModel.find(req.session.username);
        if (!user) {
            res.status(404).json({ message: "User not foun!" });
            return;
        }
        res.status(200).json(user);
        return;
    }
    res.status(403).json({ message: "Forbidden" });
});
const addUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Headers received:", req.headers); // 🔍 Debug headers
        console.log("Raw request body:", req.body); // 🔍 Debug request body
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: "Request body is empty or malformed" });
        }
        const { firstname, lastname, age, email, password } = req.body;
        console.log("Extracted user data:", firstname, lastname, age, email, password);
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const user = yield user_models_1.UserModel.create({ firstname, lastname, age, email, password: hashedPassword });
        res.status(201).json({ message: "User registered successfully", user });
    }
    catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ message: "Signup failed", error: err });
    }
});
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
        const user = yield user_models_1.UserModel.create({ firstname, lastname, age, email, password: hashedPassword });
        res.status(201).json({ message: "User registered successfully", user });
    }
    catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ message: "Signup failed", error: err });
    }
});
//Login User
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield user_models_1.UserModel.findOne({ email });
        if (!user)
            return res.status(400).json({ message: "User not found" });
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ message: "Invalid password" });
        res.status(200).json({ message: 'Login successful' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Login failed ' });
    }
    if (req.session) {
        req.session.isLoggedIn = true;
        req.session.email = user_models_1.UserModel;
    }
    res.status(200).json(user_models_1.UserModel);
});
/**
* Edit user by ID
*
* @param {Request<{ id: string }, {}, Partial<User>>} req
* @param {Response} res
* @returns {void} Returns updated user.
*/
const updateUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('running...');
    const { id, email, password } = req.body;
    if (!id) {
        console.log("missing id");
        res.status(500).json({ error: "missing id" });
        return;
    }
    const user = yield user_models_1.UserModel.findByIdAndUpdate(id, { email, password });
    if (!user) {
        console.log('user not found');
        res.status(404).json({ error: "User does not exist!" });
        return;
    }
    console.log(user);
    if (req.session) {
        req.session.username = user.email;
    }
    res.status(200).json(user);
});
/**
 * Logs out user
 *
 * @param {Request} req
 * @param {Response} res
 * @returns {void} Clears session cookie.
 */
const logoutUser = (req, res) => {
    req.session = null;
    res.status(200).json({ message: "Logged out successfully!" });
};
exports.default = {
    getUserByUsername,
    addUser,
    loginUser,
    logoutUser,
    updateUserById
};
