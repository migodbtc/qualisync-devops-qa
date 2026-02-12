"use client";
import React, { useState, useRef } from "react";
import {
  Coins,
  AlertCircle,
  CalendarClock,
  TrendingUp,
  ChevronDown,
  Hourglass,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useSidebar } from "../layout";
// Mock data for revenue growth
const revenueGrowth = [
  { month: "Mar 2025", revenue: 2000 },
  { month: "Apr 2025", revenue: 3500 },
  { month: "May 2025", revenue: 5000 },
  { month: "Jun 2025", revenue: 7000 },
  { month: "Jul 2025", revenue: 9000 },
  { month: "Aug 2025", revenue: 12000 },
  { month: "Sep 2025", revenue: 15000 },
  { month: "Oct 2025", revenue: 17000 },
  { month: "Nov 2025", revenue: 20000 },
  { month: "Dec 2025", revenue: 23000 },
  { month: "Jan 2026", revenue: 25000 },
  { month: "Feb 2026", revenue: 27000 },
];

export default function FinancePage() {
  // Example stats (replace with real data as needed)
  const [revenueScope, setRevenueScope] = useState("Monthly");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  // Revenue growth period dropdown state
  const [growthScope, setGrowthScope] = useState("All Time");
  const [growthDropdownOpen, setGrowthDropdownOpen] = useState(false);
  const growthDropdownRef = useRef<HTMLDivElement>(null);
  const { isTransitioning } = useSidebar();

  React.useEffect(() => {
    function handleGrowthClick(e: MouseEvent) {
      if (
        growthDropdownRef.current &&
        !growthDropdownRef.current.contains(e.target as Node)
      ) {
        setGrowthDropdownOpen(false);
      }
    }
    if (growthDropdownOpen) {
      document.addEventListener("mousedown", handleGrowthClick);
    } else {
      document.removeEventListener("mousedown", handleGrowthClick);
    }
    return () => document.removeEventListener("mousedown", handleGrowthClick);
  }, [growthDropdownOpen]);

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClick);
    } else {
      document.removeEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen]);

  const stats = [
    {
      icon: <AlertCircle size={22} className='mb-1 text-fuchsia-700' />,
      value: 3,
      label: "Overdue Users",
      desc: "Users with overdue payments (after assigned deadline)",
    },
    {
      icon: <Coins size={22} className='mb-1 text-fuchsia-700' />,
      value: "$3,250",
      label: "Total Overdue Amount",
      desc: "Sum of all overdue balances",
    },
    {
      icon: <CalendarClock size={22} className='mb-1 text-fuchsia-700' />,
      value: 2,
      label: "Nearing Due",
      desc: "Users nearing payment deadline (within 7 days)",
    },
    {
      icon: <TrendingUp size={22} className='mb-1 text-fuchsia-700' />,
      value: "$24,000",
      label: `Revenue`,
      desc: `Total revenue for ${revenueScope.toLowerCase() === "since start" ? "all time" : revenueScope.toLowerCase()}`,
      dropdown: true,
    },
  ];

  // Mock data for occupied rooms by type
  const occupiedRoomsData = [
    { type: "Studio", value: 4 },
    { type: "1BR", value: 3 },
    { type: "2BR", value: 2 },
    { type: "3BR", value: 1 },
  ];
  // Fuchsia shades for pie chart
  const pieColors = ["#a21caf", "#d946ef", "#f0abfc", "#f472b6"];

  // Mock info for financial stats
  const mostCommonType = "Studio";
  const totalOccupied = 10;

  return (
    <div className='w-full h-full flex flex-col gap-2 mb-12'>
      {/* Stat Cards Row */}
      <div className='w-full h-48 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2'>
        {stats.map((stat, i) => (
          <div
            key={i}
            className='bg-white rounded-xl p-4 py-8 border border-slate-300 flex flex-col justify-center relative'
            style={{ zIndex: stat.dropdown ? 20 : 1 }}
          >
            {/* Dropdown for Revenue card */}
            {stat.dropdown && (
              <div ref={dropdownRef} className='absolute top-3 right-4 z-30'>
                <button
                  className='flex items-center gap-1 px-2 py-1 rounded-lg border border-slate-200 bg-white text-xs text-slate-600 hover:bg-slate-50 focus:outline-none cursor-pointer'
                  onClick={() => setDropdownOpen((v) => !v)}
                  tabIndex={0}
                >
                  {revenueScope}
                  <ChevronDown size={16} className='ml-0.5' />
                </button>
                {dropdownOpen && (
                  <div className='absolute right-0 mt-1 w-36 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-40'>
                    {["Weekly", "Monthly", "Yearly", "Since Start"].map(
                      (scope) => (
                        <button
                          key={scope}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-fuchsia-50 text-slate-700 ${revenueScope === scope ? "font-bold bg-fuchsia-100" : ""}`}
                          onClick={() => {
                            setRevenueScope(scope);
                            setDropdownOpen(false);
                          }}
                        >
                          {scope}
                        </button>
                      ),
                    )}
                  </div>
                )}
              </div>
            )}
            {stat.icon}
            <span className='text-4xl font-bold text-slate-700 mb-1 text-left'>
              {stat.value}
            </span>
            <span className='text-xs text-slate-500 text-left font-semibold'>
              {stat.label}
            </span>
            <span className='text-xs text-slate-400 text-left'>
              {stat.desc}
            </span>
          </div>
        ))}
      </div>
      {/* Placeholder for charts and tables */}
      <div className='w-full h-120 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2'>
        {/* Revenue Growth Line Chart */}
        <div className='bg-white rounded-xl p-4 border border-slate-300 col-span-2 flex flex-col relative'>
          {/* Dropdown for growth period */}
          <div ref={growthDropdownRef} className='absolute top-3 right-4 z-30'>
            <button
              className='flex items-center gap-1 px-2 py-1 rounded-lg border border-slate-200 bg-white text-xs text-slate-600 hover:bg-slate-50 focus:outline-none cursor-pointer'
              onClick={() => setGrowthDropdownOpen((v) => !v)}
              tabIndex={0}
            >
              {growthScope}
              <ChevronDown size={16} className='ml-0.5' />
            </button>
            {growthDropdownOpen && (
              <div className='absolute right-0 mt-1 w-36 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-40'>
                {["All Time", "Yearly", "Monthly", "Weekly"].map((scope) => (
                  <button
                    key={scope}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-fuchsia-50 text-slate-700 ${growthScope === scope ? "font-bold bg-fuchsia-100" : ""}`}
                    onClick={() => {
                      setGrowthScope(scope);
                      setGrowthDropdownOpen(false);
                    }}
                  >
                    {scope}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className='font-semibold text-slate-700 mb-2 flex items-center gap-2'>
            Revenue Growth
            <span className='inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 ml-2'>
              {growthScope}
            </span>
          </div>
          <div className='flex-1 min-h-60'>
            {isTransitioning ? (
              <div className='w-full h-62.5 flex flex-col items-center justify-center text-slate-400'>
                <Hourglass size={32} className='mb-2 animate-spin-slow' />
                Sidebar is transitioning...
              </div>
            ) : (
              <ResponsiveContainer width='100%' height={250}>
                <LineChart
                  data={revenueGrowth}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray='3 3' stroke='#f1f5f9' />
                  <XAxis
                    dataKey='month'
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    angle={-30}
                    textAnchor='end'
                    height={60}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    tickFormatter={(v) => `₱${v.toLocaleString()}`}
                  />
                  <Tooltip
                    formatter={(v) => `₱${v?.toLocaleString()}`}
                    labelStyle={{ color: "#f472b6" }}
                    contentStyle={{ borderRadius: 8, fontSize: 13 }}
                  />
                  <Line
                    type='monotone'
                    dataKey='revenue'
                    stroke='#a21caf'
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#a21caf" }}
                    activeDot={{ r: 6 }}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
          {/* Finance Statistics Section */}
          <div className='mt-4 grid grid-cols-1 gap-1'>
            <div className='grid grid-cols-2 gap-2 text-sm'>
              <div className='text-slate-700 font-bold'>Revenue Change</div>
              <div className='flex items-center gap-1'>
                <span className='text-green-600 font-semibold'>290%</span>
                <svg
                  width='16'
                  height='16'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  className='text-green-600'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M5 10l7-7m0 0l7 7m-7-7v18'
                  />
                </svg>
              </div>
            </div>
            <div className='grid grid-cols-2 gap-2 text-sm'>
              <div className='text-slate-700 font-bold'>Gross Income</div>
              <div className='text-slate-500'>₱120,000</div>
            </div>
            <div className='grid grid-cols-2 gap-2 text-sm'>
              <div className='text-slate-700 font-bold'>Gross Expenditure</div>
              <div className='text-slate-500'>₱45,000</div>
            </div>
            <div className='grid grid-cols-2 gap-2 text-sm'>
              <div className='text-slate-700 font-bold'>Best Month</div>
              <div className='text-slate-500'>Dec 2025 (₱23,000)</div>
            </div>
            <div className='grid grid-cols-2 gap-2 text-sm'>
              <div className='text-slate-700 font-bold'>
                Avg. Monthly Revenue
              </div>
              <div className='text-slate-500'>₱13,750</div>
            </div>
          </div>
        </div>
        {/* Occupied Rooms Pie Chart */}
        <div className='bg-white rounded-xl p-4 border border-slate-300 col-span-2 flex flex-col relative'>
          <div className='font-semibold text-slate-700 mb-2 flex items-center gap-2'>
            Occupied Rooms by Type
            <span className='inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 ml-2'>
              {totalOccupied} Occupants
            </span>
          </div>
          <div className='flex-1 min-h-60 flex items-center justify-center'>
            {isTransitioning ? (
              <div className='w-full h-62.5 flex flex-col items-center justify-center text-slate-400'>
                <Hourglass size={32} className='mb-2 animate-spin-slow' />
                Sidebar is transitioning...
              </div>
            ) : (
              <ResponsiveContainer width='100%' height={250}>
                <PieChart>
                  <Pie
                    data={occupiedRoomsData}
                    dataKey='value'
                    nameKey='type'
                    cx='50%'
                    cy='50%'
                    outerRadius={80}
                    label={({ name, percent }) =>
                      `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                    isAnimationActive={false}
                  >
                    {occupiedRoomsData.map((entry, idx) => (
                      <Cell
                        key={`cell-${idx}`}
                        fill={pieColors[idx % pieColors.length]}
                      />
                    ))}
                  </Pie>
                  <Legend
                    verticalAlign='bottom'
                    height={36}
                    iconType='circle'
                  />
                  <Tooltip formatter={(v, n) => [`${v} rooms`, n]} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          {/* Room Financial Statistics Section */}
          <div className='mt-4 grid grid-cols-1 gap-1'>
            <div className='grid grid-cols-2 gap-2 text-sm'>
              <div className='text-slate-700 font-bold'>Highest Paid Room</div>
              <div className='text-slate-500'>
                Room 105 <span className='text-green-600'>(₱18,000)</span>
              </div>
            </div>
            <div className='grid grid-cols-2 gap-2 text-sm'>
              <div className='text-slate-700 font-bold'>Most Overdue Room</div>
              <div className='text-slate-500'>
                Room 102 <span className='text-red-600'>(₱2,500)</span>
              </div>
            </div>
            <div className='grid grid-cols-2 gap-2 text-sm'>
              <div className='text-slate-700 font-bold'>Most Common Type</div>
              <div className='text-slate-500'>{mostCommonType}</div>
            </div>
            <div className='grid grid-cols-2 gap-2 text-sm'>
              <div className='text-slate-700 font-bold'>Total Occupied</div>
              <div className='text-slate-500'>{totalOccupied}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
