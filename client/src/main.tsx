import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Signup from "./pages/Signup";
import OTPVerify from "./pages/OTPVerify";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute"; // Import the new component
import DashboardLayout from "./components/DashboardLayout";
import DashboardPage from "./pages/DashboardPage";
import NoteDetailPage from "./pages/NoteDetailPage";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<App />}>
          <Route index element={<Signup />} />
          <Route path="signup/otp" element={<OTPVerify />} />
          <Route path="login" element={<Login />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardPage />} />{" "}
              <Route path="notes/:noteId" element={<NoteDetailPage />} />{" "}
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
