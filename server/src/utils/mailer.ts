import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export async function sendOTPEmail(to: string, otp: string) {
  const html = `<p>Your OTP for Notes app is <b>${otp}</b>. It expires in ${process.env.OTP_EXPIRY_MINUTES || 10} minutes.</p>`;
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject: "Your OTP for Notes app",
    html
  });
}
