import express from "express";
import pointsController from "../controllers/points.controller";


const pointsRouter = express.Router();

pointsRouter.get("/fetching", pointsController.getUserPoints);
pointsRouter.post("/update", pointsController.updateUserPoints);

export default pointsRouter;
