import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function SignIn() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await API.post("/auth/signin", form);
      // Backend sends OTP for signin. Redirect to verify page with purpose=signin
      setMsg(res.data.message || "OTP sent. Check your email.");
      navigate(`/verify?purpose=signin&email=${encodeURIComponent(form.email)}`);
    } catch (err) {
      setMsg(err.response?.data?.message || "Signin error");
    }
  };

  return (
    <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-slate-200">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mb-4 shadow-lg">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-slate-900 mb-2">Sign in</h1>
          <p className="text-slate-600">Welcome back — sign in to continue</p>
        </div>

        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="block text-slate-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-xl">
            Send OTP & Sign in
          </button>

          {msg && <div className="text-center text-sm text-red-600 mt-2">{msg}</div>}

          <div className="flex items-center justify-between mt-4">
            <button type="button" onClick={() => navigate("/signup")} className="text-slate-600">
              Create account
            </button>
            <button type="button" onClick={() => navigate("/forgot")} className="text-emerald-600">
              Forgot password?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
