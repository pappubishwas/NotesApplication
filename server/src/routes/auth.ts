import { Router } from "express";
import { signupSendOTP, verifyOTPAndCreate, loginWithPassword } from "../controllers/authController";
import passport from "passport";
import jwt from "jsonwebtoken";
import { authenticate } from "../middlewares/auth";
const router = Router();

/* endpoints */
router.post("/signup/send-otp", signupSendOTP);
router.post("/signup/verify-otp", verifyOTPAndCreate);
router.post("/login", loginWithPassword);

router.get('/me', authenticate, (req, res) => {
  const user = { ...(req.user as { [key: string]: any }) };
  const userDetails = { name: user._doc.name,email: user._doc.email, _id: user._doc._id };
  res.status(200).json(userDetails);
});

/* Google auth */
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback", passport.authenticate("google", { session: false, failureRedirect: "/api/auth/google/failure" }), (req, res) => {
  // successful
  const user: any = (req.user as any);
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secret", { expiresIn: "7d" });
  // redirect to frontend with token
  const frontend = process.env.FRONTEND_URL;
  res.redirect(`${frontend}/auth/google/success?token=${token}`);
});

router.get("/google/failure", (req, res) => {
  res.status(401).json({ message: "Google auth failed" });
});

export default router;
