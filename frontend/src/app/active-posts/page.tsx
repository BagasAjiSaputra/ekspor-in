"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
    Home,
    User,
    PlusSquare,
    Edit3,
    Settings,
    LogOut,
    Bell,
    Search,
    Edit,
    XCircle,
    ChevronDown,
    List
} from "lucide-react";

export default function ActivePostsPage() {
    const [sidebarActive, setSidebarActive] = useState("Edit Aktif");

    const menuItems = [
        { name: "Beranda", icon: <Home size={20} />, active: false, href: "/home" },
        { name: "Profil", icon: <User size={20} />, active: false, href: "/profile" },
        { name: "Buat Postingan", icon: <PlusSquare size={20} />, active: false, href: "/create-post" },
        { name: "Edit Aktif", icon: <Edit3 size={20} />, active: true, href: "/active-posts" },
    ];

    const bottomMenuItems = [
        { name: "Pengaturan", icon: <Settings size={20} />, active: false, href: "#" },
        { name: "Keluar", icon: <LogOut size={20} />, active: false, href: "/login" },
    ];

    const activePostings = [
        {
            id: 1,
            name: "Padi Ciherang Premium",
            created: "2 Jam yang lalu",
            volume: "5.0 Ton",
            price: "Rp 6.800/Kg",
            status: "Aktif",
            image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=100&h=100"
        },
        {
            id: 2,
            name: "Jagung Pipil Kering",
            created: "1 Hari yang lalu",
            volume: "12.2 Ton",
            price: "Rp 4.200/Kg",
            status: "Aktif",
            image: "https://images.unsplash.com/photo-1551748629-67d8b5028c1c?auto=format&fit=crop&q=80&w=100&h=100"
        }
    ];

    return (
        <div className="min-h-screen bg-[#FDFDFD] flex font-body">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-100 flex flex-col p-6 sticky top-0 h-screen">
                <div className="mb-10 px-2">
                    <h1 className="text-primary font-bold text-2xl tracking-tight">Eksporin</h1>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Modern Agrarian</p>
                </div>

                <nav className="flex-1 space-y-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${item.name === sidebarActive
                                ? "bg-bg-soft text-primary shadow-sm"
                                : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                }`}
                            onClick={() => setSidebarActive(item.name)}
                        >
                            <span className={item.name === sidebarActive ? "text-primary" : "text-gray-400"}>
                                {item.icon}
                            </span>
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="pt-6 border-t border-gray-100 space-y-2">
                    {bottomMenuItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-all"
                        >
                            <span className="text-gray-400">{item.icon}</span>
                            {item.name}
                        </Link>
                    ))}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-10 max-w-7xl mx-auto">
                {/* Header */}
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h2 className="text-4xl font-extrabold text-gray-900">Halo, Pengepul Berkah</h2>
                        <p className="text-gray-500 mt-2 font-medium">
                            Kelola stok dan postingan komoditas Anda hari ini.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-3 bg-white border border-gray-100 rounded-2xl shadow-sm text-gray-400 hover:text-primary transition-colors">
                            <Bell size={20} />
                        </button>
                        <div className="w-12 h-12 bg-[#B8E5B3] rounded-2xl flex items-center justify-center text-[#237127] shadow-sm overflow-hidden">
                             <User size={24} />
                        </div>
                    </div>
                </header>

                {/* Table Section */}
                <div className="bg-[#F8F9F7] rounded-[40px] p-8 border border-gray-100 shadow-sm min-h-[600px]">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#237127] shadow-sm border border-gray-100">
                                <List size={24} />
                            </div>
                            <h3 className="text-2xl font-extrabold text-gray-900">Daftar Postingan Aktif</h3>
                        </div>
                        
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input 
                                type="text"
                                placeholder="Cari postingan..."
                                className="w-full bg-gray-200/50 border border-transparent rounded-2xl py-3 pl-12 pr-4 text-sm font-bold text-gray-700 focus:outline-none focus:bg-white focus:border-primary/30 transition-all shadow-inner"
                            />
                        </div>
                    </div>

                    <div className="w-full overflow-x-auto">
                        <table className="w-full text-left border-separate border-spacing-y-4">
                            <thead>
                                <tr className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                    <th className="px-6 pb-2">Komoditas</th>
                                    <th className="px-6 pb-2">Volume</th>
                                    <th className="px-6 pb-2">Harga Target</th>
                                    <th className="px-6 pb-2 text-center">Status</th>
                                    <th className="px-6 pb-2 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activePostings.map((post) => (
                                    <tr key={post.id} className="group">
                                        <td className="bg-white px-6 py-4 rounded-l-[24px] border-y border-l border-gray-100 shadow-sm group-hover:shadow-md transition-shadow">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 rounded-2xl overflow-hidden border border-gray-100 flex-shrink-0">
                                                    <img src={post.image} alt={post.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-extrabold text-gray-900">{post.name}</h4>
                                                    <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">Dibuat: {post.created}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="bg-white px-6 py-4 border-y border-gray-100 shadow-sm group-hover:shadow-md transition-shadow">
                                            <span className="text-sm font-extrabold text-gray-900">{post.volume}</span>
                                        </td>
                                        <td className="bg-white px-6 py-4 border-y border-gray-100 shadow-sm group-hover:shadow-md transition-shadow">
                                            <span className="text-sm font-extrabold text-[#237127]">{post.price}</span>
                                        </td>
                                        <td className="bg-white px-6 py-4 border-y border-gray-100 shadow-sm group-hover:shadow-md transition-shadow text-center">
                                            <div className="inline-flex items-center gap-1.5 bg-green-50 text-[#237127] px-3 py-1 rounded-full border border-green-100">
                                                <div className="w-1.5 h-1.5 bg-[#237127] rounded-full"></div>
                                                <span className="text-[10px] font-bold uppercase tracking-wider">{post.status}</span>
                                            </div>
                                        </td>
                                        <td className="bg-white px-6 py-4 rounded-r-[24px] border-y border-r border-gray-100 shadow-sm group-hover:shadow-md transition-shadow text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-2.5 text-[#237127] hover:bg-[#237127]/5 rounded-xl transition-colors">
                                                    <Edit size={20} />
                                                </button>
                                                <button className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                                                    <XCircle size={20} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination or Empty State would go here */}
                    <div className="mt-10 flex justify-center">
                         <div className="flex items-center gap-2">
                             <div className="h-1 w-8 bg-[#237127] rounded-full"></div>
                             <div className="h-1 w-2 bg-gray-200 rounded-full"></div>
                             <div className="h-1 w-2 bg-gray-200 rounded-full"></div>
                         </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
