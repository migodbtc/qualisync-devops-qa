"use client";
import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_FLASK_API_URL || "";
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
      } else {
        localStorage.setItem("access_token", data.access_token);
        router.replace("/home");
      }
    } catch (err) {
      setError("Network error");
      console.log("Network error: " + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className='w-sm text-left text-2xl font-bold text-gray-700 mb-1 flex flex-row gap-2'>
        Login to Thicket
      </h2>
      <span className='w-sm text-left text-xs text-gray-600 italic'>
        Sign in to access the full extent of the ATMS
      </span>
      <form
        className='w-full max-w-sm bg-white py-8 rounded-lg flex flex-col gap-4'
        onSubmit={handleLogin}
      >
        <div>
          <label
            htmlFor='email'
            className='block text-[12px] font-bold text-gray-700'
          >
            Email
          </label>
          <div className='relative mt-1'>
            <Mail className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4' />
            <input
              type='email'
              id='login-email'
              name='email'
              data-testid='login-email'
              required
              placeholder='Enter your email'
              className='w-full pl-9 pr-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 placeholder:text-sm text-gray-500'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label
            htmlFor='password'
            className='block text-[12px] font-bold text-gray-700'
          >
            Password
          </label>
          <div className='relative mt-1'>
            <Lock className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4' />
            <input
              type='password'
              id='login-password'
              name='password'
              data-testid='login-password'
              required
              placeholder='Enter your password'
              className='w-full pl-9 pr-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 placeholder:text-sm text-gray-500'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <button
          type='submit'
          id='login-submit'
          data-testid='login-submit'
          className='bg-fuchsia-600 text-white font-semibold py-2 mt-4 rounded-md hover:bg-fuchsia-700 transition cursor-pointer'
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && (
          <div className='text-xs text-red-600 mt-2 font-semibold'>{error}</div>
        )}
        <div className='text-xs mt-2'>
          <a href='/register' className='text-gray-600 italic hover:underline'>
            Don&apos;t have an account?{" "}
            <span className='text-fuchsia-600'>Register</span>
          </a>
        </div>
      </form>
    </>
  );
}
