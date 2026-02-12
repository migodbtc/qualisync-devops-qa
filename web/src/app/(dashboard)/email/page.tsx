import React from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link,
  Paperclip,
  User,
  Shield,
  Mail,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

export default function EmailPage() {
  return (
    <div className='w-full h-fit grid grid-cols-10 gap-2 mb-12'>
      {/* 70% Email Features */}
      <div className='col-span-7 flex flex-col gap-2'>
        <div className='bg-white rounded-xl p-4 border border-slate-300 flex flex-col gap-4'>
          <h2 className='text-xl font-bold text-slate-700 mb-2'>Send Email</h2>
          <form className='flex flex-col gap-4'>
            <div className='flex flex-col gap-4 items-end'>
              <div className='w-full flex flex-col'>
                <label
                  htmlFor='recipient'
                  className='text-xs text-slate-500 mb-0.5 ml-1'
                >
                  Recipient (Max 10)
                </label>
                <div className='flex flex-row gap-2 mb-2 mt-1'>
                  {/* Mock email badges with purple bg, white text, icons, and X button */}
                  <span className='flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-700 text-white text-xs font-semibold cursor-pointer shadow-sm'>
                    <User size={16} className='text-white' />
                    johndoe@example.com
                    <button type='button' className='ml-1 p-0.5'>
                      <X
                        size={14}
                        className='text-slate-200 hover:text-fuchsia-300 transition-colors'
                      />
                    </button>
                  </span>
                  <span className='flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-700 text-white text-xs font-semibold cursor-pointer shadow-sm'>
                    <Mail size={16} className='text-white' />
                    janesmith@example.com
                    <button type='button' className='ml-1 p-0.5'>
                      <X
                        size={14}
                        className='text-slate-200 hover:text-fuchsia-300 transition-colors'
                      />
                    </button>
                  </span>
                  <span className='flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-700 text-white text-xs font-semibold cursor-pointer shadow-sm'>
                    <Shield size={16} className='text-white' />
                    admin@atms.com
                    <button type='button' className='ml-1 p-0.5'>
                      <X
                        size={14}
                        className='text-slate-200 hover:text-fuchsia-300 transition-colors'
                      />
                    </button>
                  </span>
                  <span className='flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-700 text-white text-xs font-semibold cursor-pointer shadow-sm'>
                    <Mail size={16} className='text-white' />
                    support@atms.com
                    <button type='button' className='ml-1 p-0.5'>
                      <X
                        size={14}
                        className='text-slate-200 hover:text-fuchsia-300 transition-colors'
                      />
                    </button>
                  </span>
                </div>
                <input
                  type='email'
                  id='recipient'
                  name='recipient'
                  className='w-full h-9 rounded-xl border border-slate-300 bg-white text-slate-700 text-sm px-2 focus:outline-none cursor-pointer'
                  placeholder='Enter recipient email'
                />
              </div>
              <div className='w-full flex flex-col'>
                <label
                  htmlFor='header'
                  className='text-xs text-slate-500 mb-0.5 ml-1'
                >
                  Header
                </label>
                <input
                  type='text'
                  id='header'
                  name='header'
                  className='w-full h-9 rounded-xl border border-slate-300 bg-white text-slate-700 text-sm px-2 focus:outline-none cursor-pointer'
                  placeholder='Enter email subject'
                />
              </div>
            </div>
            <div className='flex flex-col flex-1 min-w-0'>
              <label
                htmlFor='body'
                className='text-xs text-slate-500 mb-0.5 ml-1'
              >
                Body
              </label>
              <div className='flex flex-row flex-wrap gap-1 mb-2 '>
                <button
                  type='button'
                  className='w-9 h-9 flex items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                  title='Bold'
                >
                  <Bold size={18} />
                </button>
                <button
                  type='button'
                  className='w-9 h-9 flex items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                  title='Italic'
                >
                  <Italic size={18} />
                </button>
                <button
                  type='button'
                  className='w-9 h-9 flex items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                  title='Underline'
                >
                  <Underline size={18} />
                </button>
                <button
                  type='button'
                  className='w-9 h-9 flex items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                  title='Strikethrough'
                >
                  <Strikethrough size={18} />
                </button>
                <select
                  className='w-24 h-9 rounded-xl border border-slate-300 bg-white text-slate-700 text-sm font-semibold'
                  title='Font Size'
                >
                  <option>Font Size</option>
                  <option>Small</option>
                  <option>Medium</option>
                  <option>Large</option>
                </select>
                <button
                  type='button'
                  className='w-9 h-9 flex items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                  title='Font Color'
                >
                  <input
                    type='color'
                    className='relative w-7 h-7 cursor-pointer'
                    title='Font Color'
                  />
                </button>
                <button
                  type='button'
                  className='w-9 h-9 flex items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                  title='Bullet List'
                >
                  <List size={18} />
                </button>
                <button
                  type='button'
                  className='w-9 h-9 flex items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                  title='Numbered List'
                >
                  <ListOrdered size={18} />
                </button>
                <button
                  type='button'
                  className='w-9 h-9 flex items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                  title='Align Left'
                >
                  <AlignLeft size={18} />
                </button>
                <button
                  type='button'
                  className='w-9 h-9 flex items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                  title='Align Center'
                >
                  <AlignCenter size={18} />
                </button>
                <button
                  type='button'
                  className='w-9 h-9 flex items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                  title='Align Right'
                >
                  <AlignRight size={18} />
                </button>
                <button
                  type='button'
                  className='w-9 h-9 flex items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                  title='Insert Link'
                >
                  <Link size={18} />
                </button>
                <button
                  type='button'
                  className='w-9 h-9 flex items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                  title='Attach File'
                >
                  <Paperclip size={18} />
                </button>
              </div>
              <textarea
                id='body'
                name='body'
                className='w-full h-50 rounded-xl border border-slate-300 bg-white text-slate-700 text-sm px-2 py-2 focus:outline-none resize-none'
                placeholder='Type your email here...'
              ></textarea>
            </div>
            <button
              type='submit'
              className='h-9 px-4 rounded-xl font-semibold text-xs bg-fuchsia-700 text-white shadow hover:bg-fuchsia-800 transition-colors cursor-pointer self-end'
            >
              Send Email
            </button>
          </form>
        </div>
        {/* Email Format Template Buttons Card */}
        <div className='bg-white rounded-xl p-4 border border-slate-300 flex flex-col gap-2 mb-2'>
          <h2 className='text-md font-bold text-slate-700 '>
            Email Format Templates
          </h2>
          <div className='flex flex-row gap-2 items-center'>
            <button className='flex flex-row items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-300 text-fuchsia-700 text-xs font-semibold shadow-sm hover:bg-fuchsia-50 hover:border-fuchsia-700 hover:text-fuchsia-800 transition-colors cursor-pointer'>
              <Mail size={18} className='text-fuchsia-700' /> Billing Reminder
            </button>
            <button className='flex flex-row items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-300 text-fuchsia-700 text-xs font-semibold shadow-sm hover:bg-fuchsia-50 hover:border-fuchsia-700 hover:text-fuchsia-800 transition-colors cursor-pointer'>
              <Strikethrough size={18} className='text-fuchsia-700' /> Overdue
              Payment
            </button>
            <button className='flex flex-row items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-300 text-fuchsia-700 text-xs font-semibold shadow-sm hover:bg-fuchsia-50 hover:border-fuchsia-700 hover:text-fuchsia-800 transition-colors cursor-pointer'>
              <Paperclip size={18} className='text-fuchsia-700' /> Lease Renewal
            </button>
            <button className='flex flex-row items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-300 text-fuchsia-700 text-xs font-semibold shadow-sm hover:bg-fuchsia-50 hover:border-fuchsia-700 hover:text-fuchsia-800 transition-colors cursor-pointer'>
              <User size={18} className='text-fuchsia-700' /> Welcome Email
            </button>
            <button className='flex flex-row items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-300 text-fuchsia-700 text-xs font-semibold shadow-sm hover:bg-fuchsia-50 hover:border-fuchsia-700 hover:text-fuchsia-800 transition-colors cursor-pointer'>
              <Shield size={18} className='text-fuchsia-700' /> Policy Update
            </button>
          </div>
        </div>
      </div>
      {/* 30% Side Card - Now longer for user list */}
      <div className='col-span-3 flex flex-col gap-2'>
        {/* Paginated User List */}
        <div className='bg-white rounded-xl p-4 border border-slate-300 flex flex-col h-full'>
          <h2 className='text-md font-bold text-slate-700 mb-4'>
            Email Search
          </h2>
          {/* Filter Row */}
          <div className='flex flex-row gap-2 items-center mb-2 text-xs'>
            <input
              type='text'
              className='w-32 h-8 rounded-xl border border-slate-300 bg-white text-slate-700 text-xs px-2 focus:outline-none'
              placeholder='Search name/email'
            />
            <select className='w-24 h-8 rounded-xl border border-slate-300 bg-white text-slate-700 text-xs px-2 focus:outline-none'>
              <option>Role</option>
              <option>Tenant</option>
              <option>Admin</option>
              <option>Staff</option>
            </select>
            <select className='w-24 h-8 rounded-xl border border-slate-300 bg-white text-slate-700 text-xs px-2 focus:outline-none'>
              <option>Room</option>
              <option>Assigned</option>
              <option>Unassigned</option>
            </select>
          </div>
          {/* Compressed Card List */}
          <div className='flex-1 overflow-y-auto flex flex-col gap-2'>
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className='group flex flex-row items-center justify-between bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer gap-4'
              >
                {/* Left: Name & Email */}
                <div className='flex flex-col min-w-0'>
                  <span className='font-semibold text-slate-700 text-sm truncate'>
                    Jane Smith {i + 1}
                  </span>
                  <span className='text-xs text-slate-500 truncate group-hover:text-fuchsia-700 transition-colors'>
                    janesmith{i + 1}@example.com
                  </span>
                </div>
                {/* Right: Role badge & Apartment */}
                <div className='flex flex-col items-end gap-1'>
                  <span className='px-3 py-1 rounded-full bg-fuchsia-700 text-white text-xs font-semibold shadow-sm'>
                    Tenant
                  </span>
                  <span className='text-xs text-slate-600 font-medium'>
                    {i % 2 === 0 ? `Apt. ${201 + i} - 1BR` : "Unassigned"}
                  </span>
                </div>
              </div>
            ))}
          </div>
          {/* Pagination Controls */}
          <div className='mt-4 flex flex-row items-center justify-between text-xs'>
            {/* Left: Page info */}
            <div className='flex flex-row items-center gap-2 text-slate-500'>
              <span>Page 1 of 30</span>
            </div>
            {/* Right: Pagination controls */}
            <div className='flex flex-row items-center gap-1'>
              <button
                className='w-7 h-7 flex items-center justify-center border border-slate-300 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer'
                aria-label='First page'
              >
                <ChevronsLeft size={16} />
              </button>
              <button
                className='w-7 h-7 flex items-center justify-center border border-slate-300 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer'
                aria-label='Previous page'
              >
                <ChevronLeft size={16} />
              </button>
              <span className='px-2 font-semibold text-slate-700'>1</span>
              <button
                className='w-7 h-7 flex items-center justify-center border border-slate-300 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer'
                aria-label='Next page'
              >
                <ChevronRight size={16} />
              </button>
              <button
                className='w-7 h-7 flex items-center justify-center border border-slate-300 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer'
                aria-label='Last page'
              >
                <ChevronsRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
