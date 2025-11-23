import React, { useState } from "react";
import { Mail, LoaderCircle } from "lucide-react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setEmail(e.target.value);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Email is required");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Invalid email");
      return;
    }

    setLoading(true);

    try {
      const res = await API.post("/auth/forgot/request", { email });

      setSuccess(true);

      // Redirect to OTP page after success
      setTimeout(() => {
        navigate("/verify", { state: { email, purpose: "forgot" } });
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
        
        {/* Logo */}
        <div className="mb-4 flex justify-center">
          <span className="text-3xl font-bold text-yellow-500">⚡</span>
        </div>

        <h2 className="mb-8 text-center text-2xl font-semibold text-gray-800">
          Forgot Password?
        </h2>

        {/* SUCCESS MESSAGE */}
        {success ? (
          <p className="mb-6 text-center text-green-600">
            Email sent! Check your inbox for the reset code.
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-6">
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>

              <div className="relative flex items-center">
                <span className="absolute left-3 text-gray-500">
                  <Mail size={20} />
                </span>

                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={handleChange}
                  className={`w-full rounded-lg border px-4 py-2.5 pl-10 focus:ring-2 focus:ring-blue-200 ${
                    error ? "border-red-500 ring-red-200" : "border-gray-300"
                  }`}
                />
              </div>

              {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex h-10 w-full items-center justify-center rounded-lg bg-neutral-800 text-white hover:bg-neutral-700 disabled:bg-gray-300"
            >
              {loading ? (
                <LoaderCircle className="animate-spin" size={20} />
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        )}

        {/* Back to login */}
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate("/login")}
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
