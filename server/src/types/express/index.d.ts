// src/types/express/index.d.ts

// Make sure this import path correctly points to your User model file
import { IUser } from "../../models/User"; 

declare global {
  namespace Express {
    export interface Request {
      // This line tells TypeScript that req.user is of your Mongoose type
      user?: IUser;
    }
  }
}