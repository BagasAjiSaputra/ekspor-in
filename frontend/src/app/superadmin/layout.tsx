"use client";

import React from "react";
import {
  ShieldCheck,
  FileText,
  Package,
  AlertCircle,
  Ban,
  Settings,
  LogOut,
  Search,
  Bell,
  Users,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Logout } from "@/features/auth/logout";

export default function SuperadminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-[#F9FAFB] text-gray-800 font-manrope">
      {/* Sidebar */}
      <aside className="w-64 bg-[#F4F5F4] flex flex-col border-r border-gray-200 fixed inset-y-0 left-0 z-10">
        <div className="p-6">
          <h1 className="text-xl font-bold text-green-800 font-plus-jakarta-sans tracking-tight">
            Eksporin Admin
          </h1>
          <p className="text-xs text-gray-500 mt-1">Modern Agrarian Admin</p>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto mt-4">
          <Link
            href="/superadmin"
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
              pathname === "/superadmin"
                ? "bg-white text-green-700 shadow-sm border border-gray-100"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <ShieldCheck className={`mr-3 h-5 w-5 ${pathname === "/superadmin" ? "" : "text-gray-400"}`} />
            Verifikasi Agregator
          </Link>

          <Link
            href="/superadmin/listings"
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
              pathname.includes("/superadmin/listings")
                ? "bg-white text-green-700 shadow-sm border border-gray-100"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <FileText className={`mr-3 h-5 w-5 ${pathname.includes("/superadmin/listings") ? "" : "text-gray-400"}`} />
            Moderasi Postingan
          </Link>

          <Link
            href="/superadmin/commodities"
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
              pathname.includes("/superadmin/commodities")
                ? "bg-white text-green-700 shadow-sm border border-gray-100"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <Package className={`mr-3 h-5 w-5 ${pathname.includes("/superadmin/commodities") ? "" : "text-gray-400"}`} />
            Master Komoditas
          </Link>

          <Link
            href="/superadmin/users"
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
              pathname.includes("/superadmin/users")
                ? "bg-white text-green-700 shadow-sm border border-gray-100"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <Users className={`mr-3 h-5 w-5 ${pathname.includes("/superadmin/users") ? "" : "text-gray-400"}`} />
            Manajemen User
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-200 space-y-1">

          <form action={Logout}>
            <button
              type="submit"
              className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors text-left"
            >
              <LogOut className="mr-3 h-5 w-5 text-gray-400" />
              Keluar
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col">
        {/* Top Navbar */}
        <header className="h-20 bg-[#F9FAFB] flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex-1 max-w-xl relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              name="search"
              id="search"
              className="block w-full rounded-full border-0 py-2.5 pl-10 pr-4 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6 bg-white"
              placeholder="Cari data, post, atau user..."
            />
          </div>

          <div className="flex items-center space-x-6 ml-4">
            <button className="text-gray-400 hover:text-gray-500 relative">
              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-red-500"></span>
              <Bell className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-3 pl-6 border-l border-gray-200">
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900 font-plus-jakarta-sans">
                  Admin Utama
                </p>
                <p className="text-[10px] font-bold text-gray-500 tracking-wider">
                  SUPERADMIN
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-gray-900 border-2 border-green-500 flex items-center justify-center text-white overflow-hidden">
                 {/* Placeholder for avatar, or use image */}
                 <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <span className="text-xs font-bold text-yellow-500">AD</span>
                 </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
