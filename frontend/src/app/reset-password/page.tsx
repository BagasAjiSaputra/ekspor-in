"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Eye, EyeOff } from "lucide-react";
import { authService } from "@/services/auth";
import { resetPassword } from "@/features/auth/reset_password";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // Ambil token dari URL parameter ?token=...
    const token = searchParams.get("token");

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error" | null, text: string }>({ type: null, text: "" });

    // Jika tidak ada token di URL, beri tahu pengguna
    useEffect(() => {
        if (!token) {
            setMessage({ type: "error", text: "Token tidak valid atau tidak ditemukan di URL." });
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!token) {
            setMessage({ type: "error", text: "Token reset password tidak ditemukan." });
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage({ type: "error", text: "Kata sandi dan konfirmasi tidak cocok." });
            return;
        }

        setIsLoading(true);
        setMessage({ type: null, text: "" });

        try {
            const fd = new FormData();
            fd.append("token", token);
            fd.append("new_password", newPassword);
            
            const res = await resetPassword(fd);
            if (res && res.error) {
                throw new Error(res.error);
            }

            setMessage({ type: "success", text: "Kata sandi berhasil diubah! Mengarahkan ke halaman login..." });
            
            // Redirect is handled by the server action usually, but as fallback:
            setTimeout(() => {
                router.push("/login");
            }, 2500);

        } catch (err: any) {
            if (err.message === "NEXT_REDIRECT") {
                // Ignore redirect error
            } else {
                setMessage({ type: "error", text: err.message || "Gagal mengubah kata sandi. Token mungkin sudah kedaluwarsa." });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white w-full max-w-[420px] rounded-[32px] shadow-2xl shadow-primary/5 p-6 md:p-8 border border-gray-100 animate-in fade-in zoom-in-95 duration-500">
            <div className="mb-6 text-center">
                <h1 className="text-xl font-extrabold text-gray-900 mb-1">Reset Kata Sandi</h1>
                <p className="text-gray-500 text-sm font-medium">Buat kata sandi baru untuk akun Anda.</p>
            </div>

            {message.type && (
                <div className={`p-4 mb-6 rounded-2xl text-xs font-bold border ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                    {message.text}
                </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Kata Sandi Baru</label>
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                            <Lock size={18} />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            disabled={isLoading || !token || message.type === 'success'}
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pl-11 pr-12 text-sm font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all font-body disabled:opacity-50"
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
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            disabled={isLoading || !token || message.type === 'success'}
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pl-11 pr-12 text-sm font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all font-body disabled:opacity-50"
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
                    disabled={isLoading || !token || message.type === 'success'}
                    className="w-full bg-primary-dark hover:bg-black text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-primary/10 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed text-sm"
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Menyimpan...</span>
                        </div>
                    ) : (
                        "Simpan Kata Sandi"
                    )}
                </button>
            </form>
            
            <div className="mt-5 pt-4 border-t border-gray-100 text-center text-xs font-medium">
                <Link href="/login" className="text-gray-500 font-bold hover:underline hover:text-gray-900">
                    Kembali ke halaman Masuk
                </Link>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen bg-bg-soft flex flex-col items-center justify-center p-4 relative overflow-hidden font-body">
            {/* Background Decoration */}
            <div className="absolute left-[-10%] top-[-10%] w-[500px] h-[500px] bg-card-bg rounded-full -z-10 blur-3xl opacity-50"></div>
            <div className="absolute right-[-10%] bottom-[-10%] w-[400px] h-[400px] bg-primary/5 rounded-full -z-10 blur-3xl opacity-50"></div>

            {/* Logo */}
            <div className="mb-4 text-center animate-in fade-in slide-in-from-top-4 duration-700">
                <Link href="/home" className="text-primary font-bold text-4xl tracking-tight mb-1 block">Eksporin</Link>
                <p className="text-gray-500 font-medium tracking-tight">Gerbang Digital Pertanian Modern</p>
            </div>

            <Suspense fallback={
                <div className="bg-white w-full max-w-[420px] rounded-[32px] p-6 text-center animate-pulse">
                    <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-500 font-medium text-sm">Memuat...</p>
                </div>
            }>
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
}
