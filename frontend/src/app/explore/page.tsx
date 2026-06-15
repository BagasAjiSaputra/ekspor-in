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
import Navbar from "@/app/components/Navbar";


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

const ProductCard = ({ id, title, location, price, unit, imageUrl, tag, userPhotoUrl, userName }: any) => (
    <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all group flex flex-col">
        <div className="relative h-48 bg-gray-100 overflow-hidden shrink-0">
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
        <div className="p-5 flex-1 flex flex-col">
            <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                    <img src={userPhotoUrl || `https://avatar.vercel.sh/${userName?.replace(/\s+/g, '-') || 'user'}?size=32`} alt={userName || "User"} className="w-full h-full object-cover" />
                </div>
                <span className="text-xs font-bold text-gray-600 line-clamp-1">{userName || "Pengepul"}</span>
            </div>

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

            <Link href={`/listing/${id || ''}`} className="flex items-center justify-center w-full mt-auto pt-6">
                <div className="w-full py-3.5 bg-secondary hover:bg-orange-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-secondary/20 active:scale-95 text-center">
                    Lihat Detail
                </div>
            </Link>
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
    const [profiles, setProfiles] = React.useState<Record<string, any>>({});
    const [isLoading, setIsLoading] = React.useState(true);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [activeSearch, setActiveSearch] = React.useState("");
    const [currentPage, setCurrentPage] = React.useState(1);
    const ITEMS_PER_PAGE = 6;

    React.useEffect(() => {
        const fetchListings = async () => {
            try {
                const response = await getListings();
                const data = Array.isArray(response) ? response : (response as any)?.data || [];
                setListings(data);

                // Fetch profiles for unique user_ids
                const uniqueUserIds = [...new Set(data.map((l: any) => l.user_id).filter(Boolean))];
                const { GetPublicProfile } = await import('@/features/auth/get_public_profile');
                const profilesData = await Promise.all(uniqueUserIds.map(userId => GetPublicProfile(userId as string)));
                
                const profilesMap: Record<string, any> = {};
                profilesData.forEach((profile, idx) => {
                    if (profile) {
                        profilesMap[uniqueUserIds[idx] as string] = profile;
                    }
                });
                setProfiles(profilesMap);
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
                                        
                                        // Ambil nama dari company atau user atau profile
                                        const publicProfile = profiles[listing.user_id];
                                        const companyName = listing.company?.company_name;
                                        const userName = listing.user?.name || publicProfile?.name;
                                        const displayName = companyName || userName || "Pengepul";
                                        
                                        // Foto Profil menggunakan user_image sesuai profil user
                                        let userPhotoUrl = null;
                                        const rawPhoto = listing.user?.user_image || listing.user?.photo_url || listing.company?.logo_url || publicProfile?.user_image;
                                        if (rawPhoto) {
                                            userPhotoUrl = rawPhoto.startsWith('http') ? rawPhoto : `${BASE_URL}${rawPhoto.startsWith('/') ? '' : '/'}${rawPhoto}`;
                                        }

                                        return (
                                            <ProductCard 
                                                key={listing.id || index} 
                                                id={listing.id}
                                                title={listing.title}
                                                location={listing.location || "Lokasi"}
                                                price={listing.price_buy?.toLocaleString('id-ID') || 0}
                                                unit="kg"
                                                imageUrl={imageUrl}
                                                tag={listing.commodity?.name}
                                                userPhotoUrl={userPhotoUrl}
                                                userName={displayName}
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
