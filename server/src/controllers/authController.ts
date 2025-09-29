import { Request, Response } from "express";
import User from "../models/User";
import crypto from "crypto";
import { sendOTPEmail } from "../utils/mailer";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

/* helper function */
function signJWT(userId: string) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || "secret", { expiresIn: "7d" });
}

export const signupSendOTP = async (req: Request, res: Response) => {
  const { email, name } = req.body;
  if (!email) return res.status(400).json({ message: "Email required" });
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = new Date(Date.now() + (Number(process.env.OTP_EXPIRY_MINUTES || 10) * 60 * 1000));

  const user = await User.findOneAndUpdate({ email }, {
    email, name,
    otp, otpExpiresAt: otpExpiry
  }, { upsert: true, new: true, setDefaultsOnInsert: true });

  try {
    await sendOTPEmail(email, otp);
  } catch (err) {
    console.error("mailer error", err);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
  return res.json({ message: "OTP sent" });
};

export const verifyOTPAndCreate = async (req: Request, res: Response) => {
  const { email, otp, password } = req.body;
  if (!email || !otp) return res.status(400).json({ message: "Email and OTP required" });

  const user = await User.findOne({ email });
  if (!user || !user.otp || !user.otpExpiresAt) return res.status(400).json({ message: "No OTP found. Please request again." });

  if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
  if (user.otpExpiresAt < new Date()) return res.status(400).json({ message: "OTP expired" });

  if (password) {
    const hash = await bcrypt.hash(password, 10);
    user.password = hash;
  }
  user.isVerified = true;
  user.otp = null;
  user.otpExpiresAt = null;
  await user.save();

  const token = signJWT(user._id.toString());
  return res.json({ token, user: { email: user.email, name: user.name } });
};

export const loginWithPassword = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password required" });

  const user = await User.findOne({ email });
  if (!user || !user.password) return res.status(400).json({ message: "User not found or no password set" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const token = signJWT(user._id.toString());
  return res.json({ token, user: { email: user.email, name: user.name } });
};
