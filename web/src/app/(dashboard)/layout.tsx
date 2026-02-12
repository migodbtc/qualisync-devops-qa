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
import { usePathname, useRouter } from "next/navigation";

// Sidebar context and hook
type SidebarContextType = {
  open: boolean;
  toggle: () => void;
  isTransitioning: boolean;
  setIsTransitioning: React.Dispatch<React.SetStateAction<boolean>>;
};

const SidebarContext = createContext<SidebarContextType>({
  open: false,
  toggle: () => {},
  isTransitioning: false,
  setIsTransitioning: () => {},
});

export function useSidebar() {
  return useContext(SidebarContext);
}

export const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2 && parts[1]) {
    return parts[1].split(';').shift();
  }
  return null;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [sessionError, setSessionError] = useState<string | null>(null);

  React.useEffect(() => {
    async function fetchSession() {
      setSessionLoading(true);
      setSessionError(null);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_FLASK_API_URL || "";

        const res = await fetch(`${apiUrl}/auth/session`, {
          method: "GET",
          credentials: "include",
        });
        if (res.status === 401) {
          // Not authenticated, redirect to login
          router.replace("/login");
          return;
        }
        if (!res.ok) {
          throw new Error("Session fetch failed");
        }
        const data = await res.json();
        setSession(data);
      } catch (err: any) {
        setSessionError(err.message || "Session error");
        setSession(null);
      } finally {
        setSessionLoading(false);
      }
    }
    fetchSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);
  // Sidebar nav items based on dashboard_features.md
  const navItems = [
    {
      icon: LayoutDashboard,
      route: "/home",
      name: "Home",
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
    },
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
    },
  ];

  const [open, setOpen] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Handle sidebar transition state
  const toggle = () => {
    setIsTransitioning(true);
    setOpen((prev) => !prev);
  };

  // End transition after animation duration (match duration-300)
  React.useEffect(() => {
    if (isTransitioning) {
      const timeout = setTimeout(() => setIsTransitioning(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isTransitioning]);

  // Find current feature name for header
  const allNavItems = [...navItems, ...bottomNavItems];
  const currentFeature =
    allNavItems.find(
      ({ route }) => pathname === route || pathname.startsWith(route + "/"),
    )?.name || "";

  return (
    <SidebarContext.Provider
      value={{ open, toggle, isTransitioning, setIsTransitioning }}
    >
      <div className='flex h-screen bg-gray-50 relative'>
        {/* Loading overlay */}
        {sessionLoading && (
          <div className='absolute inset-0 z-50 flex items-center justify-center bg-white bg-opacity-20'>
            <div className='animate-spin rounded-full h-16 w-16 border-t-4 border-fuchsia-700 border-solid'></div>
          </div>
        )}
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
            className={`flex flex-col gap-1 mt-4 ${open ? "mx-4" : "items-start px-2 justify-start text-left"}`}
          >
            {navItems.map(({ icon: Icon, route, name }) => {
              const isActive =
                pathname === route || pathname.startsWith(route + "/");
              return (
                <a
                  key={route}
                  href={route}
                  className={`flex items-center gap-2 text-sm rounded-lg transition-colors cursor-pointer px-2 py-2 focus:outline-none ${
                    isActive
                      ? "bg-white text-fuchsia-700 font-bold border border-fuchsia-700"
                      : "hover:bg-fuchsia-900"
                  } ${open ? "" : "justify-start items-start text-left"}`}
                >
                  <Icon
                    className={`w-5 h-5 ${isActive ? "text-fuchsia-700" : ""}`}
                  />
                  {open && (
                    <span
                      className={`whitespace-nowrap ${isActive ? "text-fuchsia-700" : ""}`}
                    >
                      {name}
                    </span>
                  )}
                </a>
              );
            })}
          </nav>
          <nav
            className={`flex flex-col gap-1 mt-auto mb-4 ${open ? "mx-4" : "items-start px-2 justify-start text-left"}`}
          >
            {bottomNavItems.map(({ icon: Icon, route, name }) => {
              const isActive =
                pathname === route || pathname.startsWith(route + "/");
              return (
                <a
                  key={route}
                  href={route}
                  className={`flex items-center gap-2 text-sm rounded-lg transition-colors cursor-pointer px-2 py-2 focus:outline-none ${
                    isActive
                      ? "bg-white text-fuchsia-700 font-bold border border-fuchsia-700"
                      : "hover:bg-fuchsia-900"
                  } ${open ? "" : "justify-start items-start text-left"}`}
                >
                  <Icon
                    className={`w-5 h-5 ${isActive ? "text-fuchsia-700" : ""}`}
                  />
                  {open && (
                    <span
                      className={`whitespace-nowrap ${isActive ? "text-fuchsia-700" : ""}`}
                    >
                      {name}
                    </span>
                  )}
                </a>
              );
            })}
          </nav>
        </aside>

        {/* Main area */}
        <div className='flex flex-col flex-1'>
          {/* Header */}
          <header className='h-64 w-full bg-white border-b border-gray-200 flex items-center px-4'>
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
              {currentFeature || "ATMS"}
            </span>
            {/* Session info display */}
            <div className='ml-auto flex flex-col items-end'>
              {sessionError ? (
                <span className='text-red-500 text-sm'>Session error</span>
              ) : session && session.user ? (
                <div className='flex flex-row items-center gap-2 mr-2'>
                  <User className='w-9 h-9 text-slate-500' />
                  <div className='flex flex-col'>
                    <span className='font-bold text-fuchsia-800 text-sm'>
                      {session.user.username || session.user.email || "Unknown"}
                    </span>
                    <span className='italic text-slate-500 text-xs'>
                      {session.user.email}
                    </span>
                  </div>
                </div>
              ) : (
                <span className='text-gray-400 text-sm'>No session</span>
              )}
            </div>
          </header>
          {/* Main content */}
          <main className='min-h-[90vh] w-full p-4 overflow-auto text-slate-800'>
            {children}
          </main>
        </div>
      </div>
    </SidebarContext.Provider>
  );
}
