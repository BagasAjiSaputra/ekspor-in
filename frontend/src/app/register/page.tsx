"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Truck, ShieldCheck, Leaf, Headphones, Eye, EyeOff, User, Mail, Lock, Phone } from "lucide-react";

import { register } from "@/features/auth/register";
import { authService } from "@/services/auth"; // keep for reset password for now
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: ""
    });

    const clientRegister = async (formDataEvent: FormData) => {
        
        if (formData.password !== formData.confirmPassword) {
            setError("Kata sandi dan konfirmasi kata sandi tidak cocok.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const fd = new FormData();
            fd.append("name", formData.name);
            fd.append("email", formData.email);
            fd.append("password", formData.password);
            
            const res = await register(fd);
            if (res && res.error) {
                throw new Error(res.error);
            }
            
            // Berhasil daftar, arahkan ke login
            router.push("/login?registered=true");
        } catch (err: any) {
            setError(err.message || "Gagal mendaftar. Silakan coba lagi nanti.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden font-body">
            {/* Background Image */}
            <div 
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2070&auto=format&fit=crop')" }}
            >
                <div className="absolute inset-0 bg-[#0a1f0d]/60 mix-blend-multiply"></div>
                <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
            </div>

            {/* Background Decoration (Removed) */}

            {/* Logo */}
            <div className="mb-3 text-center animate-in fade-in slide-in-from-top-4 duration-700 relative z-10">
                <Link href="/home" className="text-white font-extrabold text-5xl tracking-tight mb-1 block drop-shadow-lg">Eksporin</Link>
                <p className="text-white/90 font-medium tracking-wide drop-shadow-md">Gerbang Digital Pertanian Modern</p>
            </div>

            {/* Register Card */}
            <div className="bg-white/70 backdrop-blur-2xl w-full max-w-[420px] rounded-[32px] shadow-2xl shadow-black/40 p-6 border border-white/50 animate-in fade-in zoom-in-95 duration-500 relative z-10">
                
                <div className="mb-4 text-center">
                    <h1 className="text-xl font-extrabold text-gray-900 mb-1">Daftar</h1>
                    <p className="text-gray-500 text-sm font-medium">Buat akun untuk mulai menggunakan Eksporin.</p>
                </div>

                <form className="space-y-3" action={clientRegister}>
                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-bold p-4 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
                            {error}
                        </div>
                    )}
                    
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Nama Lengkap</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors">
                                <User size={18} />
                            </div>
                            <input
                                type="text"
                                placeholder="Nama Lengkap"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                disabled={isLoading}
                                className="w-full bg-white/50 border border-white/40 shadow-inner rounded-2xl py-2.5 pl-11 pr-5 text-xs font-bold text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary/40 transition-all font-body disabled:opacity-50"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Alamat Email</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors">
                                <Mail size={18} />
                            </div>
                            <input
                                type="email"
                                placeholder="nama@email.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                disabled={isLoading}
                                className="w-full bg-white/50 border border-white/40 shadow-inner rounded-2xl py-2.5 pl-11 pr-5 text-xs font-bold text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary/40 transition-all font-body disabled:opacity-50"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Kata Sandi</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors">
                                <Lock size={18} />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                                disabled={isLoading}
                                className="w-full bg-white/50 border border-white/40 shadow-inner rounded-2xl py-2.5 pl-11 pr-12 text-xs font-bold text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary/40 transition-all font-body disabled:opacity-50"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Konfirmasi Sandi</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors">
                                <Lock size={18} />
                            </div>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                required
                                disabled={isLoading}
                                className="w-full bg-white/50 border border-white/40 shadow-inner rounded-2xl py-2.5 pl-11 pr-12 text-xs font-bold text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary/40 transition-all font-body disabled:opacity-50"
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

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary-dark hover:bg-black text-white font-bold py-3 rounded-2xl shadow-lg shadow-primary/10 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed text-sm"
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Memproses...</span>
                            </div>
                        ) : (
                            "Buat Akun Sekarang"
                        )}
                    </button>
                </form>

                <div className="mt-5 pt-4 border-t border-gray-100 text-center text-xs font-medium">
                    <p className="text-gray-500 font-medium">
                        Sudah punya akun?{" "}
                        <Link href="/login" className="text-primary font-bold hover:underline hover:text-primary-dark underline-offset-4">
                            Masuk
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
