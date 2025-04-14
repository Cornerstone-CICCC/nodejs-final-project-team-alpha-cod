import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  firstname: string;
  lastname: string;
  age: number,
  email: string,
  password: string
}

const UserSchema = new mongoose.Schema<IUser>({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  age: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
  

export const User = mongoose.model<IUser>('User', UserSchema, 'users');