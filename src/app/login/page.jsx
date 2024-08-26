"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { account } from "../../context/appwrite";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await account.createEmailPasswordSession(email, password);
      toast.success("Login successful.");
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      toast.error("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigate = (path) => {
    router.push(path);
  };

  return (
    <div className="h-[calc(100vh-80px)] px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 flex items-center justify-center">
      <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-semibold">Login</h1>
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="ring-2 ring-gray-300 rounded-md p-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            className="ring-2 ring-gray-300 rounded-md p-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex justify-between items-center">
          <button
            className="bg-lama text-white bg-green-700 p-2 rounded-md disabled:bg-pink-200 disabled:text-white disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Login"}
          </button>
          <div
            className="text-sm underline cursor-pointer"
            onClick={() => handleNavigate("/login/forgotPassword")}
          >
            Forgot Password?
          </div>
        </div>
       <div
        className="text-sm underline cursor-pointer"
         onClick={() => handleNavigate("/register")}
         >
         Don&apos;t have an account? Register
        </div>

      </form>
    </div>
  );
};

export default Login;
