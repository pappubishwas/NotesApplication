# Full-Stack Notes App

This repository contains a full-stack note-taking application:
- Backend: Node.js + Express + TypeScript + MongoDB + JWT
- Frontend: React + TypeScript + Vite + TailwindCSS

## Features
- Signup using Email + OTP (via nodemailer)
- Login using password
- Google OAuth signup/login (passport-google-oauth20)
- JWT protected API for creating/deleting notes
- Responsive frontend UI
- Notes CRUD (create, read, delete, update)

## Quick start

### Prerequisites
- Node 18+
- npm or yarn
- MongoDB (Atlas or local)
- SMTP account (Mailtrap, Gmail App Password, etc.)
- Google OAuth credentials (for Google sign in), if using OAuth

### Setup backend
1. `cd server`
2. `cp .env` and fill values:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `SMTP_*`
   - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`
   - `FRONTEND_URL` (e.g. `http://localhost:5173`)
3. `npm install`
4. `npm run dev` to start dev server on port from `.env` (default: 5000)

### Setup frontend
1. `cd client`
2. Create `.env` or set `VITE_API_BASE` if backend differs. By default frontend expects backend at `http://localhost:5000/api`.
3. `npm install`
4. `npm run dev` to start Vite on port 5173

### Deployment
- Build frontend (`npm run build`) and host on Vercel / Netlify.
- Backend: host on Vercel. Set environment variables on the host.
- Use MongoDB Atlas for production DB.
- Use  SMTP for production emails.
- For Google OAuth, set callback URL in Google console to `https:// /api/auth/google/callback`.

## Notes & TODOs
- Password reset flow not implemented.
- OTP brute-force protections / rate limiting should be added in production (use rate-limiter).
- For production, secure cookies, HTTPS, CORS domains, Helmet headers recommended.
