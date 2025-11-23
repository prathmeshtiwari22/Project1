import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const loginHandler = async () => {
    setError("");
    setMsg("");

    if (!email || !password) {
      setError("Email and password required");
      return;
    }

    try {
      // ORIGINAL ROUTE: /auth/signin
      const res = await API.post("/auth/signin", { email, password });

      // This ALWAYS returns a message (never token)
      setMsg(res.data.message);

      // Redirect to OTP page for sign-in OTP verification
      navigate("/verify", { state: { email, purpose: "signin" } });
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-col md:flex-row flex-grow">

        {/* LEFT */}
        <div className="hidden md:flex md:w-1/2 justify-center items-center">
          <img
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
            alt="login-banner"
            className="w-4/5 drop-shadow-xl"
          />
        </div>

        {/* RIGHT */}
        <div className="flex flex-col justify-center items-center md:w-1/2 px-6 py-10">
          <h2 className="text-2xl font-semibold mb-6 text-gray-700">Sign In</h2>

          <div className="w-full max-w-md space-y-4">

            {msg && <p className="text-emerald-600 text-center">{msg}</p>}
            {error && <p className="text-red-600 text-center">{error}</p>}

            {/* EMAIL */}
            <div>
              <label className="text-gray-700 font-medium">Email address</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  className="w-full pl-10 pr-3 py-3 bg-gray-100 border border-gray-300 rounded-xl"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-gray-700 font-medium">Password</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  type={showPwd ? "text" : "password"}
                  className="w-full pl-10 pr-10 py-3 bg-gray-100 border border-gray-300 rounded-xl"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-400"
                  onClick={() => setShowPwd(!showPwd)}
                >
                  {showPwd ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {/* LOGIN BUTTON */}
            <button
              onClick={loginHandler}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl text-lg shadow"
            >
              Login
            </button>

            {/* REGISTER LINK */}
            <p className="text-center text-gray-700 mt-2">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/signup")}
                className="text-red-500 hover:underline"
              >
                Register
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="py-4 px-6 bg-emerald-700 text-white flex justify-between">
        <p>© 2025. All rights reserved.</p>
      </div>
    </div>
  );
}
