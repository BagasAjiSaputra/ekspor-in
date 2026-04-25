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
    Camera,
    CheckCircle,
    Shield,
    Mail,
    Phone,
    Save,
    X
} from "lucide-react";

export default function ProfilePage() {
    const [sidebarActive, setSidebarActive] = useState("Profil");

    const menuItems = [
        { name: "Beranda", icon: <Home size={20} />, active: false },
        { name: "Profil", icon: <User size={20} />, active: true },
        { name: "Buat Postingan", icon: <PlusSquare size={20} />, active: false },
        { name: "Edit Aktif", icon: <Edit3 size={20} />, active: false },
    ];

    const bottomMenuItems = [
        { name: "Pengaturan", icon: <Settings size={20} />, active: false },
        { name: "Keluar", icon: <LogOut size={20} />, active: false },
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
                        <button
                            key={item.name}
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
                        </button>
                    ))}
                </nav>

                <div className="pt-6 border-t border-gray-100 space-y-2">
                    {bottomMenuItems.map((item) => (
                        <button
                            key={item.name}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-all"
                        >
                            <span className="text-gray-400">{item.icon}</span>
                            {item.name}
                        </button>
                    ))}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-10 max-w-7xl">
                <header className="mb-10">
                    <h2 className="text-3xl font-extrabold text-gray-900">Profil Pengepul</h2>
                    <p className="text-gray-500 mt-2 font-medium">
                        Kelola identitas bisnis dan informasi kontak Anda untuk meningkatkan kepercayaan petani.
                    </p>
                </header>

                <div className="flex gap-8">
                    {/* Left Column: Profile Card & Security */}
                    <div className="w-80 space-y-6">
                        {/* Profile Card */}
                        <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm flex flex-col items-center">
                            <div className="relative mb-6">
                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                                    <img
                                        src="https://avatar.vercel.sh/agro-jaya-mandiri?size=128"
                                        alt="Avatar"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <button className="absolute bottom-1 right-1 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-primary-dark transition-colors border-2 border-white">
                                    <Camera size={16} />
                                </button>
                            </div>

                            <div className="flex items-center gap-1.5 bg-green-100 text-[#237127] px-3 py-1 rounded-full mb-4">
                                <CheckCircle size={14} fill="currentColor" className="text-white" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Terverifikasi</span>
                            </div>

                            <h3 className="text-xl font-extrabold text-gray-900 text-center">Agro Jaya Mandiri</h3>
                            <p className="text-gray-400 text-sm mt-1">Bergabung sejak Maret 2023</p>
                        </div>

                        {/* Security Card */}
                        <div className="bg-[#FFE5D9] rounded-[32px] p-6 flex gap-4 border border-[#FFD5C5]">
                            <div className="w-12 h-12 bg-white/50 backdrop-blur-sm rounded-2xl flex items-center justify-center text-[#E64A19] shadow-sm">
                                <Shield size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-[#4E1D0E] text-sm">Keamanan Akun</h4>
                                <p className="text-[#8D4E3C] text-[11px] font-medium leading-relaxed mt-1">
                                    Profil yang lengkap meningkatkan skor kepercayaan hingga 85% di mata petani.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Update Forms */}
                    <div className="flex-1 bg-white rounded-[32px] p-10 border border-gray-100 shadow-sm">
                        {/* Business Info Section */}
                        <section className="mb-10">
                            <h3 className="text-lg font-extrabold text-gray-900 mb-6 flex items-center gap-2">
                                Informasi Bisnis
                                <div className="h-[1px] flex-1 bg-gray-100 ml-2"></div>
                            </h3>

                            <div className="grid grid-cols-2 gap-6 mb-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Nama Perusahaan / Pengepul</label>
                                    <input
                                        type="text"
                                        placeholder="Agro Jaya Mandiri"
                                        defaultValue="Agro Jaya Mandiri"
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 px-5 text-sm font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all font-body"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">ID Pengepul</label>
                                    <input
                                        type="text"
                                        readOnly
                                        value="EX-2023-0042"
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 px-5 text-sm font-bold text-gray-400 focus:outline-none cursor-not-allowed font-body"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Alamat Gudang Utama</label>
                                <textarea
                                    rows={4}
                                    defaultValue="Jl. Raya Pertanian No. 42, Pangalengan, Kabupaten Bandung, Jawa Barat 40378"
                                    placeholder="Jl. Raya Pertanian No. 42, Pangalengan, Kabupaten Bandung, Jawa Barat 40378"
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 px-5 text-sm font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all resize-none font-body"
                                ></textarea>
                            </div>
                        </section>

                        {/* Personal Contact Section */}
                        <section className="mb-10">
                            <h3 className="text-lg font-extrabold text-gray-900 mb-6 flex items-center gap-2">
                                Kontak Personal
                                <div className="h-[1px] flex-1 bg-gray-100 ml-2"></div>
                            </h3>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Bisnis</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                                            <Mail size={18} />
                                        </div>
                                        <input
                                            type="email"
                                            defaultValue="contact@agrojaya.com"
                                            placeholder="contact@agrojaya.com"
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 pl-12 pr-5 text-sm font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all font-body"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Nomor WhatsApp</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                                            <Phone size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            defaultValue="0812 3456 7890"
                                            placeholder="0812 3456 7890"
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 pl-12 pr-5 text-sm font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all font-body"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Form Actions */}
                        <div className="flex items-center justify-end gap-6 mt-12">
                            <button className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-2">
                                <X size={18} />
                                Batalkan
                            </button>
                            <button className="bg-[#113114] hover:bg-black text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-black/10 transition-all hover:-translate-y-0.5 active:translate-y-0">
                                <Save size={18} />
                                Simpan Perubahan
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
