import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";


export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSignIn() {
    setLoading(true);

    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    setLoading(false);

    if (!res.ok) {
      alert("Invalid credentials");
      return;
    }

    const data = await res.json();
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);
    navigate("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-teal-50">
      <div className="w-full max-w-md rounded-3xl border border-gray-200 shadow-xl p-10 bg-white">

        {/* Logo / Brand */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-1">
            <img src={logo} alt="GopherNet Logo" className="h-10 w-10" />
            <span className="text-2xl font-bold text-gray-900 tracking-wide">
              GopherNet
            </span>
          </div>
        </div>

        <h1 className="text-3xl font-semibold text-center text-gray-900 mb-1">
          Sign in
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Access your dashboard
        </p>

        {/* Demo credentials */}
        <div className="mb-6 rounded-xl border border-teal-200 bg-teal-50 p-5 text-sm text-teal-900 shadow-inner">
          <p className="font-semibold mb-2">Demo Credentials</p>
          <p>Username: <b>admin</b></p>
          <p>Password: <b>admin123</b></p>
        </div>

        {/* Form */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Username
            </label>
            <input
              className="w-full rounded-xl border border-gray-300 px-5 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 transition shadow-sm"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              className="w-full rounded-xl border border-gray-300 px-5 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 transition shadow-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            onClick={handleSignIn}
            disabled={loading}
            className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 transition-colors text-white py-3 font-medium shadow-md"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          New to GopherNet?
          <span className="ml-1 cursor-not-allowed underline">
            Create an account
          </span>
        </div>
      </div>
    </div>
  );
}
