"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
    Search,
    MapPin,
    Bell,
    User,
    ChevronDown,
    Filter,
    Check,
    ChevronLeft,
    ChevronRight,
    SearchIcon
} from "lucide-react";

const Navbar = () => (
    <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 max-w-7xl mx-auto w-full sticky top-0 z-50">
        <div className="flex items-center gap-8">
            <Link href="/home" className="text-primary font-bold text-2xl tracking-tight">Eksporin</Link>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-500">
                <Link href="/home" className="hover:text-primary pb-1 transition-colors">Home</Link>
                <Link href="/explore" className="text-primary border-b-2 border-primary pb-1">Explore</Link>
                <Link href="#" className="hover:text-primary pb-1 transition-colors">About</Link>
                <Link href="#" className="hover:text-primary pb-1 transition-colors">Help</Link>
            </div>
        </div>
        <div className="flex items-center gap-4">
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

const Footer = () => (
    <footer className="bg-bg-soft pt-16 pb-8 border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
                <div className="text-primary font-bold text-xl mb-4">Eksporin</div>
                <p className="text-xs text-gray-500">© 2026 Eksporin. Tradisi Bertemu Teknologi.</p>
            </div>
            <div>
                <ul className="flex flex-col gap-2 text-xs text-gray-500">
                    <li className="hover:text-primary cursor-pointer">Syarat & Ketentuan</li>
                </ul>
            </div>
            <div>
                <ul className="flex flex-col gap-2 text-xs text-gray-500">
                    <li className="hover:text-primary cursor-pointer">Kebijakan Privasi</li>
                </ul>
            </div>
            <div>
                <ul className="flex flex-col gap-2 text-xs text-gray-500">
                    <li className="hover:text-primary cursor-pointer">Hubungi Kami</li>
                </ul>
            </div>
        </div>
    </footer>
);

const ProductCard = ({ title, location, price, unit, imageUrl, tag }: any) => (
    <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all group">
        <div className="relative h-48 bg-gray-100 overflow-hidden">
            <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
            {/* Tag like 'ORGANIK' or 'EXPORT QUALITY' */}
            {tag && (
                <div className="absolute top-4 left-4 z-10">
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full text-white uppercase tracking-tight ${tag === 'ORGANIK' ? 'bg-orange-500' : 'bg-gray-700/50 backdrop-blur-sm'}`}>
                        {tag}
                    </span>
                </div>
            )}
            {/* Real image would go here */}
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-bold text-sm bg-gradient-to-br from-gray-100 to-gray-200">
                {title} Image
            </div>
        </div>
        <div className="p-5">
            <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary transition-colors line-clamp-1">{title}</h3>
            <div className="flex items-center gap-1 mt-1 text-gray-500">
                <MapPin size={14} />
                <span className="text-xs font-medium">{location}</span>
            </div>
            
            <div className="mt-4 flex items-baseline gap-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">MULAI</span>
                <span className="text-xl font-extrabold text-primary">Rp {price}</span>
                <span className="text-xs font-bold text-gray-400">/{unit}</span>
            </div>

            <button className="w-full mt-6 py-3.5 bg-secondary hover:bg-orange-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-secondary/20 active:scale-95">
                Lihat Detail
            </button>
        </div>
    </div>
);

export default function ExplorePage() {
    const categories = [
        { name: "Beras & Serealia", active: true },
        { name: "Kopi & Teh", active: false },
        { name: "Rempah-Rempah", active: false },
        { name: "Sayur & Buah", active: false },
    ];

    const products = [
        { title: "Beras Pandan Wangi", location: "Pak Budi, Cianjur", price: "18.500", unit: "kg", tag: "ORGANIK" },
        { title: "Kopi Arabika Gayo", location: "Ibu Siti, Aceh Tengah", price: "125.000", unit: "kg", tag: "EXPORT QUALITY" },
        { title: "Lada Putih Muntok", location: "Pak Heru, Bangka Belitung", price: "95.000", unit: "kg" },
        { title: "Cengkeh Kering Manado", location: "Koperasi Tani, Minahasa", price: "110.000", unit: "kg" },
        { title: "Wortel Organik Brastagi", location: "Pak Anton, Karo", price: "12.000", unit: "kg" },
        { title: "Pisang Cavendish Grade A", location: "PT Tani Makmur, Lampung", price: "15.000", unit: "kg" },
    ];

    return (
        <div className="min-h-screen bg-bg-soft font-body">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-10">
                <div className="flex flex-col md:flex-row gap-10">
                    {/* Sidebar Filter */}
                    <aside className="w-full md:w-64 space-y-8">
                        <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">Pasar Komoditas</h1>
                        <p className="text-gray-500 text-sm">Menampilkan <span className="text-primary font-bold">24 hasil</span> untuk "Hasil Bumi Unggulan"</p>
                        
                        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 mt-10">
                            <div className="flex items-center gap-2 mb-8">
                                <Filter size={20} className="text-primary" />
                                <h3 className="font-bold text-gray-900">Filter</h3>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">KATEGORI</h4>
                                    <div className="space-y-3">
                                        {categories.map((cat, idx) => (
                                            <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${cat.active ? 'bg-primary border-primary' : 'border-gray-200 group-hover:border-primary'}`}>
                                                    {cat.active && <Check size={12} className="text-white" />}
                                                </div>
                                                <span className={`text-sm font-medium ${cat.active ? 'text-gray-900' : 'text-gray-500'}`}>{cat.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-100">
                                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">LOKASI ASAL</h4>
                                    <div className="relative">
                                        <select className="w-full bg-bg-soft border border-gray-100 rounded-xl px-4 py-3 appearance-none text-xs font-bold text-gray-900 focus:outline-none">
                                            <option>Semua Wilayah</option>
                                        </select>
                                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    </div>
                                </div>

                                <button className="w-full py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-2xl transition-all shadow-lg shadow-primary/20 mt-4">
                                    Terapkan Filter
                                </button>
                            </div>
                        </div>

                        {/* Program Mitra Tani Promo */}
                        <div className="relative rounded-[32px] overflow-hidden bg-[#7a6459] p-8 text-white group cursor-pointer shadow-lg">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                            <h3 className="text-xl font-bold mb-2 relative z-10">Program Mitra Tani</h3>
                            <p className="text-xs text-white/80 mb-6 relative z-10">Dukung langsung petani lokal dengan pembelian kontrak jangka panjang.</p>
                            <Link href="#" className="inline-flex items-center gap-1 text-xs font-bold border-b border-white/40 pb-1 relative z-10 hover:border-white transition-all">
                                Pelajari Selengkapnya
                            </Link>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                            <div className="flex flex-wrap items-center gap-2">
                                <button className="px-5 py-2 bg-primary text-white text-xs font-bold rounded-full">Terbaru</button>
                                <button className="px-5 py-2 bg-white text-gray-500 text-xs font-bold rounded-full hover:bg-gray-100 transition-colors">Harga Terendah</button>
                                <button className="px-5 py-2 bg-white text-gray-500 text-xs font-bold rounded-full hover:bg-gray-100 transition-colors">Rating Tertinggi</button>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Urutkan:</span>
                                <div className="relative">
                                    <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl text-sm font-bold text-gray-900 border border-transparent shadow-sm">
                                        Rekomendasi
                                        <ChevronDown size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product, idx) => (
                                <ProductCard key={idx} {...product} />
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-center items-center gap-2 mt-16">
                            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-400">
                                <ChevronLeft size={20} />
                            </button>
                            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white font-bold">1</button>
                            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-500 font-bold hover:bg-gray-300 transition-colors">2</button>
                            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-500 font-bold hover:bg-gray-300 transition-colors">3</button>
                            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-400 hover:bg-gray-300 transition-colors">
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
