import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import authRoutes from "./routes/auth";
import notesRoutes from "./routes/notes";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "./models/User";

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL , credentials: true }));
app.use(express.json());

/* Mongo */
mongoose.connect(process.env.MONGO_URI || "", {})
  .then(()=> console.log("Mongo connected"))
  .catch(err => console.error("Mongo connection error:", err));

/* Passport Google */
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID || "",
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  callbackURL: process.env.GOOGLE_CALLBACK_URL || "/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails?.[0]?.value;
    if (!email) return done(null, false, { message: "No email from Google" });
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        email,
        name: profile.displayName,
        googleId: profile.id,
        isVerified: true
      });
      await user.save();
    }
    return done(null, user);
  } catch (err) {
    return done(err as any, undefined);
  }
}));

app.use(passport.initialize());

app.get("/", (req, res) => {
  res.send("API working");
});

app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);

export default app;
