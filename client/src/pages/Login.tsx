import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { setAuthToken } from "../services/api";
import axios from 'axios';


interface ApiError {
  message: string;
}

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await api.post<{ token: string }>("/auth/login", { email, password });
      const { token } = res.data;
      localStorage.setItem("token", token);
      setAuthToken(token);
      navigate("/dashboard");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const apiError = err.response.data as ApiError;
        setError(apiError.message || "An unexpected error occurred.");
      } else {
        setError("Login failed. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";
    window.location.href = `${apiBaseUrl}/auth/google`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="flex w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        
        {/* Form Section */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back!</h1>
          <p className="text-gray-600 mb-8">Please sign in to continue.</p>
          
          {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-6 text-center">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition"/>
            </div>
            <div>
                <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
                <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition"/>
            </div>
            <button type="submit" disabled={isLoading} className={`w-full flex justify-center py-3 px-4 rounded-lg font-medium text-white ${isLoading ? 'bg-teal-400' : 'bg-teal-600 hover:bg-teal-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors`}>
                {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="my-6 flex items-center"><div className="flex-grow border-t border-gray-300"></div><span className="mx-4 text-sm text-gray-500">OR</span><div className="flex-grow border-t border-gray-300"></div></div>

          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
              <path fill="#4285F4" d="M24 9.5c3.9 0 6.9 1.6 9 3.6l6.9-6.9C35.4 2.1 30.1 0 24 0 14.9 0 7.2 5.4 4.1 12.9l8.1 6.3C13.8 13.5 18.5 9.5 24 9.5z"></path>
              <path fill="#34A853" d="M46.2 25.4c0-1.7-.2-3.4-.5-5H24v9.3h12.5c-.5 3-2.1 5.6-4.6 7.3l7.9 6.1c4.6-4.2 7.3-10.2 7.3-17.7z"></path>
              <path fill="#FBBC05" d="M12.2 28.1c-.6-1.8-.9-3.7-.9-5.6s.3-3.8.9-5.6l-8.1-6.3C1.5 15.1 0 19.4 0 24s1.5 8.9 4.1 13.2l8.1-6.1z"></path>
              <path fill="#EA4335" d="M24 48c6.1 0 11.4-2 15.1-5.4l-7.9-6.1c-2 1.4-4.6 2.2-7.2 2.2-5.5 0-10.2-4-11.8-9.4l-8.1 6.3C7.2 42.6 14.9 48 24 48z"></path>
              <path fill="none" d="M0 0h48v48H0z"></path>
            </svg>
            Sign In with Google
          </button>

          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/" className="font-semibold text-teal-600 hover:text-teal-500">Create one</a>
          </p>
        </div>

        {/* Image Section */}
        <div className="hidden lg:block lg:w-1/2 relative">
            <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop" alt="Team working in an office"/>
            <div className="absolute inset-0 bg-teal-900 bg-opacity-40"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;