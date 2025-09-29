import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api, { setAuthToken } from "../services/api";
import axios from "axios";

interface ApiError {
  message: string;
}

const OTPVerify: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { email } = location.state || { email: "your.email@example.com" };

  const [otp, setOtp] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cooldown, setCooldown] = useState<number>(0);

  // Effect to handle the countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prevCooldown) => prevCooldown - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      const res = await api.post<{ token: string }>("/auth/signup/verify-otp", {
        email,
        otp,
        password,
      });
      const { token } = res.data;
      localStorage.setItem("token", token);
      setAuthToken(token);
      navigate("/dashboard");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const apiError = err.response.data as ApiError;
        setError(apiError.message || "An unexpected error occurred.");
      } else {
        setError("Verification failed. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle the logic to resend the OTP code.
  const handleResendOtp = async () => {
    if (cooldown > 0) return;

    setError("");
    setSuccessMessage("");

    try {
      await api.post("/auth/signup/send-otp", { email });
      setSuccessMessage("A new code has been sent to your email.");
      setCooldown(60); 
    } catch (err) {
      setError("Failed to resend OTP. Please try again shortly.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 sm:p-12">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Check your email
        </h1>
        <p className="text-gray-600 text-center mb-8">
          We've sent a 6-digit code to <strong>{email}</strong>.
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-6 text-center">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="otp" className="text-sm font-medium text-gray-700">
              Verification Code
            </label>
            <input
              id="otp"
              type="text"
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="mt-1 block w-full text-center tracking-[0.5em] text-2xl font-semibold px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Set Your Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-3 px-4 rounded-lg font-medium text-white ${
              isLoading ? "bg-teal-400" : "bg-teal-600 hover:bg-teal-700"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors`}
          >
            {isLoading ? "Verifying..." : "Verify & Continue"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Didn't get a code?{" "}
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={cooldown > 0}
            className="font-semibold text-teal-600 hover:text-teal-500 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {cooldown > 0 ? `Resend in ${cooldown}s` : "Click to resend"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default OTPVerify;
