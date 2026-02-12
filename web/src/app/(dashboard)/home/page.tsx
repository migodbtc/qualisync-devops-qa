import React from "react";

// Example: Replace with actual role detection logic (e.g., from JWT or context)
const userRole = "admin"; // "tenant", "finance", "staff"

function QuickActionsCard({ actions }: { actions: string[] }) {
  return (
    <div className='bg-white rounded-xl p-4 border border-slate-300 flex flex-col gap-2 shadow-sm'>
      <h3 className='text-lg font-bold text-fuchsia-700 mb-2'>Quick Actions</h3>
      <div className='flex flex-col gap-2'>
        {actions.map((action) => (
          <button
            key={action}
            className='px-4 py-2 rounded-xl bg-fuchsia-700 text-white font-semibold text-xs hover:bg-fuchsia-800 transition-colors cursor-pointer'
          >
            {action}
          </button>
        ))}
      </div>
    </div>
  );
}

// Role-based dashboard subcomponents
function AdminHome() {
  return (
    <div className='w-full h-full flex flex-col gap-2'>
      <div className='w-full h-48 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2'>
        <div className='bg-white rounded-xl p-4 border border-slate-300'>System Metrics</div>
        <div className='bg-white rounded-xl p-4 border border-slate-300'>User Management</div>
        <div className='bg-white rounded-xl p-4 border border-slate-300'>Lease Overview</div>
        <div className='bg-white rounded-xl p-4 border border-slate-300'>Audit Log</div>
      </div>
      <div className='w-full h-96 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2'>
        <div className='bg-white rounded-xl p-4 border border-slate-300 col-span-3'>Recent Activity</div>
        <QuickActionsCard actions={["Add User", "Export Data", "Manage Roles"]} />
      </div>
    </div>
  );
}

function TenantHome() {
  return (
    <div className='w-full h-full flex flex-col gap-2'>
      <div className='w-full h-48 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2'>
        <div className='bg-white rounded-xl p-4 border border-slate-300'>Personal Ledger</div>
        <div className='bg-white rounded-xl p-4 border border-slate-300'>Lease Details</div>
        <div className='bg-white rounded-xl p-4 border border-slate-300'>Maintenance Requests</div>
        <div className='bg-white rounded-xl p-4 border border-slate-300'>Notifications</div>
      </div>
      <div className='w-full h-96 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2'>
        <div className='bg-white rounded-xl p-4 border border-slate-300 col-span-3'>Payment Timeline</div>
        <QuickActionsCard actions={["Pay Rent", "Submit Maintenance Request", "View Lease"]} />
      </div>
    </div>
  );
}

function FinanceHome() {
  return (
    <div className='w-full h-full flex flex-col gap-2'>
      <div className='w-full h-48 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2'>
        <div className='bg-white rounded-xl p-4 border border-slate-300'>Revenue Summary</div>
        <div className='bg-white rounded-xl p-4 border border-slate-300'>Arrears</div>
        <div className='bg-white rounded-xl p-4 border border-slate-300'>Upcoming Payments</div>
        <div className='bg-white rounded-xl p-4 border border-slate-300'>Analytics</div>
      </div>
      <div className='w-full h-96 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2'>
        <div className='bg-white rounded-xl p-4 border border-slate-300 col-span-3'>Revenue Growth Chart</div>
        <QuickActionsCard actions={["Verify Payment", "Export Ledger", "Email Tenant"]} />
      </div>
    </div>
  );
}

function StaffHome() {
  return (
    <div className='w-full h-full flex flex-col gap-2'>
      <div className='w-full h-48 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2'>
        <div className='bg-white rounded-xl p-4 border border-slate-300'>Maintenance Queue</div>
        <div className='bg-white rounded-xl p-4 border border-slate-300'>Room Status</div>
        <div className='bg-white rounded-xl p-4 border border-slate-300'>Lease Coordination</div>
        <div className='bg-white rounded-xl p-4 border border-slate-300'>Schedule</div>
      </div>
      <div className='w-full h-96 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2'>
        <div className='bg-white rounded-xl p-4 border border-slate-300 col-span-3'>Service Timeline</div>
        <QuickActionsCard actions={["Assign Room", "Close Ticket", "View Schedule"]} />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  // Replace with actual role logic
  if (userRole === "admin") return <AdminHome />;
  if (userRole === "tenant") return <TenantHome />;
  if (userRole === "finance") return <FinanceHome />;
  if (userRole === "staff") return <StaffHome />;
  return <div>Unknown role</div>;
}