import { redirect } from "next/navigation";
import React from "react";

import { Lock, HelpCircle } from "lucide-react";

type Room = {
  id: number;
  number: number;
  floor: number;
  type: string;
  status: "vacant" | "occupied";
  tenant: null | {
    name: string;
    email: string;
  };
};

function RoomCard({ room }: { room: Room }) {
  return (
    <div className='bg-white rounded-xl border border-slate-300 flex flex-col items-center p-4 shadow-sm transition-shadow cursor-pointer hover:shadow-md h-full'>
      <div className='w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 text-2xl font-bold mb-1'>
        <span>{room.tenant ? room.tenant.name[0] : "--"}</span>
      </div>
      <div className='text-base font-semibold text-slate-700'>
        Room {room.number}
      </div>
      <div className='text-xs text-slate-500'>
        {room.type} &bull; Floor {room.floor}
      </div>
      <div className='flex flex-col items-center gap-0.5 mt-1 mb-2'>
        <div className='text-xs text-slate-600'>
          {room.tenant ? room.tenant.name : "--"}
        </div>
        <div className='text-xs text-slate-400 truncate max-w-35'>
          {room.tenant ? room.tenant.email : "--"}
        </div>
      </div>
      <div className='mt-auto w-full border-t border-transparent pt-2 flex justify-center min-h-10'>
        <button className='h-7 px-3 rounded-xl font-semibold text-xs bg-fuchsia-700 text-white shadow hover:bg-fuchsia-800 transition-colors cursor-pointer'>
          View
        </button>
      </div>
    </div>
  );
}

function UnassignedRoomCard({ room }: { room: Room }) {
  return (
    <div className='bg-slate-200 rounded-xl border border-slate-300 flex flex-col items-center p-4 shadow-sm transition-shadow h-full'>
      <div className='w-16 h-16 rounded-full bg-slate-300 flex items-center justify-center text-slate-400 text-2xl font-bold mb-1'>
        <HelpCircle size={28} />
      </div>
      <div className='text-base font-semibold text-slate-700'>
        Room {room.number}
      </div>
      <div className='text-xs text-slate-500'>
        {room.type} &bull; Floor {room.floor}
      </div>
      <div className='flex flex-col items-center gap-1 mt-1 mb-2'>
        <div className='text-xs text-slate-500 flex items-center gap-1'>
          <Lock size={14} /> Unassigned
        </div>
      </div>
      <div className='mt-auto w-full border-t border-transparent pt-2 flex justify-center min-h-10'>
        <button className='h-7 px-3 rounded-xl font-semibold text-xs bg-white border border-slate-300 text-green-700 hover:bg-green-50 transition-colors cursor-pointer'>
          Assign
        </button>
      </div>
    </div>
  );
}

export default function RoomsPage() {
  const rooms: Room[] = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    number: 100 + i,
    floor: Math.floor(i / 4) + 1,
    type: ["Studio", "1BR", "2BR", "3BR"][i % 4],
    status: i % 5 === 0 ? "vacant" : "occupied",
    tenant:
      i % 5 === 0
        ? null
        : {
            name: `John Doe ${i + 1}`,
            email: `johndoe${i + 1}@example.com`,
          },
  }));

  return (
    <div className='w-full h-fit grid grid-cols-10 gap-2 mb-12'>
      <div className='col-span-7 flex flex-col gap-2'>
        <div className='bg-white h-16 rounded-xl p-2 border border-slate-300 flex items-center justify-between'>
          <div className='flex flex-row gap-2'>
            <select className='w-28 h-9 rounded-xl border border-slate-300 bg-white text-slate-700 text-sm px-2 focus:outline-none cursor-pointer'>
              <option>Type</option>
              <option>Studio</option>
              <option>1BR</option>
              <option>2BR</option>
              <option>3BR</option>
            </select>
            <select className='w-28 h-9 rounded-xl border border-slate-300 bg-white text-slate-700 text-sm px-2 focus:outline-none cursor-pointer'>
              <option>Status</option>
              <option>Occupied</option>
              <option>Vacant</option>
            </select>
          </div>
          <div className='flex flex-row gap-2 ml-auto'>
            <button className='h-9 px-4 rounded-xl font-semibold text-xs bg-white border border-slate-300 text-fuchsia-800 hover:bg-slate-50 transition-colors cursor-pointer'>
              Export CSV
            </button>
          </div>
        </div>
        <div className='bg-white rounded-xl p-2 border border-slate-300 flex flex-col h-full'>
          <div className='flex-1'>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 h-full'>
              {rooms.map((room) =>
                room.status === "vacant" ? (
                  <UnassignedRoomCard key={room.id} room={room} />
                ) : (
                  <RoomCard key={room.id} room={room} />
                ),
              )}
            </div>
          </div>
        </div>
      </div>
      <div className='col-span-3 flex flex-col gap-2'>
        <div className='bg-white rounded-xl p-4 border border-slate-300 flex flex-col mb-2'>
          <div className='text-lg font-bold text-slate-700 mb-2'>Floors</div>
          <div className='grid grid-cols-6 gap-2'>
            {Array.from({ length: 14 }, (_, i) => (
              <button
                key={i + 1}
                className='h-8 px-4 rounded-xl font-semibold text-xs bg-white border border-slate-300 text-fuchsia-800 hover:bg-fuchsia-50 transition-colors cursor-pointer'
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
        {/* Stat Cards: 1 per row, directly below floor nav */}
        <div className='bg-white rounded-xl p-4 border border-slate-300 flex flex-col items-start shadow-sm mb-2'>
          <span className='text-xs text-slate-500 mb-1'>
            Total Available Rooms
          </span>
          <span className='text-2xl font-bold text-green-700 mb-1'>
            {rooms.filter((r) => r.status === "vacant").length}
          </span>
          <span className='text-xs text-slate-400'>Rooms currently vacant</span>
        </div>
        <div className='bg-white rounded-xl p-4 border border-slate-300 flex flex-col items-start shadow-sm mb-2'>
          <span className='text-xs text-slate-500 mb-1'>
            Total Occupied Rooms
          </span>
          <span className='text-2xl font-bold text-fuchsia-700 mb-1'>
            {rooms.filter((r) => r.status === "occupied").length}
          </span>
          <span className='text-xs text-slate-400'>
            Rooms currently occupied
          </span>
        </div>
        <div className='bg-white rounded-xl p-4 border border-slate-300 flex flex-col items-start shadow-sm mb-2'>
          <span className='text-xs text-slate-500 mb-1'>Monthly Revenue</span>
          <span className='text-2xl font-bold text-slate-700 mb-1'>
            ₱
            {(
              rooms.filter((r) => r.status === "occupied").length * 12000
            ).toLocaleString()}
          </span>
          <span className='text-xs text-slate-400'>
            Estimated from occupied rooms
          </span>
        </div>
        <div className='bg-white rounded-xl p-4 border border-slate-300 flex flex-col items-start shadow-sm mb-2'>
          <span className='text-xs text-slate-500 mb-1'>Overdue Payments</span>
          <span className='text-2xl font-bold text-red-600 mb-1'>
            ₱
            {(
              rooms.filter((r) => r.status === "occupied").length * 1200
            ).toLocaleString()}
          </span>
          <span className='text-xs text-slate-400'>
            Based on migration schema
          </span>
        </div>
      </div>
    </div>
  );
}
