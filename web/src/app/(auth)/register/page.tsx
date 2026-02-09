import { Mail, Lock, User, UserPlus } from "lucide-react";

export default function RegisterPage() {
  return (<>
      <h2 className='w-sm text-left text-2xl font-bold text-gray-700 mb-1 flex flex-row gap-2'>
        Register for Thicket
      </h2>
      <span className='w-sm text-left text-xs text-gray-600 italic'>
        Create your account to access the ATMS. Personal information can be
        edited once account has been approved.
      </span>
      <form className='w-full max-w-sm bg-white py-8 rounded-lg flex flex-col gap-4'>
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
            />
          </div>
        </div>
        <button
          type='submit'
          className='bg-fuchsia-600 text-white font-semibold py-2 mt-4 rounded-md hover:bg-fuchsia-700 transition cursor-pointer'
        >
          Register
        </button>
        <div className='text-xs mt-2'>
          <a href='/login' className='text-gray-600 italic hover:underline'>
            Already have an account?{" "}
            <span className='text-fuchsia-600'>Login</span>
          </a>
        </div>
      </form></>
  );
}
