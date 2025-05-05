"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  // This is to prevent hydration errors
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Only show admin layout for dashboard and other admin pages, not the login page
  if (!isMounted || pathname === "/admin") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                <Link href="/">
                  <Image
                    src="/mega-invest-logo.svg"
                    alt="Mega Invest Logo"
                    width={140}
                    height={40}
                    priority
                  />
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href="/admin/dashboard"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    pathname === "/admin/dashboard"
                      ? "border-b-2 border-black text-gray-900"
                      : "border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/investments"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    pathname.startsWith("/admin/investments")
                      ? "border-b-2 border-black text-gray-900"
                      : "border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  Investments
                </Link>
                <Link
                  href="/admin/users"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    pathname.startsWith("/admin/users")
                      ? "border-b-2 border-black text-gray-900"
                      : "border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  Users
                </Link>
                <Link
                  href="/admin/settings"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    pathname.startsWith("/admin/settings")
                      ? "border-b-2 border-black text-gray-900"
                      : "border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  Settings
                </Link>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="relative ml-3">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700">A</span>
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700">Admin</span>
                </div>
              </div>
              <Link
                href="/"
                className="ml-4 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                View Site
              </Link>
              <Link
                href="/admin"
                className="ml-4 rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800"
              >
                Logout
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-10">
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
