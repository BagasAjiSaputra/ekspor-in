"use client";

import React from "react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { Users, Target, ShieldCheck, Leaf } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-bg-soft font-body flex flex-col">
            <Navbar />
            
            <main className="flex-grow">
                {/* Hero Section */}
                <section className="bg-[#113114] text-white py-24 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                    
                    <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
                            Mendekatkan <span className="text-primary">Petani</span> dengan Dunia
                        </h1>
                        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                            Eksporin hadir untuk memotong rantai pasok yang panjang, memberikan harga yang lebih adil bagi petani lokal, dan membuka akses langsung ke pembeli global.
                        </p>
                    </div>
                </section>

                {/* Main Content */}
                <section className="max-w-5xl mx-auto px-6 py-20 -mt-10 relative z-20">
                    <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-xl border border-gray-100 mb-20">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Cerita Kami</h2>
                                <p className="text-gray-600 leading-relaxed mb-6">
                                    Berawal dari keprihatinan melihat tingginya kualitas hasil bumi Nusantara yang tidak diimbangi dengan kesejahteraan para petaninya, kami mendirikan Eksporin pada tahun 2026.
                                </p>
                                <p className="text-gray-600 leading-relaxed">
                                    Kami percaya bahwa dengan sentuhan teknologi, transparansi harga dapat dicapai, dan petani tidak lagi bergantung pada perantara yang tidak menguntungkan. Melalui platform ini, hasil keringat mereka dapat langsung dinikmati oleh pasar internasional.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100 flex flex-col items-center text-center">
                                    <Target className="text-orange-500 mb-4" size={32} />
                                    <h3 className="font-bold text-gray-900 mb-2">Visi</h3>
                                    <p className="text-sm text-gray-600">Menjadi jembatan utama komoditas Indonesia ke panggung dunia.</p>
                                </div>
                                <div className="bg-green-50 p-6 rounded-3xl border border-green-100 flex flex-col items-center text-center mt-8">
                                    <Leaf className="text-green-600 mb-4" size={32} />
                                    <h3 className="font-bold text-gray-900 mb-2">Misi</h3>
                                    <p className="text-sm text-gray-600">Digitalisasi distribusi pangan dan agrikultur berkelanjutan.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Values */}
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-extrabold text-gray-900">Nilai-Nilai Kami</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 text-center hover:shadow-md transition-shadow">
                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600">
                                <ShieldCheck size={32} />
                            </div>
                            <h3 className="font-bold text-xl text-gray-900 mb-3">Kepercayaan</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">Sistem verifikasi ketat memastikan hanya pembeli dan penjual terpercaya yang dapat bertransaksi.</p>
                        </div>
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 text-center hover:shadow-md transition-shadow">
                            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
                                <Users size={32} />
                            </div>
                            <h3 className="font-bold text-xl text-gray-900 mb-3">Kolaborasi</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">Kami membangun ekosistem di mana petani, pengepul, dan pembeli saling menguntungkan.</p>
                        </div>
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 text-center hover:shadow-md transition-shadow">
                            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-amber-600">
                                <Target size={32} />
                            </div>
                            <h3 className="font-bold text-xl text-gray-900 mb-3">Dampak Sosial</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">Fokus utama kami adalah meningkatkan standar hidup para pahlawan pangan Indonesia.</p>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
