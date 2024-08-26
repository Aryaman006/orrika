"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { account } from "../../context/appwrite";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const userId = searchParams.get("userId");
  const secret = searchParams.get("secret");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      await account.updateRecovery(userId, secret, password, confirmPassword);
      toast.success("Password reset successfully.");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      toast.error("Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 flex items-center justify-center">
      <form className="flex flex-col gap-8" onSubmit={handleResetPassword}>
        <h1 className="text-2xl font-semibold">Reset Password</h1>
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-700">New Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your new password"
            className="ring-2 ring-gray-300 rounded-md p-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-700">Confirm New Password</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm your new password"
            className="ring-2 ring-gray-300 rounded-md p-4"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button
          className="bg-lama text-white bg-green-700 p-2 rounded-md disabled:bg-pink-200 disabled:text-white disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
