import { redirect } from "next/navigation";
import React from "react";
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, Users } from "lucide-react";

export default function TenantsPage() {
  return (
    <div className='w-full h-full grid grid-cols-10 gap-2'>
      <div className='col-span-7 flex flex-col gap-2'>
        <div className='bg-white h-16 rounded-xl p-2 border border-slate-300 flex items-center justify-between'>
          {/* Left: Dropdown filters */}
          <div className="flex flex-row gap-2">
            <select className="w-28 h-9 rounded-xl border border-slate-300 bg-white text-slate-700 text-sm px-2 focus:outline-none cursor-pointer">
              <option>Role</option>
              <option>Tenant</option>
              <option>Admin</option>
              <option>Staff</option>
            </select>
            <select className="w-28 h-9 rounded-xl border border-slate-300 bg-white text-slate-700 text-sm px-2 focus:outline-none cursor-pointer">
              <option>Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
          {/* Right: Action buttons */}
          <div className="flex flex-row gap-2 ml-auto">
            <button className="h-9 px-4 rounded-xl font-semibold text-xs bg-fuchsia-700 text-white shadow hover:bg-fuchsia-800 transition-colors cursor-pointer">Add Tenant</button>
            <button className="h-9 px-4 rounded-xl font-semibold text-xs bg-white border border-slate-300 text-fuchsia-800 hover:bg-slate-50 transition-colors cursor-pointer">Export CSV</button>
          </div>
        </div>
        <div className='bg-white rounded-xl p-2 border border-slate-300 flex flex-col h-full'>
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 h-full">
              {[...Array(16)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-slate-300 flex flex-col items-center p-4 gap-2 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 text-2xl font-bold mb-2">
                    {/* Placeholder profile picture */}
                    <span>{String.fromCharCode(65 + (i % 26))}</span>
                  </div>
                  <div className="text-base font-semibold text-slate-700">John Doe {i + 1}</div>
                  <div className="text-xs text-slate-500">johndoe{i + 1}@example.com</div>
                  <div className="text-xs text-slate-600">Apt. {100 + i} - 2BR</div>
                </div>
              ))}
            </div>
          </div>
          {/* Pagination Row Card */}
          <div className="bg-white rounded-xl border border-slate-300 mt-4 px-4 py-2 flex flex-row items-center justify-between text-xs shadow-sm">
            {/* Left: Page info */}
            <div className="flex flex-row items-center gap-2 text-slate-500">
              <span>Page 1 of 10</span>
              <span className="mx-2">|</span>
              <span>16 entries per page</span>
            </div>
            {/* Right: Pagination controls */}
            <div className="flex flex-row items-center gap-1">
              <button className="w-7 h-7 flex items-center justify-center border border-slate-300 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer" aria-label="First page">
                <ChevronsLeft size={16} />
              </button>
              <button className="w-7 h-7 flex items-center justify-center border border-slate-300 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer" aria-label="Previous page">
                <ChevronLeft size={16} />
              </button>
              <span className="px-2 font-semibold text-slate-700">1</span>
              <button className="w-7 h-7 flex items-center justify-center border border-slate-300 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer" aria-label="Next page">
                <ChevronRight size={16} />
              </button>
              <button className="w-7 h-7 flex items-center justify-center border border-slate-300 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer" aria-label="Last page">
                <ChevronsRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className='col-span-3 flex flex-col gap-1'>
        {/* Card 2b: Total Users */}
        <div className='bg-white rounded-xl p-4 py-8 border border-slate-300 flex flex-col justify-center mb-2'>
          <Users size={18} className="mb-1 text-fuchsia-700" />
          <span className="text-4xl font-bold text-slate-700 mb-1 text-left">128</span>
          <span className="text-xs text-slate-500 text-left">Number of tenants currently registered on the Fuchsia ATMS</span>
        </div>
        {/* Card 2a: Profile and Info */}
        <div className='bg-white rounded-xl p-4 border border-slate-300 flex flex-col'>
          {/* Profile picture */}
          <div className="flex flex-col items-center mb-4 mt-2">
            <div className="w-28 h-28 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 text-4xl font-bold mb-2">
              <span>J</span>
            </div>
          </div>
          {/* Mini rows for info */}
          <div className="flex flex-col gap-2 mb-2">
            <div className="flex flex-row justify-between items-center text-sm text-slate-500">
              <span className="font-semibold text-slate-700 w-24">Username</span>
              <span className="truncate max-w-35 text-slate-800">johndoe1</span>
            </div>
            <div className="flex flex-row justify-between items-center text-sm text-slate-500">
              <span className="font-semibold text-slate-700 w-24">Full Name</span>
              <span className="truncate max-w-35 text-slate-800">Johnathan Doe the First</span>
            </div>
            <div className="flex flex-row justify-between items-center text-sm text-slate-500">
              <span className="font-semibold text-slate-700 w-24">Email</span>
              <span className="truncate max-w-35 text-slate-800">johndoe1@example.com</span>
            </div>
            <div className="flex flex-row justify-between items-center text-sm text-slate-500">
              <span className="font-semibold text-slate-700 w-24">Phone</span>
              <span className="truncate max-w-35 text-slate-800">+63 912 345 6789</span>
            </div>
            <div className="flex flex-row justify-between items-center text-sm text-slate-500">
              <span className="font-semibold text-slate-700 w-24">Status</span>
              <span className="truncate max-w-35 text-slate-800">Active</span>
            </div>
            <div className="flex flex-row justify-between items-center text-sm text-slate-500">
              <span className="font-semibold text-slate-700 w-24">Room</span>
              <span className="truncate max-w-35 text-slate-800">Apt. 101 - 2BR</span>
            </div>
          </div>
          {/* Action buttons */}
          <div className="flex flex-row gap-2 mt-2">
            <button className="h-9 px-4 rounded-xl font-semibold text-xs bg-fuchsia-700 text-white shadow hover:bg-fuchsia-800 transition-colors cursor-pointer">View Full</button>
            <button className="h-9 px-4 rounded-xl font-semibold text-xs bg-white border border-slate-300 text-fuchsia-800 hover:bg-slate-50 transition-colors cursor-pointer">Edit</button>
            <button className="h-9 px-4 rounded-xl font-semibold text-xs bg-white border border-slate-300 text-red-600 hover:bg-red-50 transition-colors cursor-pointer">Delete</button>
          </div>
        </div>
      </div>
      {/* <div className="w-full h-48 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
        <div className="bg-white rounded-xl p-4 border border-slate-300">Card</div>
        <div className="bg-white rounded-xl p-4 border border-slate-300">Card</div>
        <div className="bg-white rounded-xl p-4 border border-slate-300">Card</div>
        <div className="bg-white rounded-xl p-4 border border-slate-300">Card</div>
      </div>
      <div className="w-full h-96 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
        <div className="bg-white rounded-xl p-4 border border-slate-300 col-span-3">Card</div>
        <div className="bg-white rounded-xl p-4 border border-slate-300">Card</div>
      </div> */}
    </div>
  );
}
