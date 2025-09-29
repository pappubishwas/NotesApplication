import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  name?: string;
  password?: string;
  otp?: string | null;
  otpExpiresAt?: Date | null;
  isVerified?: boolean;
  googleId?: string;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  name: String,
  password: String, 
  otp: String,
  otpExpiresAt: Date,
  isVerified: { type: Boolean, default: false },
  googleId: String
}, { timestamps: true });

export default mongoose.model<IUser>("User", UserSchema);
