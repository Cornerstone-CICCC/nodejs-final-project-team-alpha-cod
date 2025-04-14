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
        res.status(500).json({ message: "Signup failed", error: err.message });
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
        res.status(200).json({ message: 'Login successful' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Login failed ' });
    }
});
exports.default = {
    signupUser,
    loginUser
};
