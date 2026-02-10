import { Edit3, Key, LogOut, Download, Monitor } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className='w-full h-fit grid grid-cols-10 gap-2 mb-12'>
      {/* 70% Main Card: Edit/View User Info */}
      <div className='col-span-7 flex flex-col gap-2'>
        <div className='bg-white rounded-xl p-4 pb-12 border border-slate-300 flex flex-col gap-6'>
          <h2 className='text-xl font-bold text-slate-700'>
            Profile Information
          </h2>
          {/* About You Section */}
          <div>
            <h3 className='text-md font-bold text-fuchsia-700 mb-2'>
              About You
            </h3>
            <div className='grid grid-cols-2 gap-x-6 gap-y-2'>
              <div className='flex flex-row items-center gap-2'>
                <span className='font-bold text-sm text-slate-500'>Email</span>
                <span className='text-sm text-slate-600'>user@email.com</span>
              </div>
              <div className='flex flex-row items-center gap-2'>
                <span className='font-bold text-sm text-slate-500'>
                  Username
                </span>
                <span className='text-sm text-slate-600'>user123</span>
              </div>
              <div className='flex flex-row items-center gap-2'>
                <span className='font-bold text-sm text-slate-500'>Role</span>
                <span className='text-sm text-slate-600'>Tenant</span>
              </div>
              <div className='flex flex-row items-center gap-2'>
                <span className='font-bold text-sm text-slate-500'>
                  Full Name
                </span>
                <span className='text-sm text-slate-600'>John Doe</span>
              </div>
              <div className='flex flex-row items-center gap-2'>
                <span className='font-bold text-sm text-slate-500'>Phone</span>
                <span className='text-sm text-slate-600'>+63 912 345 6789</span>
              </div>
              <div className='flex flex-row items-center gap-2'>
                <span className='font-bold text-sm text-slate-500'>Status</span>
                <span className='text-sm text-slate-600'>Active</span>
              </div>
              <div className='flex flex-row items-center gap-2'>
                <span className='font-bold text-sm text-slate-500'>
                  Account Created
                </span>
                <span className='text-sm text-slate-600'>2026-02-10</span>
              </div>
            </div>
          </div>
          {/* Your Room Section */}
          <div>
            <h3 className='text-md font-bold text-fuchsia-700 mb-2'>
              Your Room
            </h3>
            {/* Renting status - first info */}
            <div className='mb-2'>
              <div className='flex flex-row items-center gap-2'>
                <span className='font-bold text-xs text-slate-500'>
                  Renting
                </span>
                <span className='text-xs text-slate-600'>Yes</span>
              </div>
            </div>
            {/* If renting, show rest of info */}
            {/* Replace 'Yes' with 'No' to hide below */}
            {true && (
              <>
                <div className='grid grid-cols-2 gap-x-6 gap-y-2'>
                  <div className='flex flex-row items-center gap-2'>
                    <span className='font-bold text-xs text-slate-500'>
                      Room Number
                    </span>
                    <span className='text-xs text-slate-600'>101</span>
                  </div>
                  <div className='flex flex-row items-center gap-2'>
                    <span className='font-bold text-xs text-slate-500'>
                      Floor
                    </span>
                    <span className='text-xs text-slate-600'>1</span>
                  </div>
                  <div className='flex flex-row items-center gap-2'>
                    <span className='font-bold text-xs text-slate-500'>
                      Type
                    </span>
                    <span className='text-xs text-slate-600'>Studio</span>
                  </div>
                  <div className='flex flex-row items-center gap-2'>
                    <span className='font-bold text-xs text-slate-500'>
                      Status
                    </span>
                    <span className='text-xs text-slate-600'>Occupied</span>
                  </div>
                  <div className='flex flex-row items-center gap-2'>
                    <span className='font-bold text-xs text-slate-500'>
                      Base Rent
                    </span>
                    <span className='text-xs text-slate-600'>₱12,000.00</span>
                  </div>
                  <div className='flex flex-row items-center gap-2'>
                    <span className='font-bold text-xs text-slate-500'>
                      Lease Period
                    </span>
                    <span className='text-xs text-slate-600'>
                      2026-01-01 to 2026-12-31
                    </span>
                  </div>
                </div>
                {/* Your Payments Section */}
                <div className='mt-6'>
                  <h3 className='text-md font-bold text-fuchsia-700 mb-2'>
                    Your Payments
                  </h3>
                  <div className='grid grid-cols-2 gap-x-6 gap-y-2'>
                    <div className='flex flex-row items-center gap-2'>
                      <span className='font-bold text-xs text-slate-500'>
                        Total Payments
                      </span>
                      <span className='text-xs text-slate-600'>12</span>
                    </div>
                    <div className='flex flex-row items-center gap-2'>
                      <span className='font-bold text-xs text-slate-500'>
                        Overdue Payments
                      </span>
                      <span className='text-xs text-slate-600'>1</span>
                    </div>
                    <div className='flex flex-row items-center gap-2'>
                      <span className='font-bold text-xs text-slate-500'>
                        Total Amount Paid
                      </span>
                      <span className='text-xs text-slate-600'>
                        ₱120,000.00
                      </span>
                    </div>
                    <div className='flex flex-row items-center gap-2'>
                      <span className='font-bold text-xs text-slate-500'>
                        Outstanding Balance
                      </span>
                      <span className='text-xs text-slate-600'>₱12,000.00</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {/* 30% Side Card: Quick Details/Actions */}
      <div className='col-span-3 flex flex-col gap-2'>
        <div className='bg-white rounded-xl p-4 border border-slate-300 flex flex-col h-full'>
          <h2 className='text-md font-bold text-slate-700 mb-4'>
            Profile Actions
          </h2>
          <div className='flex flex-col gap-2'>
            <button className='flex flex-row items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-300 text-fuchsia-700 text-xs font-semibold hover:bg-fuchsia-50 hover:border-fuchsia-700 hover:text-fuchsia-800 transition-colors cursor-pointer'>
              <Edit3 size={18} className='text-fuchsia-700' /> Edit Info
            </button>
            <button className='flex flex-row items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-300 text-fuchsia-700 text-xs font-semibold hover:bg-fuchsia-50 hover:border-fuchsia-700 hover:text-fuchsia-800 transition-colors cursor-pointer'>
              <Key size={18} className='text-fuchsia-700' /> Change Password
            </button>
            <button className='flex flex-row items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-300 text-fuchsia-700 text-xs font-semibold hover:bg-fuchsia-50 hover:border-fuchsia-700 hover:text-fuchsia-800 transition-colors cursor-pointer'>
              <Download size={18} className='text-fuchsia-700' /> Export Data
            </button>
            <button className='flex flex-row items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-300 text-fuchsia-700 text-xs font-semibold hover:bg-fuchsia-50 hover:border-fuchsia-700 hover:text-fuchsia-800 transition-colors cursor-pointer'>
              <Monitor size={18} className='text-fuchsia-700' /> Manage Sessions
            </button>
            <button className='flex flex-row items-center gap-2 px-4 py-2 rounded-xl bg-white border border-red-500 text-red-600 text-xs font-semibold hover:bg-red-50 hover:border-red-600 hover:text-red-800 transition-colors cursor-pointer'>
              <LogOut size={18} className='text-red-600' /> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
