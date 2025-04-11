"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const points_controller_1 = __importDefault(require("../controllers/points.controller"));
const pointsRouter = express_1.default.Router();
pointsRouter.get("/fetching", points_controller_1.default.getUserPoints);
pointsRouter.post("/update", points_controller_1.default.updateUserPoints);
exports.default = pointsRouter;
