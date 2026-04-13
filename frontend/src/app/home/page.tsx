"use client";

import React from "react";
import Image from "next/image";
import {
    Search,
    MapPin,
    Bell,
    User,
    ChevronDown,
    LayoutGrid,
    List,
    MessageSquare
} from "lucide-react";

// Brand Icons
const FacebookIcon = ({ size = 18 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
);

const TwitterIcon = ({ size = 18 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
);

const InstagramIcon = ({ size = 18 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
);

const LinkedinIcon = ({ size = 18 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" />
    </svg>
);

const Navbar = () => (
    <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 max-w-7xl mx-auto w-full sticky top-0 z-50">
        <div className="flex items-center gap-8">
            <div className="text-primary font-bold text-2xl tracking-tight">Eksporin</div>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-500">
                <a href="#" className="text-primary border-b-2 border-primary pb-1">Home</a>
                <a href="#" className="hover:text-primary pb-1 transition-colors">Explore</a>
                <a href="#" className="hover:text-primary pb-1 transition-colors">About</a>
                <a href="#" className="hover:text-primary pb-1 transition-colors">Help</a>
            </div>
        </div>
        <div className="flex items-center gap-4">
            <button className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors">
                Daftar
            </button>
            <div className="flex items-center gap-3">
                <div className="p-2 hover:bg-gray-100 rounded-full cursor-pointer transition-colors relative">
                    <Bell size={20} className="text-gray-600" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </div>
                <div className="p-2 hover:bg-gray-100 rounded-full cursor-pointer transition-colors border border-gray-200">
                    <User size={20} className="text-gray-600" />
                </div>
            </div>
        </div>
    </nav>
);

const SearchBox = () => (
    <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/50 w-full max-w-2xl mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Pilih Komoditas</label>
                <div className="relative">
                    <select className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 appearance-none text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                        <option>Semua Komoditas</option>
                        <option>Kopi Arabika</option>
                        <option>Kakao Kering</option>
                        <option>Lada Hitam</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Lokasi</label>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Provinsi/Kab/Kec"
                        className="w-full bg-white border border-gray-200 rounded-xl px-10 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
            </div>
        </div>
        <button className="w-full bg-primary-dark hover:bg-black text-white py-4 rounded-xl mt-6 flex items-center justify-center gap-2 font-bold transition-all shadow-lg shadow-primary/20">
            <Search size={20} />
            Cari Permintaan Sekarang
        </button>
    </div>
);

const RequestCard = ({ title, company, location, volume, price, type, bgColor }: any) => (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
        <div className="relative h-48 bg-gray-200">
            {/* Placeholder for commodity image */}
            <div className={`absolute inset-0 bg-gradient-to-br ${bgColor} opacity-60 group-hover:scale-105 transition-transform duration-500`}></div>
            <div className="absolute top-4 left-4">
                <span className="bg-secondary text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-tight">
                    {type}
                </span>
            </div>
        </div>
        <div className="p-5">
            <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary transition-colors">{company}</h3>
            <div className="flex items-center gap-1 mt-1 text-gray-500">
                <MapPin size={14} />
                <span className="text-xs font-medium">{location}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                    <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Volume</div>
                    <div className="font-bold text-primary">{volume}</div>
                </div>
                <div className="text-right">
                    <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Harga/Kg</div>
                    <div className="font-bold text-tertiary">{price}</div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
                <button className="py-2.5 rounded-xl border-2 border-primary text-primary font-bold text-sm hover:bg-primary/5 transition-colors">
                    Detail
                </button>
                <button className="py-2.5 rounded-xl bg-primary-dark hover:bg-black text-white font-bold text-sm flex items-center justify-center gap-1.5 transition-colors">
                    <MessageSquare size={16} />
                    WhatsApp
                </button>
            </div>
        </div>
        <div className="h-24 bg-card-bg mt-2 px-4 py-3 flex flex-col justify-end items-end relative overflow-hidden">
            {/* Mock Map Preview */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <svg viewBox="0 0 100 100" className="w-full h-full stroke-gray-900 stroke-[0.5] fill-none">
                    <path d="M0 20 L20 0 M20 40 L40 20 M40 60 L60 40 M60 80 L80 60 M80 100 L100 80" />
                    <path d="M0 80 L20 100 M20 60 L40 80 M40 40 L60 60 M60 20 L80 40 M80 0 L100 20" />
                </svg>
            </div>
            <button className="bg-white/80 backdrop-blur-sm text-[10px] font-bold px-3 py-1.5 rounded-full border border-gray-200 shadow-sm relative z-10">
                Lihat Peta
            </button>
        </div>
    </div>
);

const Footer = () => (
    <footer className="bg-bg-soft pt-16 pb-8 border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-1">
                <div className="text-primary font-bold text-2xl mb-6">Eksporin</div>
                <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                    Memberdayakan petani Indonesia melalui teknologi untuk akses pasar yang lebih adil dan transparan.
                </p>
                <div className="flex gap-4 mt-8">
                    <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100 text-primary cursor-pointer hover:scale-110 transition-transform"><FacebookIcon /></div>
                    <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100 text-primary cursor-pointer hover:scale-110 transition-transform"><TwitterIcon /></div>
                    <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100 text-primary cursor-pointer hover:scale-110 transition-transform"><InstagramIcon /></div>
                    <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100 text-primary cursor-pointer hover:scale-110 transition-transform"><LinkedinIcon /></div>
                </div>
            </div>

            <div>
                <h4 className="font-bold text-gray-900 mb-6">Perusahaan</h4>
                <ul className="flex flex-col gap-4 text-sm text-gray-500">
                    <li className="hover:text-primary cursor-pointer">Tentang Kami</li>
                    <li className="hover:text-primary cursor-pointer">Karir</li>
                    <li className="hover:text-primary cursor-pointer">Kontak</li>
                </ul>
            </div>

            <div>
                <h4 className="font-bold text-gray-900 mb-6">Bantuan</h4>
                <ul className="flex flex-col gap-4 text-sm text-gray-500">
                    <li className="hover:text-primary cursor-pointer">Pusat Bantuan</li>
                    <li className="hover:text-primary cursor-pointer">Panduan Petani</li>
                    <li className="hover:text-primary cursor-pointer">FAQ</li>
                </ul>
            </div>

            <div>
                <h4 className="font-bold text-gray-900 mb-6">Legal</h4>
                <ul className="flex flex-col gap-4 text-sm text-gray-500">
                    <li className="hover:text-primary cursor-pointer">Privasi</li>
                    <li className="hover:text-primary cursor-pointer">Syarat & Ketentuan</li>
                </ul>
            </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-gray-200">
            <p className="text-xs text-gray-400 text-center">
                © 2026 Eksporin. Memberdayakan Petani Indonesia.
            </p>
        </div>
    </footer>
);

export default function HomePage() {
    return (
        <div className="min-h-screen bg-white font-body">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6">
                {/* Hero Section */}
                <section className="relative py-20 flex flex-col items-start min-h-[600px] overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute right-[-100px] top-[-100px] w-[600px] h-[600px] bg-card-bg rounded-full -z-10 blur-3xl opacity-50"></div>

                    <div className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
                        Edisi Panen 2024
                    </div>

                    <h1 className="text-6xl font-extrabold text-[#113114] leading-[1.1] max-w-2xl">
                        Temukan Permintaan <span className="text-primary">Komoditas</span> Terdekat
                    </h1>

                    <p className="text-gray-500 mt-6 max-w-lg text-lg leading-relaxed">
                        Hubungkan hasil bumi Anda langsung ke pengepul terverifikasi dengan harga pasar terbaik hari ini.
                    </p>

                    <SearchBox />
                </section>

                {/* Latest Requests */}
                <section className="py-20 mt-10">
                    <div className="flex items-end justify-between mb-10">
                        <div>
                            <h2 className="text-3xl font-extrabold text-gray-900">Permintaan Terbaru</h2>
                            <p className="text-gray-400 text-sm mt-1">Update terakhir: 5 menit yang lalu</p>
                        </div>
                        <div className="flex items-center gap-2 p-1 bg-bg-soft rounded-xl border border-gray-200">
                            <button className="p-2 bg-white text-gray-900 rounded-lg shadow-sm border border-gray-100">
                                <LayoutGrid size={18} />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                                <List size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <RequestCard
                            company="Koperasi Tani Makmur"
                            location="Pangalengan, Jawa Barat"
                            volume="500 Kg"
                            price="Rp 85.000"
                            type="Kopi Arabika"
                            bgColor="from-[#4a3721] to-[#6d4c41]"
                        />
                        <RequestCard
                            company="UD. Berkah Alam"
                            location="Jembrana, Bali"
                            volume="2 Ton"
                            price="Rp 42.500"
                            type="Kakao Kering"
                            bgColor="from-[#3e2723] to-[#5d4037]"
                        />
                        <RequestCard
                            company="Pengepul Jaya Lampung"
                            location="Metro, Lampung"
                            volume="800 Kg"
                            price="Rp 68.000"
                            type="Lada Hitam"
                            bgColor="from-[#212121] to-[#424242]"
                        />
                    </div>

                    <div className="flex justify-center mt-16">
                        <button className="flex items-center gap-2 px-8 py-3.5 bg-bg-soft hover:bg-gray-200 text-gray-900 font-bold rounded-xl transition-all border border-gray-200">
                            Muat Lebih Banyak
                            <ChevronDown size={20} />
                        </button>
                    </div>
                </section>
            </main>

            <Footer />

            {/* Floating Action Button */}
            <div className="fixed bottom-10 right-10 z-50">
                <button className="bg-primary hover:bg-primary-dark text-white p-5 rounded-3xl shadow-2xl transition-all hover:scale-110 active:scale-95 group">
                    <MessageSquare size={30} fill="currentColor" className="group-hover:rotate-12 transition-transform" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
                </button>
            </div>
        </div>
    );
}
