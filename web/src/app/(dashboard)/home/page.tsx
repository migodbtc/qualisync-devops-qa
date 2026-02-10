import React from "react";

export default function DashboardPage() {
  redirect("/wip");
  
  return (
    <div className='w-full h-full flex flex-col gap-2'>
      <div className='w-full h-48 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2'>
        <div className='bg-white rounded-xl p-4 border border-slate-300'>
          Card
        </div>
        <div className='bg-white rounded-xl p-4 border border-slate-300'>
          Card
        </div>
        <div className='bg-white rounded-xl p-4 border border-slate-300'>
          Card
        </div>
        <div className='bg-white rounded-xl p-4 border border-slate-300'>
          Card
        </div>
      </div>
      <div className='w-full h-96 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2'>
        <div className='bg-white rounded-xl p-4 border border-slate-300 col-span-3'>
          Card
        </div>
        <div className='bg-white rounded-xl p-4 border border-slate-300'>
          Card
        </div>
      </div>
    </div>
  );
}
