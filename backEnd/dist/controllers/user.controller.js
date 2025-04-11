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
const user_models_1 = __importDefault(require("../models/user.models"));
/**
 * Find user by username
 *
 * @param {Request} req
 * @param {Response} res
 * @returns {void} checks for username in cookie session and returns user object
 */
const getUserByUsername = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.session && req.session.username) {
        const user = user_models_1.default.findByUsername(req.session.username);
        if (!user) {
            res.status(404).json({ message: "User not foun!" });
            return;
        }
        res.status(200).json(user);
        return;
    }
    res.status(403).json({ message: "Forbidden" });
});
/**
 * Create new user
 *
 * @param {Request<{}, {}, Omit<User, 'id'>>} req
 * @param {Response} res
 * @returns {void} Adds user and returns success message.
 */
const addUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, firstname, lastname } = req.body;
    if (!username || !password) {
        res.status(500).json({ message: "Username or password is missing" });
        return;
    }
    const user = yield user_models_1.default.create({
        username,
        password,
        firstname,
        lastname,
    });
    if (!user) {
        res.status(409).json({ message: "Username is taken!" });
        return;
    }
    res.status(201).json({ message: "User created successfully!" });
});
/**
 * Logs in user
 *
 * @param {Request<{}, {}, Omit<User, 'id'>>} req
 * @param {Response} res
 * @returns {void} Checks username and password and set session cookie.
 */
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = yield user_models_1.default.login(username, password);
    if (!user) {
        res.status(500).json({ message: "Username/password is incorrect!" });
        return;
    }
    if (req.session) {
        req.session.isLoggedIn = true;
        req.session.username = user.username;
    }
    res.status(200).json(user);
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
    const { id, username, password } = req.body;
    if (!id) {
        console.log("missing id");
        res.status(500).json({ error: "missing id" });
        return;
    }
    const user = yield user_models_1.default.editUserById(id, { username, password });
    if (!user) {
        console.log('user not found');
        res.status(404).json({ error: "User does not exist!" });
        return;
    }
    console.log(user);
    if (req.session) {
        req.session.username = user.username;
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
