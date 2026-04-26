"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Truck, ShieldCheck, Leaf, Headphones, Eye, EyeOff, User, Mail, Lock, Phone } from "lucide-react";

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: ""
    });

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Registering with:", formData);
        // Add register logic here
    };

    return (
        <div className="min-h-screen bg-bg-soft flex flex-col items-center justify-center p-6 relative overflow-hidden font-body">
            {/* Background Decoration */}
            <div className="absolute left-[-10%] top-[-10%] w-[500px] h-[500px] bg-card-bg rounded-full -z-10 blur-3xl opacity-50"></div>

            {/* Logo & Intro */}
            <div className="mb-10 text-center max-w-lg animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="text-primary-dark font-bold text-4xl tracking-tight mb-4">Eksporin</div>
                <p className="text-gray-600 font-medium leading-relaxed tracking-tight">
                    Membangun Masa Depan Pertanian Modern yang Terhubung dan Terpercaya.
                </p>
            </div>

            {/* Register Card */}
            <div className="bg-white w-full max-w-[640px] rounded-[32px] shadow-2xl shadow-primary/5 p-8 md:p-12 border border-gray-100 animate-in fade-in zoom-in-95 duration-500">

                {/* Collector Banner */}
                <div className="bg-gray-50 border border-gray-100 rounded-[24px] p-6 mb-10 flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-4 shadow-sm">
                        <Truck size={24} />
                    </div>
                    <h2 className="text-xl font-extrabold text-gray-900 mb-1">Daftar sebagai Pengepul</h2>
                    <p className="text-gray-500 text-sm font-medium">Kumpulkan hasil bumi dari petani dengan efisien.</p>
                </div>

                <form className="space-y-6" onSubmit={handleRegister}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                                    <User size={18} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Nama Lengkap"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 pl-11 pr-5 text-sm font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all font-body"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">WhatsApp / No. Telepon</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                                    <Phone size={18} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="0812 3456 7890"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    required
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 pl-11 pr-5 text-sm font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all font-body"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Alamat Email</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                                <Mail size={18} />
                            </div>
                            <input
                                type="email"
                                placeholder="nama@email.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 pl-11 pr-5 text-sm font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all font-body"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Kata Sandi</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 pl-11 pr-12 text-sm font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all font-body"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Konfirmasi Kata Sandi</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    required
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 pl-11 pr-12 text-sm font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all font-body"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#113114] hover:bg-black text-white font-bold py-4 rounded-2xl shadow-lg shadow-black/10 transition-all hover:-translate-y-0.5 active:translate-y-0 mt-4 h-14"
                    >
                        Buat Akun Sekarang
                    </button>
                </form>

                <div className="mt-10 text-center text-sm font-medium">
                    <p className="text-gray-500 font-medium">
                        Sudah punya akun?{" "}
                        <Link href="/login" className="text-primary font-bold hover:underline hover:text-primary-dark underline-offset-4 font-bold">
                            Masuk
                        </Link>
                    </p>
                </div>
            </div>

            {/* Bottom Benefits */}
            <div className="mt-16 flex flex-wrap justify-center gap-8 md:gap-12 opacity-50 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    <ShieldCheck size={16} />
                    Data Terenkripsi
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    <Leaf size={16} />
                    Ekosistem Terpercaya
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    <Headphones size={16} />
                    Bantuan 24/7
                </div>
            </div>
        </div>
    );
}
