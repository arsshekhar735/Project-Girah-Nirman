import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  adminLogin,
  adminRegister,
  adminVerifyOtp
} from "../utils/api";

export default function AdminAuth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login"); // login | register | otp
  const [form, setForm] = useState({
    name: "",
    userid: "",
    phone: "",
    email: "",
    password: "",
    userOtp: "",
    ownerOtp: ""
  });
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [resendTimer, setResendTimer] = useState(0); // countdown in seconds

  const updateForm = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  // Countdown effect for resend OTP
  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  // LOGIN
  const handleLogin = async () => {
    setLoading(true);
    setStatusMsg("");
    const data = await adminLogin({
      userid: form.userid,
      password: form.password
    });
    setLoading(false);

    if (data?.success) {
      localStorage.setItem("adminToken", data.token);
      navigate("/admin");
    } else {
      setStatusMsg(data?.message || "Invalid credentials");
    }
  };

  // REGISTER
  const handleRegister = async () => {
    setLoading(true);
    setStatusMsg("");
    const data = await adminRegister({
      name: form.name,
      userid: form.userid,
      phone: form.phone,
      email: form.email,
      password: form.password
    });
    setLoading(false);

    if (data?.success) {
      setMode("otp");
      setStatusMsg("📧 OTP sent to your email and the owner's email.");
      setResendTimer(60); // start 60 sec cooldown
    } else {
      setStatusMsg(data?.message || "Registration failed");
    }
  };

  // RESEND OTP
// RESEND OTP
const handleResendOtp = async () => {
  if (resendTimer > 0) return; // prevent clicking early

  setLoading(true);
  setStatusMsg("");
  const data = await adminRegister({
    name: form.name,
    userid: form.userid,
    phone: form.phone,
    email: form.email,
    password: form.password
  });
  setLoading(false);

  if (data?.success) {
    setStatusMsg("📧 New OTP sent to your email and owner's email.");
    setResendTimer(60);
  } else {
    if (data?.message?.includes("OTP resend limit")) {
      // Backend limit hit (from HTTP 429)
      setStatusMsg("⏳ " + data.message);
      setResendTimer(15 * 60); // disable button for 15 min
    } else {
      setStatusMsg(data?.message || "OTP resend failed");
    }
  }
};


  // VERIFY OTP
  const handleVerifyOtp = async () => {
    setLoading(true);
    setStatusMsg("");
    const data = await adminVerifyOtp({
      userid: form.userid,
      userOtp: form.userOtp,
      ownerOtp: form.ownerOtp
    });
    setLoading(false);

    if (data?.success) {
      setMode("login");
      setStatusMsg("✅ OTP verified! Please login.");
    } else {
      setStatusMsg(data?.message || "OTP verification failed");
    }
  };

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-md p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center">
          {mode === "login" && "Admin Login"}
          {mode === "register" && "Register New Admin"}
          {mode === "otp" && "Verify OTP"}
        </h1>
        {statusMsg && (
          <div className="text-sm text-center text-red-600">{statusMsg}</div>
        )}

        {/* LOGIN */}
        {mode === "login" && (
          <>
            <input
              className={inputClass}
              placeholder="User ID"
              value={form.userid}
              onChange={(e) => updateForm("userid", e.target.value)}
            />
            <input
              className={inputClass}
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => updateForm("password", e.target.value)}
            />
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            <p className="text-center text-sm text-gray-600">
              No account?{" "}
              <button
                onClick={() => setMode("register")}
                className="text-indigo-600 hover:underline"
              >
                Register
              </button>
            </p>
          </>
        )}

        {/* REGISTER */}
        {mode === "register" && (
          <>
            <input
              className={inputClass}
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => updateForm("name", e.target.value)}
            />
            <input
              className={inputClass}
              placeholder="User ID"
              value={form.userid}
              onChange={(e) => updateForm("userid", e.target.value)}
            />
            <input
              className={inputClass}
              placeholder="Phone Number"
              value={form.phone}
              onChange={(e) => updateForm("phone", e.target.value)}
            />
            <input
              className={inputClass}
              placeholder="Email Address"
              value={form.email}
              onChange={(e) => updateForm("email", e.target.value)}
            />
            <input
              className={inputClass}
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => updateForm("password", e.target.value)}
            />
            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
            >
              {loading ? "Registering..." : "Register"}
            </button>
            <p className="text-center text-sm text-gray-600">
              Already registered?{" "}
              <button
                onClick={() => setMode("login")}
                className="text-indigo-600 hover:underline"
              >
                Login
              </button>
            </p>
          </>
        )}

        {/* OTP */}
{mode === "otp" && (
  <>
    <input
      className={inputClass}
      placeholder="User OTP"
      value={form.userOtp}
      onChange={(e) => updateForm("userOtp", e.target.value)}
    />
    <input
      className={inputClass}
      placeholder="Owner OTP"
      value={form.ownerOtp}
      onChange={(e) => updateForm("ownerOtp", e.target.value)}
    />
    <div className="flex justify-between gap-2">
      <button
        onClick={handleVerifyOtp}
        disabled={loading}
        className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
      >
        {loading ? "Verifying..." : "Submit OTP"}
      </button>
      <button
        onClick={handleResendOtp}
        disabled={resendTimer > 0}
        className={`flex-1 ${
          resendTimer > 0
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : "bg-yellow-500 hover:bg-yellow-600 text-white"
        } py-2 rounded-lg`}
      >
        {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
      </button>
    </div>
  </>
)}

      </div>
    </div>
  );
}
