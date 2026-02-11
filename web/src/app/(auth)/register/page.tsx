"use client";
import { Mail, Lock, User } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("tenant");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [agreedTnC, setAgreedTnC] = useState(false);
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_FLASK_API_URL || "";
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!agreedTnC || !agreedPrivacy) {
      setError("You must agree to all compliance checkboxes.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username, role }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
        return 
      }

      const savedEmail = email;
      const savedPassword = password;

      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setUsername("");
      setRole("tenant");
      setAgreedTnC(false);
      setAgreedPrivacy(false);

      // autologin on register

      try {
        const loginRes = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          credentials: "include", 
          body: JSON.stringify({email, password}),
        })

        const loginData = await loginRes.json();

        if (!loginRes.ok) {
          setError(loginData.error || "Attempted login post-registration failed!");
          return
        }

        localStorage.setItem("access_token", loginData.access_token);

        router.replace('/home')
      } catch (err) {
        setError("Login post-registration error")
      }
      
      
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <h2 className='w-sm text-left text-2xl font-bold text-gray-700 mb-1 flex flex-row gap-2'>
        Register for Thicket
      </h2>
      <span className='w-sm text-left text-xs text-gray-600 italic'>
        Create your account to access the ATMS. Personal information can be
        edited once account has been approved.
      </span>
      <form className='w-full max-w-sm bg-white py-8 rounded-lg flex flex-col gap-4' onSubmit={handleSubmit}>
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
              id='email'
              name='email'
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
              id='password'
              name='password'
              required
              placeholder='Enter your password'
              className='w-full pl-9 pr-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 placeholder:text-sm text-gray-500'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label
            htmlFor='confirmPassword'
            className='block text-[12px] font-bold text-gray-700'
          >
            Confirm Password
          </label>
          <div className='relative mt-1'>
            <Lock className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4' />
            <input
              type='password'
              id='confirmPassword'
              name='confirmPassword'
              required
              placeholder='Re-enter your password'
              className='w-full pl-9 pr-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 placeholder:text-sm text-gray-500'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>
        <div className='flex flex-col gap-2 mt-2'>
          <label className='flex items-center gap-2 text-xs text-gray-700'>
            <input
              type='checkbox'
              checked={agreedTnC}
              onChange={e => setAgreedTnC(e.target.checked)}
              className='accent-fuchsia-600 rounded border-gray-300'
              required
            />
            I agree to the <a href='/terms' className='underline text-fuchsia-600' target='_blank' rel='noopener noreferrer'>Terms &amp; Conditions</a>
          </label>
          <label className='flex items-center gap-2 text-xs text-gray-700'>
            <input
              type='checkbox'
              checked={agreedPrivacy}
              onChange={e => setAgreedPrivacy(e.target.checked)}
              className='accent-fuchsia-600 rounded border-gray-300'
              required
            />
            I agree to the <a href='/privacy' className='underline text-fuchsia-600' target='_blank' rel='noopener noreferrer'>Data Privacy Policy</a>
          </label>
        </div>
        {error && <div className='text-red-500 text-xs'>{error}</div>}
        {success && <div className='text-green-600 text-xs'>{success}</div>}
        <button
          type='submit'
          className='bg-fuchsia-600 text-white font-semibold py-2 mt-4 rounded-md hover:bg-fuchsia-700 transition cursor-pointer'
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
        <div className='text-xs mt-2'>
          <a href='/login' className='text-gray-600 italic hover:underline'>
            Already have an account?{" "}
            <span className='text-fuchsia-600'>Login</span>
          </a>
        </div>
      </form>
    </>
  );
}
