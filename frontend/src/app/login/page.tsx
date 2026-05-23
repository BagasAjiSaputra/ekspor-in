"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Lock, Eye, EyeOff, Mail } from "lucide-react";

// Brand Icons
const GoogleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

const WhatsAppIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-10.6 8.38 8.38 0 0 1 3.8.9L22 4Z" />
    </svg>
);

import { authService } from "@/services/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [showResetModal, setShowResetModal] = useState(false);
    const [resetStep, setResetStep] = useState(1);
    const [resetEmail, setResetEmail] = useState("");
    const [resetToken, setResetToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [resetLoading, setResetLoading] = useState(false);
    const [resetMessage, setResetMessage] = useState({ type: '', text: '' });
    const [failedAttempts, setFailedAttempts] = useState(0);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await authService.login(formData);
            
            // Simpan token ke localStorage
            if (response.token) {
                localStorage.setItem("token", response.token);
            }
            
            // Redirect ke dashboard/profile
            router.push("/profile");
        } catch (err: any) {
            setFailedAttempts((prev) => prev + 1);
            setError(err.message || "Gagal masuk. Silakan periksa kembali email dan kata sandi Anda.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRequestToken = async (e: React.FormEvent) => {
        e.preventDefault();
        setResetLoading(true);
        setResetMessage({ type: '', text: '' });
        try {
            await authService.requestPasswordReset({ email: resetEmail });
            setResetMessage({ type: 'success', text: 'Token berhasil dikirim ke email Anda!' });
            setResetStep(2);
        } catch (err: any) {
            setResetMessage({ type: 'error', text: err.message || 'Gagal mengirim token.' });
        } finally {
            setResetLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setResetLoading(true);
        setResetMessage({ type: '', text: '' });
        try {
            await authService.resetPassword({ token: resetToken, new_password: newPassword });
            setResetMessage({ type: 'success', text: 'Kata sandi berhasil diubah! Silakan masuk.' });
            setTimeout(() => {
                setShowResetModal(false);
                setResetStep(1);
                setResetMessage({ type: '', text: '' });
                setResetToken("");
                setNewPassword("");
            }, 2000);
        } catch (err: any) {
            setResetMessage({ type: 'error', text: err.message || 'Gagal mengubah kata sandi.' });
        } finally {
            setResetLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg-soft flex flex-col items-center justify-center p-6 relative overflow-hidden font-body">
            {/* Reset Password Modal */}
            {showResetModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
                    <div className="bg-white rounded-[32px] p-8 w-full max-w-md shadow-2xl border border-gray-100 relative animate-in fade-in zoom-in-95 duration-200">
                        <button 
                            onClick={() => { setShowResetModal(false); setResetStep(1); setResetMessage({type:'', text:''}); }}
                            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                        </button>
                        <h3 className="text-xl font-extrabold text-gray-900 mb-2">
                            {resetStep === 1 ? 'Lupa Kata Sandi' : 'Buat Kata Sandi Baru'}
                        </h3>
                        <p className="text-gray-500 text-sm font-medium mb-6">
                            {resetStep === 1 
                                ? 'Masukkan email Anda untuk mendapatkan token reset password.' 
                                : 'Masukkan token yang telah dikirim dan kata sandi baru Anda.'}
                        </p>

                        {resetMessage.text && (
                            <div className={`p-4 mb-6 rounded-2xl text-sm font-bold border ${resetMessage.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                                {resetMessage.text}
                            </div>
                        )}

                        {resetStep === 1 ? (
                            <form onSubmit={handleRequestToken} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Alamat Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={resetEmail}
                                        onChange={(e) => setResetEmail(e.target.value)}
                                        disabled={resetLoading}
                                        placeholder="nama@email.com"
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 px-5 text-sm font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all font-body disabled:opacity-50"
                                    />
                                </div>
                                <button type="submit" disabled={resetLoading} className="w-full bg-primary-dark hover:bg-black text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/10 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 mt-2">
                                    {resetLoading ? "Mengirim..." : "Kirim Token"}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleResetPassword} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Token Reset</label>
                                    <input
                                        type="text"
                                        required
                                        value={resetToken}
                                        onChange={(e) => setResetToken(e.target.value)}
                                        disabled={resetLoading}
                                        placeholder="Misal: fda95189-..."
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 px-5 text-sm font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all font-body disabled:opacity-50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Kata Sandi Baru</label>
                                    <input
                                        type="password"
                                        required
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        disabled={resetLoading}
                                        placeholder="••••••••"
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 px-5 text-sm font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all font-body disabled:opacity-50"
                                    />
                                </div>
                                <button type="submit" disabled={resetLoading} className="w-full bg-primary-dark hover:bg-black text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/10 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 mt-2">
                                    {resetLoading ? "Menyimpan..." : "Reset Password"}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {/* Background Decoration */}
            <div className="absolute right-[-10%] top-[-10%] w-[500px] h-[500px] bg-card-bg rounded-full -z-10 blur-3xl opacity-50"></div>
            <div className="absolute left-[-10%] bottom-[-10%] w-[400px] h-[400px] bg-primary/5 rounded-full -z-10 blur-3xl opacity-50"></div>

            {/* Logo */}
            <div className="mb-8 text-center animate-in fade-in slide-in-from-top-4 duration-700">
                <Link href="/home" className="text-primary font-bold text-4xl tracking-tight mb-2 block">Eksporin</Link>
                <p className="text-gray-500 font-medium tracking-tight">Gerbang Digital Pertanian Modern</p>
            </div>

            {/* Login Card */}
            <div className="bg-white w-full max-w-[420px] rounded-[32px] shadow-2xl shadow-primary/5 p-8 md:p-10 border border-gray-100 animate-in fade-in zoom-in-95 duration-500">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Masuk</h1>
                    <p className="text-gray-500 text-sm font-medium">Silakan masuk untuk mengelola hasil panen Anda.</p>
                </div>

                <form className="space-y-5" onSubmit={handleLogin}>
                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-bold p-4 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
                            {error}
                        </div>
                    )}

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
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all font-body disabled:opacity-50"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Kata Sandi</label>
                            {failedAttempts >= 3 && (
                                <button type="button" onClick={() => setShowResetModal(true)} className="text-[10px] font-bold text-primary hover:text-primary-dark transition-colors uppercase tracking-widest animate-in fade-in zoom-in-95 duration-300">
                                    Lupa Kata Sandi?
                                </button>
                            )}
                        </div>
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
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 pl-11 pr-12 text-sm font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all font-body disabled:opacity-50"
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

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary-dark hover:bg-black text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/10 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Sedang Masuk...</span>
                            </div>
                        ) : (
                            "Masuk Ke Akun"
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-100 text-center text-sm font-medium">
                    <p className="text-gray-500 font-medium">
                        Belum punya akun?{" "}
                        <Link href="/register" className="text-primary font-bold hover:underline hover:text-primary-dark underline-offset-4">
                            Daftar Sekarang
                        </Link>
                    </p>
                </div>
            </div>


        </div>
    );
}
