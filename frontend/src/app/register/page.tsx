"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Truck, ShieldCheck, Leaf, Headphones, Eye, EyeOff, User, Mail, Lock, Phone } from "lucide-react";

import { authService } from "@/services/auth";
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

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            setError("Kata sandi dan konfirmasi kata sandi tidak cocok.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            await authService.register({
                name: formData.name,
                email: formData.email,
                password: formData.password
            });
            
            // Berhasil daftar, arahkan ke login
            router.push("/login?registered=true");
        } catch (err: any) {
            setError(err.message || "Gagal mendaftar. Silakan coba lagi nanti.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg-soft flex flex-col items-center justify-center p-4 relative overflow-hidden font-body">
            {/* Background Decoration */}
            <div className="absolute left-[-10%] top-[-10%] w-[500px] h-[500px] bg-card-bg rounded-full -z-10 blur-3xl opacity-50"></div>
            <div className="absolute right-[-10%] bottom-[-10%] w-[400px] h-[400px] bg-primary/5 rounded-full -z-10 blur-3xl opacity-50"></div>

            {/* Logo */}
            <div className="mb-3 text-center animate-in fade-in slide-in-from-top-4 duration-700">
                <Link href="/home" className="text-primary font-bold text-4xl tracking-tight mb-1 block">Eksporin</Link>
                <p className="text-gray-500 font-medium tracking-tight">Gerbang Digital Pertanian Modern</p>
            </div>

            {/* Register Card */}
            <div className="bg-white w-full max-w-[420px] rounded-[32px] shadow-2xl shadow-primary/5 p-6 border border-gray-100 animate-in fade-in zoom-in-95 duration-500">
                
                <div className="mb-4 text-center">
                    <h1 className="text-xl font-extrabold text-gray-900 mb-1">Daftar</h1>
                    <p className="text-gray-500 text-sm font-medium">Buat akun untuk mulai menggunakan Eksporin.</p>
                </div>

                <form className="space-y-3" onSubmit={handleRegister}>
                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-bold p-4 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
                            {error}
                        </div>
                    )}
                    
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
                                disabled={isLoading}
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-2.5 pl-11 pr-5 text-xs font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all font-body disabled:opacity-50"
                            />
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
                                disabled={isLoading}
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-2.5 pl-11 pr-5 text-xs font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all font-body disabled:opacity-50"
                            />
                        </div>
                    </div>

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
                                disabled={isLoading}
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-2.5 pl-11 pr-12 text-xs font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all font-body disabled:opacity-50"
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
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Konfirmasi Sandi</label>
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
                                disabled={isLoading}
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-2.5 pl-11 pr-12 text-xs font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all font-body disabled:opacity-50"
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
