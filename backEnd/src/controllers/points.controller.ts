import { Request, Response } from "express";
import { findPointsByUserId, updatePointsByUserId } from "../models/points.models";

const getUserPoints = async (req: Request, res: Response) => {
  const userId = req.session?.userId; // ✅ Get userId from session
  const points = findPointsByUserId(userId);
  console.log(userId,points)
  if (!points){
    res.status(404).json({ message: "No points found" });
    return
  }
  res.json(points);
};

const updateUserPoints = async (req: Request, res: Response) => {
  const { userId, points } = req.body;
  if (!userId || typeof points !== "number") {
    res.status(400).json({ message: "Invalid request data" });
    return
  }
  const updatedPoints = updatePointsByUserId(userId, points);
  res.status(200).json(updatedPoints);
};

export default{
    getUserPoints,
    updateUserPoints
}
