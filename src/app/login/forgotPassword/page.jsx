"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { account } from "../../../context/appwrite";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const router = useRouter();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await account.createRecovery(email, `${window.location.origin}/reset-password`);
      setMessage("Password reset email sent! Please check your inbox.");
    } catch (error) {
      toast.error("Failed to send recovery email:", error);
      setMessage("Failed to send reset email. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-semibold mb-4">Forgot Password</h1>
      <form className="w-full max-w-sm" onSubmit={handleForgotPassword}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          required
        />
        <button
          type="submit"
          className={`w-full py-2 bg-blue-500 text-white rounded ${loading ? "opacity-50" : ""}`}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
      {message && <p className="mt-4 text-center">{message}</p>}
      <button
        onClick={() => router.push("/login")}
        className="mt-4 text-blue-500"
      >
        Back to Login
      </button>
    </div>
  );
};

export default ForgotPassword;
