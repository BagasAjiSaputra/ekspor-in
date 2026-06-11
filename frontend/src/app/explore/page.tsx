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
import { getListings } from "@/features/listing/get_all_listing";
import { BASE_URL } from "@/features/global/url";
import { GetProfile } from "@/features/auth/get_profile";

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);

    React.useEffect(() => {
        const checkAuth = async () => {
            try {
                const profile = await GetProfile();
                if (profile && !profile.error && profile.id) {
                    setIsLoggedIn(true);
                }
            } catch (err) {
                // Not logged in
            }
        };
        checkAuth();
    }, []);

    return (
        <nav className="flex items-center justify-between px-8 py-4 bg-white/95 backdrop-blur-sm border-b border-gray-100 w-full sticky top-0 z-50">
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
            {!isLoggedIn && (
                <div className="flex items-center gap-2">
                    <Link href="/login">
                        <button className="text-gray-600 hover:text-primary px-4 py-2 text-sm font-semibold transition-colors cursor-pointer">
                            Masuk
                        </button>
                    </Link>
                    <Link href="/register">
                        <button className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer">
                            Daftar
                        </button>
                    </Link>
                </div>
            )}
            {isLoggedIn && (
                <div className="flex items-center gap-3">
                    <div className="p-2 hover:bg-gray-100 rounded-full cursor-pointer transition-colors relative">
                        <Bell size={20} className="text-gray-600" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </div>
                    <Link href="/profile" className="p-2 hover:bg-gray-100 rounded-full cursor-pointer transition-colors border border-gray-200">
                        <User size={20} className="text-gray-600" />
                    </Link>
                </div>
            )}
        </div>
    </nav>
    );
};

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
            {imageUrl ? (
                <img src={imageUrl} alt={title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-bold text-sm bg-gradient-to-br from-gray-100 to-gray-200">
                    {title} Image
                </div>
            )}
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

    const [listings, setListings] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [activeSearch, setActiveSearch] = React.useState("");
    const [currentPage, setCurrentPage] = React.useState(1);
    const ITEMS_PER_PAGE = 6;

    React.useEffect(() => {
        const fetchListings = async () => {
            try {
                const response = await getListings();
                setListings(Array.isArray(response) ? response : (response as any)?.data || []);
            } catch (error) {
                console.error("Failed to fetch listings:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchListings();
    }, []);

    return (
        <div className="min-h-screen bg-bg-soft font-body">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-10">
                <div className="flex flex-col gap-10">
                    {/* Header & Search Section (Moved to top) */}
                    <div className="w-full">
                        <div className="mb-8">
                            <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">Pasar Komoditas</h1>
                            <p className="text-gray-500 text-sm mt-2">Menampilkan <span className="text-primary font-bold">{isLoading ? "..." : (listings.filter((l: any) => !activeSearch || l.title?.toLowerCase().includes(activeSearch.toLowerCase()) || l.commodity?.name?.toLowerCase().includes(activeSearch.toLowerCase()) || l.location?.toLowerCase().includes(activeSearch.toLowerCase())).length)} hasil</span> {activeSearch ? `untuk "${activeSearch}"` : "keseluruhan"}</p>
                        </div>
                        
                        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-6">
                            <div className="flex items-center gap-2 md:w-auto w-full shrink-0">
                                <h3 className="font-bold text-gray-900 whitespace-nowrap">Pencarian</h3>
                            </div>

                            <div className="flex-1 w-full relative">
                                <input 
                                    type="text" 
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setActiveSearch(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    onKeyDown={(e) => { if (e.key === 'Enter') setActiveSearch(searchQuery); }}
                                    placeholder="Cari komoditas..." 
                                    className="w-full bg-bg-soft border border-gray-100 rounded-xl pl-10 pr-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                />
                                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>

                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="w-full">


                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {isLoading ? (
                                <div className="col-span-full flex justify-center py-10">
                                    <p className="text-gray-500">Memuat data...</p>
                                </div>
                            ) : listings.length > 0 ? (
                                (() => {
                                    const filteredListings = listings.filter((l: any) => !activeSearch || l.title?.toLowerCase().includes(activeSearch.toLowerCase()) || l.commodity?.name?.toLowerCase().includes(activeSearch.toLowerCase()) || l.location?.toLowerCase().includes(activeSearch.toLowerCase()));
                                    
                                    if (filteredListings.length === 0) {
                                        return (
                                            <div className="col-span-full flex justify-center py-10">
                                                <p className="text-gray-500">Tidak ada barang yang cocok dengan pencarian "{activeSearch}".</p>
                                            </div>
                                        );
                                    }

                                    const paginatedListings = filteredListings.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

                                    return paginatedListings.map((listing: any, index: number) => {
                                        const imageUrl = listing.image_url ? `${BASE_URL}${listing.image_url.startsWith('/') ? '' : '/'}${listing.image_url}` : null;
                                        return (
                                            <ProductCard 
                                                key={listing.id || index} 
                                                title={listing.title}
                                                location={listing.location || "Lokasi"}
                                                price={listing.price_buy?.toLocaleString('id-ID') || 0}
                                                unit="kg"
                                                imageUrl={imageUrl}
                                                tag={listing.commodity?.name}
                                            />
                                        );
                                    });
                                })()
                            ) : (
                                <div className="col-span-full flex justify-center py-10">
                                    <p className="text-gray-500">Belum ada barang.</p>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {listings.length > 0 && (() => {
                            const filteredListings = listings.filter((l: any) => !activeSearch || l.title?.toLowerCase().includes(activeSearch.toLowerCase()) || l.commodity?.name?.toLowerCase().includes(activeSearch.toLowerCase()) || l.location?.toLowerCase().includes(activeSearch.toLowerCase()));
                            const totalPages = Math.ceil(filteredListings.length / ITEMS_PER_PAGE);
                            
                            if (totalPages <= 1) return null;

                            return (
                                <div className="flex justify-center items-center gap-2 mt-16">
                                    <button 
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${currentPage === 1 ? 'bg-gray-100 text-gray-300 cursor-not-allowed' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    
                                    {Array.from({ length: totalPages }).map((_, i) => (
                                        <button 
                                            key={i}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={`w-10 h-10 flex items-center justify-center rounded-full font-bold transition-colors ${currentPage === i + 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}

                                    <button 
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${currentPage === totalPages ? 'bg-gray-100 text-gray-300 cursor-not-allowed' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            );
                        })()}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
