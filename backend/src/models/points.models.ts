import {Points} from '../types/points'
  const pointsDB: Points[] = []; // Temporary storage (replace with a real database)
  
  export const findPointsByUserId = (userId: string) => {
    return pointsDB.find(p => p.userId === userId);
  };
  
  export const updatePointsByUserId = (userId: string, amount: number) => {
    let userPoints = pointsDB.find(p => p.userId === userId);
    if (userPoints) {
      userPoints.points += amount;
    } else {
      pointsDB.push({ userId, points: amount });
    }
    return userPoints || { userId, points: amount };
  };