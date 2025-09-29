import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";


export const authenticate: RequestHandler = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) {
      res.status(401).json({ message: "No token" });
      return;
    }

    const token = auth.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET || "secret") as any;
    const user = await User.findById(payload.id);

    if (!user) {
      res.status(401).json({ message: "Invalid token" });
      return;
    }

    req.user = user; 
    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized", error: err });
  }
};
