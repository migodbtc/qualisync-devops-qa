import React from "react";

interface AuthSplitLayoutProps {
  children: React.ReactNode;
}

const SYSTEM_NAME = "Thicket: Apartment Tenant Management System";

export default function AuthSplitLayout({ children }: AuthSplitLayoutProps) {
  return (
    <div className='min-h-screen flex flex-row bg-gray-50'>
      <div className='flex-1 flex flex-col items-center justify-center'>
        {children}
      </div>
      <div className='hidden lg:flex lg:flex-col lg:gap-4 w-1/2 bg-linear-to-br from-fuchsia-600 to-purple-700 items-center justify-center'>
        <span className='w-full max-w-1/2 text-white text-5xl font-bold select-none text-center'>
          Thicket by Migo
        </span>
        <span className='text-md text-white'>
          Apartment-Tenant Management System
        </span>
      </div>
    </div>
  );
}
