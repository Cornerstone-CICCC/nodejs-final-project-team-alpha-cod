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
Object.defineProperty(exports, "__esModule", { value: true });
const points_models_1 = require("../models/points.models");
const getUserPoints = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.session) === null || _a === void 0 ? void 0 : _a.userId; // ✅ Get userId from session
    const points = (0, points_models_1.findPointsByUserId)(userId);
    console.log(userId, points);
    if (!points) {
        res.status(404).json({ message: "No points found" });
        return;
    }
    res.json(points);
});
const updateUserPoints = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, points } = req.body;
    if (!userId || typeof points !== "number") {
        res.status(400).json({ message: "Invalid request data" });
        return;
    }
    const updatedPoints = (0, points_models_1.updatePointsByUserId)(userId, points);
    res.status(200).json(updatedPoints);
});
exports.default = {
    getUserPoints,
    updateUserPoints
};
