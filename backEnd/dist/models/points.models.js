"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePointsByUserId = exports.findPointsByUserId = void 0;
const pointsDB = []; // Temporary storage (replace with a real database)
const findPointsByUserId = (userId) => {
    return pointsDB.find(p => p.userId === userId);
};
exports.findPointsByUserId = findPointsByUserId;
const updatePointsByUserId = (userId, amount) => {
    let userPoints = pointsDB.find(p => p.userId === userId);
    if (userPoints) {
        userPoints.points += amount;
    }
    else {
        pointsDB.push({ userId, points: amount });
    }
    return userPoints || { userId, points: amount };
};
exports.updatePointsByUserId = updatePointsByUserId;
