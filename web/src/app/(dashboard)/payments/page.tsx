import React from "react";
import {
  CreditCard,
  CalendarCheck,
  AlertCircle,
  Search,
  Filter,
} from "lucide-react";

const paymentSummary = [
  {
    label: "Total Collected",
    value: "₱120,000",
    icon: <CreditCard className='text-fuchsia-700' size={22} />,
  },
  {
    label: "Pending Payments",
    value: "₱8,500",
    icon: <AlertCircle className='text-fuchsia-700' size={22} />,
  },
  {
    label: "Overdue",
    value: "₱2,000",
    icon: <AlertCircle className='text-fuchsia-700' size={22} />,
  },
  {
    label: "Upcoming",
    value: "₱5,000",
    icon: <CalendarCheck className='text-fuchsia-700' size={22} />,
  },
];

const paymentTypes = ["All", "Rent", "Deposit", "Utilities", "Other"];
const paymentStatus = ["All", "Paid", "Pending", "Overdue"];

const mockPayments = [
  // February 2026
  {
    id: 1,
    user: { name: "John Doe", email: "john@example.com", avatar: "J" },
    room: { number: 101, type: "2BR" },
    type: "Rent",
    reason: "Monthly Rent",
    amount: 10000,
    status: "Paid",
    date: "2026-02-01",
  },
  {
    id: 2,
    user: { name: "Jane Smith", email: "jane@example.com", avatar: "J" },
    room: { number: 102, type: "1BR" },
    type: "Utilities",
    reason: "Water Bill",
    amount: 1200,
    status: "Pending",
    date: "2026-02-03",
  },
  {
    id: 5,
    user: { name: "Anna Cruz", email: "anna@example.com", avatar: "A" },
    room: { number: 105, type: "Studio" },
    type: "Rent",
    reason: "Monthly Rent",
    amount: 8000,
    status: "Paid",
    date: "2026-02-05",
  },
  {
    id: 6,
    user: { name: "Ben Lim", email: "ben@example.com", avatar: "B" },
    room: { number: 106, type: "2BR" },
    type: "Utilities",
    reason: "Electricity Bill",
    amount: 1500,
    status: "Paid",
    date: "2026-02-07",
  },
  // January 2026
  {
    id: 3,
    user: { name: "Carlos Tan", email: "carlos@example.com", avatar: "C" },
    room: { number: 103, type: "Studio" },
    type: "Deposit",
    reason: "Security Deposit",
    amount: 5000,
    status: "Paid",
    date: "2026-01-28",
  },
  {
    id: 4,
    user: { name: "Maria Lopez", email: "maria@example.com", avatar: "M" },
    room: { number: 104, type: "3BR" },
    type: "Other",
    reason: "Key Replacement",
    amount: 500,
    status: "Overdue",
    date: "2026-01-25",
  },
  {
    id: 7,
    user: { name: "David Ong", email: "david@example.com", avatar: "D" },
    room: { number: 107, type: "1BR" },
    type: "Rent",
    reason: "Monthly Rent",
    amount: 9000,
    status: "Paid",
    date: "2026-01-15",
  },
  {
    id: 8,
    user: { name: "Ella Yu", email: "ella@example.com", avatar: "E" },
    room: { number: 108, type: "2BR" },
    type: "Utilities",
    reason: "Internet Bill",
    amount: 1000,
    status: "Pending",
    date: "2026-01-10",
  },
];

function PaymentTransactionItem({
  payment,
}: {
  payment: (typeof mockPayments)[0];
}) {
  // Determine badge: On Time (green) or Late (red)
  const isLate = payment.status === "Overdue";
  const badgeText = isLate ? "Late" : "On Time";
  const badgeClass = isLate
    ? "bg-red-100 text-red-700"
    : "bg-green-100 text-green-700";
  return (
    <div className='group flex flex-row items-center w-full bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-150 overflow-hidden px-4 py-6 cursor-pointer'>
      {/* Left Side */}
      <div className='flex flex-row items-center gap-4 flex-1 min-w-0'>
        <div className='w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xl border border-slate-200 shrink-0'>
          {payment.user.avatar}
        </div>
        <div className='flex flex-col min-w-0'>
          <div className='flex flex-row items-center gap-2'>
            <span className='text-2xl font-bold text-slate-700'>
              ₱{payment.amount.toLocaleString()}
            </span>
            <span
              className={`text-xs font-semibold tracking-wide px-2 py-0.5 rounded-full capitalize ${badgeClass}`}
            >
              {badgeText}
            </span>
          </div>
          <span className='font-semibold text-slate-500 text-base truncate'>
            {payment.user.name}
          </span>
          <span className='text-xs text-slate-400 truncate'>
            {payment.user.email}
          </span>
        </div>
      </div>
      {/* Right Side */}
      <div className='flex flex-col items-end justify-center gap-1 min-w-35 pl-6 border-l border-slate-100 bg-slate-50 h-full'>
        <span className='text-xs text-slate-400'>{payment.type}</span>
        <span className='text-sm text-slate-500 font-medium'>
          {payment.reason}
        </span>
        <span className='text-xs text-slate-400'>
          {new Date(payment.date).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}

export default function PaymentsPage() {
  return (
    <div className='w-full h-fit flex flex-col gap-1 mb-12'>
      {/* First Row: Summary Cards */}
      <div className='w-full h-44 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2'>
        {paymentSummary.map((card, i) => (
          <div
            key={i}
            className='bg-white rounded-xl p-4 py-8 border border-slate-300 flex flex-col justify-center items-start gap-2 shadow-sm h-full min-h-27.5 max-h-44'
          >
            <div className='mb-1'>
              {/* Use the icon as in tenants card, with text-fuchsia-700 for main, or card-specific color if needed */}
              {React.cloneElement(card.icon, {
                className:
                  (card.icon.props.className || "") + " text-fuchsia-700",
              })}
            </div>
            <span className='text-3xl font-bold text-slate-700 mb-1 text-left'>
              {card.value}
            </span>
            <span className='text-xs text-slate-500 text-left italic'>
              {card.label}
            </span>
          </div>
        ))}
      </div>

      {/* Second Row: Filters/Search */}
      <div className='w-full bg-white rounded-x flex flex-wrap items-center gap-2 my-2'>
        <div className='flex flex-row gap-2 items-end'>
          <div className='flex flex-col'>
            <label
              htmlFor='type-filter'
              className='text-xs text-slate-500 mb-0.5 ml-1'
            >
              Type
            </label>
            <select
              id='type-filter'
              className='w-28 h-9 rounded-xl border border-slate-300 bg-white text-slate-700 text-sm px-2 focus:outline-none cursor-pointer'
            >
              {paymentTypes.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className='flex flex-col'>
            <label
              htmlFor='status-filter'
              className='text-xs text-slate-500 mb-0.5 ml-1'
            >
              Status
            </label>
            <select
              id='status-filter'
              className='w-28 h-9 rounded-xl border border-slate-300 bg-white text-slate-700 text-sm px-2 focus:outline-none cursor-pointer'
            >
              {paymentStatus.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </div>
          <div className='flex flex-col'>
            <label
              htmlFor='date-from'
              className='text-xs text-slate-500 mb-0.5 ml-1'
            >
              From
            </label>
            <input
              id='date-from'
              type='date'
              className='h-9 rounded-xl border border-slate-300 bg-white text-slate-700 text-sm px-2 focus:outline-none cursor-pointer'
            />
          </div>
          <div className='flex flex-col'>
            <label
              htmlFor='date-to'
              className='text-xs text-slate-500 mb-0.5 ml-1'
            >
              To
            </label>
            <input
              id='date-to'
              type='date'
              className='h-9 rounded-xl border border-slate-300 bg-white text-slate-700 text-sm px-2 focus:outline-none cursor-pointer'
            />
          </div>
        </div>
        <div className='flex flex-row gap-2 ml-auto items-end'>
          <div className='flex flex-col'>
            <label
              htmlFor='search-input'
              className='text-xs text-slate-500 mb-0.5 ml-1'
            >
              Search
            </label>
            <div className='relative'>
              <input
                id='search-input'
                type='text'
                placeholder='Search user, room...'
                className='h-9 w-48 rounded-xl border border-slate-300 bg-white text-slate-700 text-sm px-8 focus:outline-none'
              />
              <Search
                className='absolute left-2 top-2.5 text-slate-400'
                size={16}
              />
            </div>
          </div>
          <button className='h-9 px-4 rounded-xl font-semibold text-xs bg-fuchsia-700 text-white shadow hover:bg-fuchsia-800 transition-colors cursor-pointer flex items-center gap-1 mt-5'>
            <Filter size={16} /> More Filters
          </button>
        </div>
      </div>

      {/* Third Row: Transaction Log */}
      <div className='w-full flex flex-col gap-3 min-h-100 '>
        <div className='flex flex-col gap-2'>
          {/* Group by month/year for headers */}
          {(() => {
            // Sort payments descending by date
            const sorted = [...mockPayments].sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
            );
            const groups: { [key: string]: typeof mockPayments } = {};
            sorted.forEach((p) => {
              const d = new Date(p.date);
              const key = d.toLocaleString("default", {
                month: "long",
                year: "numeric",
              });
              if (!groups[key]) groups[key] = [];
              groups[key].push(p);
            });
            return Object.entries(groups).map(([month, items]) => (
              <React.Fragment key={month}>
                <div className='text-base font-bold text-slate-500 mt-2 mb-1'>
                  {month}
                </div>
                <div className='flex flex-col gap-2'>
                  {items.map((payment) => (
                    <PaymentTransactionItem
                      key={payment.id}
                      payment={payment}
                    />
                  ))}
                </div>
              </React.Fragment>
            ));
          })()}
        </div>
      </div>
    </div>
  );
}
