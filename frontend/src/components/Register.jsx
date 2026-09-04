import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { HiOutlineUser, HiOutlineMail, HiOutlineLockClosed } from "react-icons/hi";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await register(fullName, email, password);
      navigate("/home");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await loginWithGoogle();
      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a0f0a] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans mesh-bg">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-3 mb-8 group">
          <div className="w-12 h-12 rounded-2xl bg-[#fdf8f5] text-[#1a0f0a] flex items-center justify-center font-black text-2xl shadow-2xl italic group-hover:scale-110 transition-transform">TL</div>
          <span className="text-3xl font-black text-[#fdf8f5] tracking-tighter uppercase italic">TruthLens</span>
        </Link>
        <h2 className="text-4xl font-black text-[#fdf8f5] uppercase italic tracking-tighter">Create Account</h2>
        <p className="mt-3 text-[10px] font-black text-[#8d7b68] uppercase tracking-[0.2em] italic underline decoration-[#fdf8f5]/10">
          Already an analyst?{' '}
          <Link to="/login" className="text-[#fdf8f5] hover:tracking-widest transition-all">
            Sign in to your Terminal
          </Link>
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="glass-card py-10 px-8 border border-[#fdf8f5]/10 sm:rounded-2xl sm:px-12 bg-[#261a14]/60 backdrop-blur-3xl shadow-[0_0_60px_rgba(0,0,0,0.6)]">
          
          {error && (
            <div className="mb-8 p-4 bg-[#fdf8f5]/5 border border-[#fdf8f5]/20 text-[#fdf8f5] text-[10px] font-black uppercase tracking-widest italic animate-pulse">
              ERROR: {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-[10px] font-black text-[#8d7b68] uppercase tracking-[0.3em] mb-3 italic">Full Name</label>
              <div className="relative group">
                <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4d3c2e] group-focus-within:text-[#fdf8f5] w-5 h-5 transition-colors" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-[#1a0f0a] border border-[#fdf8f5]/10 rounded-2xl text-xs font-black uppercase tracking-widest focus:border-[#fdf8f5] outline-none transition-all text-[#fdf8f5] placeholder:text-[#4d3c2e] italic"
                  placeholder="YOUR FULL NAME"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-[#8d7b68] uppercase tracking-[0.3em] mb-3 italic">Email Address</label>
              <div className="relative group">
                <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4d3c2e] group-focus-within:text-[#fdf8f5] w-5 h-5 transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-[#1a0f0a] border border-[#fdf8f5]/10 rounded-2xl text-xs font-black uppercase tracking-widest focus:border-[#fdf8f5] outline-none transition-all text-[#fdf8f5] placeholder:text-[#4d3c2e] italic"
                  placeholder="YOUR@EMAIL.COM"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-[#8d7b68] uppercase tracking-[0.3em] mb-3 italic">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-6 py-4 bg-[#1a0f0a] border border-[#fdf8f5]/10 rounded-2xl text-xs font-black uppercase tracking-widest focus:border-[#fdf8f5] outline-none transition-all text-[#fdf8f5] placeholder:text-[#4d3c2e] italic"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-[#8d7b68] uppercase tracking-[0.3em] mb-3 italic">Confirm Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-6 py-4 bg-[#1a0f0a] border border-[#fdf8f5]/10 rounded-2xl text-xs font-black uppercase tracking-widest focus:border-[#fdf8f5] outline-none transition-all text-[#fdf8f5] placeholder:text-[#4d3c2e] italic"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 px-6 mt-6 shadow-2xl transition-all disabled:opacity-50"
            >
              {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
            </button>
          </form>

          <div className="mt-10">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#fdf8f5]/10" />
              </div>
              <div className="relative flex justify-center text-[9px]">
                <span className="px-4 bg-[#261a14] text-[#8d7b68] font-black uppercase tracking-[0.3em] italic">Or Sign Up With</span>
              </div>
            </div>

            <div className="mt-10">
              <button
                onClick={handleGoogleSignup}
                className="w-full inline-flex justify-center py-4 px-6 border border-[#fdf8f5]/10 rounded-2xl bg-[#fdf8f5]/5 text-[10px] font-black uppercase tracking-[0.3em] italic text-[#fdf8f5] hover:bg-[#fdf8f5] hover:text-[#1a0f0a] transition-all shadow-xl"
              >
                <svg className="h-5 w-5 mr-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" opacity="0.7"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" opacity="0.8"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" opacity="0.9"/>
                </svg>
                Google
              </button>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-12 text-center text-[9px] text-[#4d3c2e] font-black uppercase tracking-[0.4em] italic opacity-50">
        Secured by Neural Authentication Arch // 0xEspressoV4
      </p>
    </div>
  );
}
