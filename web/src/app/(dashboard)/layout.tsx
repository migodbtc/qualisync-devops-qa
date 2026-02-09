"use client";

import {
  Building,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  User,
  Users,
  Home,
  CreditCard,
  BarChart,
  Mail,
  Settings,
} from "lucide-react";
import React, { createContext, useContext, useState } from "react";
import { usePathname } from "next/navigation";

// Sidebar context and hook
const SidebarContext = createContext<{ open: boolean; toggle: () => void }>({
  open: false,
  toggle: () => {},
});

export function useSidebar() {
  return useContext(SidebarContext);
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // Sidebar nav items based on dashboard_features.md
  const navItems = [
    {
      icon: LayoutDashboard,
      route: "/dashboard",
      name: "Dashboard",
    },
    {
      icon: Users,
      route: "/tenants",
      name: "Tenant Directory",
    },
    {
      icon: Home,
      route: "/rooms",
      name: "Apartment Rooms",
    },
    {
      icon: CreditCard,
      route: "/payments",
      name: "Payment History",
    },
    {
      icon: BarChart,
      route: "/finance",
      name: "Finance Analytics",
    },
    {
      icon: Mail,
      route: "/email",
      name: "Email Communications",
    }
  ];
  const bottomNavItems = [
    {
      icon: User,
      route: "/profile",
      name: "Profile Management",
    },
    {
      icon: Settings,
      route: "/settings",
      name: "Settings",
    }
  ];
  const [open, setOpen] = useState(true);
  const toggle = () => setOpen((prev) => !prev);

  return (
    <SidebarContext.Provider value={{ open, toggle }}>
      <div className='flex h-screen bg-gray-50'>
        {/* Sidebar */}
        <aside
          className={`transition-all duration-300 bg-fuchsia-800 text-white flex flex-col ${open ? "w-64" : "w-12"} min-h-screen shadow-lg`}
        >
          <div className='h-[10vh] bg-fuchsia-700 border-b border-b-fuchsia-900 flex items-center align-middle justify-center shadow'>
            <h3 className='text-xl font-semibold flex flex-row gap-2 items-center align-middle justify-center'>
              <Building />
              {open && " Thicket ATMS"}
            </h3>
          </div>
          <nav
            className={`flex flex-col gap-1 mt-4 ${open ? "mx-4" : "items-center px-2"}`}
          >
            {navItems.map(({ icon: Icon, route, name }) => {
              const isActive = pathname === route || pathname.startsWith(route + "/");
              return (
                <a
                  key={route}
                  href={route}
                  className={`flex items-center gap-2 text-sm rounded-lg transition-colors cursor-pointer px-2 py-2 focus:outline-none ${
                    isActive ? "bg-white text-fuchsia-900 font-bold" : "hover:bg-fuchsia-900"
                  }`}
                >
                  <Icon className='w-5 h-5' />
                  {open && <span className="whitespace-nowrap">{name}</span>}
                </a>
              );
            })}
          </nav>
          <nav
            className={`flex flex-col gap-1 mt-auto mb-4 ${open ? "mx-4" : "items-center px-2"}`}
          >
            {bottomNavItems.map(({ icon: Icon, route, name }) => {
              const isActive = pathname === route || pathname.startsWith(route + "/");
              return (
                <a
                  key={route}
                  href={route}
                  className={`flex items-center gap-2 text-sm rounded-lg transition-colors cursor-pointer px-2 py-2 focus:outline-none ${
                    isActive ? "bg-fuchsia-700 font-bold" : "hover:bg-fuchsia-900"
                  }`}
                >
                  <Icon className='w-5 h-5' />
                  {open && <span className="whitespace-nowrap">{name}</span>}
                </a>
              );
            })}
          </nav>
        </aside>

        {/* Main area */}
        <div className='flex flex-col flex-1'>
          {/* Header */}
          <header className='h-[10vh] w-full bg-white border-b border-gray-200 flex items-center px-4'>
            <button
              className='aspect-square p-2 mr-2 rounded-lg text-gray-500 hover:bg-slate-200 focus:outline-none flex items-center justify-center cursor-pointer'
              onClick={toggle}
              aria-label='Toggle sidebar'
            >
              {open ? (
                <ChevronLeft className='w-5 h-5' />
              ) : (
                <ChevronRight className='w-5 h-5' />
              )}
            </button>
            <span className='text-xl font-bold text-fuchsia-800'>
              ATMS Dashboard
            </span>
            {/* Add header content here */}
          </header>
          {/* Main content */}
          <main className='h-[90vh] w-full px-8 py-6 overflow-auto text-slate-800'>
            {children}
          </main>
        </div>
      </div>
    </SidebarContext.Provider>
  );
}
