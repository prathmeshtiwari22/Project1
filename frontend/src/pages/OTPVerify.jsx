import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api/api";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Loader2, Shield } from "lucide-react";

/**
 * OTPVerify page (fixed)
 * - Supports email/purpose passed via location.state OR query params
 * - Uses correct backend endpoints:
 *    signup  -> POST /api/auth/signup/verify  { email, code }
 *    signin  -> POST /api/auth/signin/verify  { email, code }
 *    forgot  -> redirect to /reset-password where frontend will call
 *               POST /api/auth/forgot/verify { email, code, newPassword }
 */

export default function OTPVerify() {
  const location = useLocation();
  const navigate = useNavigate();

  // read either location.state or query params (support both)
  const params = new URLSearchParams(location.search);
  const stateEmail = location.state?.email;
  const statePurpose = location.state?.purpose;

  const email = (stateEmail || params.get("email") || "").toString();
  const purpose = (statePurpose || params.get("purpose") || "signup").toString(); // signup|signin|forgot

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const [status, setStatus] = useState("idle"); // idle | verifying | success | error
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    inputRefs.current[0]?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setDigit = (index, val) => {
    if (val && !/^\d$/.test(val)) return; // accept only single digit 0-9
    const copy = [...otp];
    copy[index] = val;
    setOtp(copy);
    if (val && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(text)) return;
    const arr = text.split("");
    const merged = [...arr, ...Array(6 - arr.length).fill("")].slice(0, 6);
    setOtp(merged);
    // if full paste, verify automatically
    if (arr.length === 6) verifyCode(arr.join(""));
  };

  const verifyCode = async (code = otp.join("")) => {
    if (code.length !== 6) {
      setStatus("error");
      return;
    }

    setIsVerifying(true);
    setStatus("verifying");

    try {
      if (purpose === "signup") {
        // correct endpoint for signup verify
        const res = await API.post("/auth/signup/verify", { email, code });
        // backend returns token + user
        if (res.data?.token) localStorage.setItem("token", res.data.token);
        setStatus("success");
        setTimeout(() => navigate("/"), 1100);
      } else if (purpose === "signin") {
        const res = await API.post("/auth/signin/verify", { email, code });
        if (res.data?.token) localStorage.setItem("token", res.data.token);
        setStatus("success");
        setTimeout(() => navigate("/"), 1100);
      } else if (purpose === "forgot") {
        // For forgot-password flow, backend usually needs newPassword together with code.
        // So redirect to ResetPassword page and pass email+code in state (the Reset page will call /auth/forgot/verify with newPassword).
        setStatus("success");
        setTimeout(() => navigate("/reset-password", { state: { email, code } }), 900);
      } else {
        // unknown purpose: mark error
        setStatus("error");
      }
    } catch (err) {
      // show server message if available (helpful for debugging)
      setStatus("error");
    } finally {
      setIsVerifying(false);
    }
  };

  // auto-submit when all digits are filled
  useEffect(() => {
    if (otp.every((d) => d !== "")) verifyCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  const handleResend = async () => {
    try {
      if (purpose === "forgot") {
        await API.post("/auth/forgot/request", { email });
        alert("OTP resent to your email.");
      } else if (purpose === "signup") {
        // easiest safe behavior: redirect user back to signup page to trigger OTP again
        alert("Please go back to signup page to re-request OTP (or sign in again).");
        navigate("/signup");
      } else if (purpose === "signin") {
        alert("Please go back to sign-in page and request OTP again.");
        navigate("/login");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to resend OTP");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md mx-auto p-8">
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-orange-100">
        <div className="text-center mb-8">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.1 }} className="w-16 h-16 bg-gradient-to-br from-orange-400 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </motion.div>

          <h2 className="text-gray-900 mb-2">Verification Code</h2>
          <p className="text-gray-600">Enter the 6-digit code sent to</p>
          <p className="text-orange-600 text-sm mt-1 break-all">{email || "your email"}</p>
        </div>

        <div className="flex justify-center gap-3 mb-8">
          {otp.map((d, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
              <input
                ref={(el) => (inputRefs.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={(e) => setDigit(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={i === 0 ? handlePaste : undefined}
                disabled={isVerifying || status === "success"}
                className={`w-12 h-14 text-center text-gray-900 bg-gray-50 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
                  ${status === "idle" ? "border-gray-200 focus:border-orange-400 focus:ring-orange-400" : ""}
                  ${status === "success" ? "border-green-500 bg-green-50" : ""}
                  ${status === "error" ? "border-red-500 bg-red-50" : ""}
                  ${isVerifying ? "border-orange-300" : ""}`}
              />
            </motion.div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {isVerifying && (
            <motion.div key="verifying" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="flex items-center justify-center gap-2 text-orange-600 mb-6">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Verifying code...</span>
            </motion.div>
          )}

          {status === "success" && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="flex items-center justify-center gap-2 text-green-600 mb-6">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              <span>Code verified successfully!</span>
            </motion.div>
          )}

          {status === "error" && (
            <motion.div key="error" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="flex items-center justify-center gap-2 text-red-600 mb-6">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <X className="w-4 h-4 text-white" />
              </div>
              <span>Invalid code. Please try again.</span>
            </motion.div>
          )}
        </AnimatePresence>

        {status !== "success" && (
          <div className="text-center mt-2">
            <button onClick={handleResend} disabled={isVerifying} className="text-orange-600 hover:text-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              Didn't receive the code? <span className="underline">Resend</span>
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
