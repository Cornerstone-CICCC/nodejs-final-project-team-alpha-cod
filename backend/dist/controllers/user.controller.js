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
/**
   * Logs in user
   *
   * @param {Request<{}, {}, Omit<User, 'id'>>} req
   * @param {Response} res
   * @returns {void} Checks username and password and set session cookie.
   */
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstname, password } = req.body;
    const user = yield firstname;
    if (!user) {
        res.status(500).json({ message: "Username/password is incorrect!" });
        return;
    }
    if (req.session) {
        req.session.isLoggedIn = true;
        req.session.username = user_model_1.User;
    }
    res.status(200).json(user);
});
/**
 * Find user by username
 *
 * @param {Request} req
 * @param {Response} res
 * @returns {void} checks for username in cookie session and returns user object
 */
const getUserByUsername = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.session && req.session.username) {
        const user = user_model_1.User.find(req.session.username);
        if (!user) {
            res.status(404).json({ message: "User not foun!" });
            return;
        }
        res.status(200).json(user);
        return;
    }
    res.status(403).json({ message: "Forbidden" });
});
exports.default = {
    createUser,
    registerUser,
    loginUser,
    getUserByUsername
};
