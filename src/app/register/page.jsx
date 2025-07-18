"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { account } from "../../context/appwrite";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const router = useRouter();


  const handleSubmit = async (e) => {
    try {
      e.preventDefault()
      const response = await account.create("unique()", email, password, username,address);
      toast.success('email is registered successfully .');
      console.log(response);
      
      setIsLoading(true)
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      toast.error(error);
    }
  };


  const handleNavigate = () => {
    router.push("/login");
  };

  return (
    <div className="h-[calc(100vh-80px)] px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 flex items-center justify-center">
      <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-semibold">Register</h1>
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-700">Username</label>
          <input
            type="text"
            name="username"
            placeholder="john"
            className="ring-2 ring-gray-300 rounded-md p-4"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-700">Phone</label>
          <input
            type="tel"
            name="phone"
            placeholder="Enter your number"
            className="ring-2 ring-gray-300 rounded-md p-4"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
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
          <label className="text-sm text-gray-700">Address</label>
          <input
            type="text"
            name="address"
            placeholder="Enter Address"
            className="ring-2 ring-gray-300 rounded-md p-4"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <button
          className="bg-lama text-white bg-green-700 p-2 rounded-md disabled:bg-pink-200 disabled:text-white disabled:cursor-not-allowed"
          disabled={isLoading} onClick={(e)=>handleSubmit(e)}
        >
          {isLoading ? "Loading..." : "Create Account"}
        </button>
        <div className="text-sm underline cursor-pointer" onClick={handleNavigate}>
          Have an account?
        </div>
      </form>
    </div>
  );
};

export default Register;
