"use client";

import React from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import {
    Search,
    MapPin,
    Bell,
    User,
    ChevronDown,
    LayoutGrid,
    List,
    MessageSquare,
    Coffee,
    Leaf,
    ShoppingBag,
    Box,
    ArrowRight,
    AlertCircle
} from "lucide-react";
import { getListings } from "@/features/listing/get_all_listing";
import { BASE_URL } from "@/features/global/url";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import dynamic from "next/dynamic";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { GetProfile } from "@/features/auth/get_profile";
import { useRouter } from "next/navigation";
import { GetAllCommodity } from "@/features/commodity/get_all_commodity";

const MapPicker = dynamic(() => import("@/app/create-post/components/Map"), { ssr: false });

const MiniMap = dynamic(() => import("./components/MiniMap"), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-gray-200 animate-pulse"></div>
});

const SearchBox = ({ onSearch, availableCommodities }: { onSearch: (loc: string, com: string) => void, availableCommodities: string[] }) => {
    const [location, setLocation] = React.useState("");
    const [commodity, setCommodity] = React.useState("Semua Komoditas");
    const [isLocating, setIsLocating] = React.useState(false);
    const [showMapModal, setShowMapModal] = React.useState(false);

    React.useEffect(() => {
        if ("geolocation" in navigator) {
            setIsLocating(true);
            navigator.geolocation.getCurrentPosition(
                async (pos) => {
                    try {
                        const { latitude, longitude } = pos.coords;
                        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                        const data = await response.json();
                        // Try to get a meaningful local name (city, county, or village)
                        const locName = data.address?.city || data.address?.county || data.address?.village || data.address?.state || "Lokasi Anda";
                        setLocation(locName);
                    } catch (e) {
                        console.error("Geocoding failed", e);
                    } finally {
                        setIsLocating(false);
                    }
                },
                (err) => {
                    // Silently fail if geolocation is denied or unavailable
                    setIsLocating(false);
                },
                { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
            );
        }
    }, []);

    return (
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/50 w-full max-w-2xl mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Pilih Komoditas</label>
                    <div className="relative">
                        <select 
                            value={commodity}
                            onChange={(e) => setCommodity(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 appearance-none text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        >
                            <option value="Semua Komoditas">Semua Komoditas</option>
                            {availableCommodities.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                        Lokasi {isLocating && <span className="text-primary normal-case font-normal">(Melacak...)</span>}
                    </label>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="Provinsi/Kab/Kec"
                                className="w-full bg-white border border-gray-200 rounded-xl px-10 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowMapModal(true)}
                            className="bg-[#237127] hover:bg-[#1b5e1e] text-white px-4 rounded-xl font-bold flex items-center justify-center transition-colors shrink-0 shadow-sm"
                            title="Pilih dari Peta"
                        >
                            <MapPin size={18} />
                        </button>
                    </div>
                </div>
            </div>
            <button 
                onClick={() => onSearch(location, commodity)}
                className="w-full bg-[#113114] hover:bg-black text-white py-4 rounded-xl mt-6 flex items-center justify-center gap-2 font-bold transition-all shadow-lg shadow-black/20 hover:-translate-y-0.5 active:translate-y-0"
            >
                <Search size={20} />
                Cari Permintaan Sekarang
            </button>

            {/* Map Modal */}
            {showMapModal && typeof window !== "undefined" && createPortal(
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[32px] p-6 w-full max-w-3xl h-[80vh] shadow-2xl border border-gray-100 flex flex-col animate-in fade-in zoom-in duration-200 text-left">
                        <div className="flex justify-between items-center mb-6 shrink-0">
                            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <MapPin className="text-[#237127]" size={24} />
                                Pilih Lokasi dari Peta
                            </h3>
                            <button 
                                onClick={() => setShowMapModal(false)}
                                className="text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-hidden">
                            <MapPicker 
                                onLocationSelect={(address) => {
                                    setLocation(address);
                                }} 
                                onClose={() => setShowMapModal(false)} 
                            />
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

const RequestCard = ({ id, title, company, location, volume, price, type, bgColor, imageUrl, latitude, longitude }: any) => (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full">
        <div className="relative h-48 bg-gray-200 shrink-0 overflow-hidden">
            {/* Image Display */}
            {imageUrl ? (
                <Image 
                    src={imageUrl} 
                    alt={title || company} 
                    fill 
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500" 
                />
            ) : (
                <div className={`absolute inset-0 bg-gradient-to-br ${bgColor} opacity-60 group-hover:scale-105 transition-transform duration-500`}></div>
            )}
            <div className="absolute top-4 left-4 z-10">
                <span className="bg-secondary text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-tight shadow-sm">
                    {type}
                </span>
            </div>
        </div>
        <div className="p-5 flex-1 flex flex-col">
            <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary transition-colors">{title || company}</h3>
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

            <div className="mt-auto pt-6">
                <Link href={`/listing/${id || ''}`} className="w-full py-2.5 rounded-xl border-2 border-primary text-primary font-bold text-sm hover:bg-primary/5 transition-colors flex items-center justify-center">
                    Detail
                </Link>
            </div>
        </div>
    </div>
);


export default function HomePage() {
    const [listings, setListings] = React.useState<any[]>([]);
    const [filteredListings, setFilteredListings] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [availableCommodities, setAvailableCommodities] = React.useState<string[]>([]);
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [showLoginAlert, setShowLoginAlert] = React.useState(false);
    const router = useRouter();

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

        const fetchListings = async () => {
            try {
                let uniqueCommodities: string[] = [];
                // Fetch commodities dari superadmin
                try {
                    const commRes = await GetAllCommodity();
                    if (commRes && !commRes.error) {
                        uniqueCommodities = Array.from(new Set(commRes.map((c: any) => c.name).filter(Boolean))) as string[];
                        setAvailableCommodities(uniqueCommodities);
                    }
                } catch (e) {
                    console.error("Failed to fetch commodities", e);
                }

                const response = await getListings();
                // Assumes response is an array or has a data property that is an array
                let data = Array.isArray(response) ? response : (response as any)?.data || [];
                
                // Map commodities to listings to show names instead of undefined
                try {
                    const commRes = await GetAllCommodity();
                    if (commRes && !commRes.error) {
                        data = data.map((item: any) => {
                            const commodity = commRes.find((c: any) => c.id === item.commodity_id);
                            if (commodity) {
                                item.commodity = commodity;
                            }
                            return item;
                        });
                    }
                } catch(e) {}
                
                // Fallback: Jika tidak bisa fetch dari GetAllCommodity (misal karena belum login / 401),
                // maka ambil list komoditas dari data listing yang tersedia.
                if (uniqueCommodities.length === 0 && data.length > 0) {
                    const activeCommodities = Array.from(new Set(data.map((l: any) => l.commodity?.name).filter(Boolean))) as string[];
                    setAvailableCommodities(activeCommodities);
                }
                
                // Sort by newest first
                data.sort((a: any, b: any) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
                
                setListings(data);
                setFilteredListings(data);
            } catch (error) {
                console.error("Failed to fetch listings:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchListings();
    }, []);

    const handleSearch = (locationFilter: string, commodityFilter: string) => {
        const params = new URLSearchParams();
        if (locationFilter && locationFilter.trim() !== "") {
            params.append("loc", locationFilter.trim());
        }
        if (commodityFilter && commodityFilter !== "Semua Komoditas") {
            params.append("com", commodityFilter);
        }
        router.push(`/explore?${params.toString()}`);
    };

    return (
        <div className="min-h-screen bg-white font-body">
            <Navbar />



            {/* Hero Section Full Width */}
            <section className="relative isolate pt-12 md:pt-20 pb-20 md:pb-28 flex flex-col items-center min-h-[500px] md:min-h-[550px] overflow-hidden justify-start w-full">
                    {/* Video Background */}
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover -z-20"
                    >
                        <source src="/hero_background.mp4" type="video/mp4" />
                    </video>
                    
                    {/* Overlay to ensure text readability */}
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] -z-10"></div>

                    {/* Content Container */}
                    <div className="max-w-7xl mx-auto px-6 w-full flex flex-col items-start relative z-10">
                        <div className="bg-white/80 text-primary px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 shadow-sm border border-white">
                        Edisi Panen 2026
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#113114] leading-[1.2] md:leading-[1.1] max-w-2xl drop-shadow-sm text-center md:text-left">
                        Temukan Permintaan <span className="text-primary">Komoditas</span> Terdekat
                    </h1>

                    <p className="text-gray-800 font-medium mt-4 md:mt-6 max-w-lg text-base md:text-lg leading-relaxed drop-shadow-sm text-center md:text-left">
                        Hubungkan hasil bumi Anda langsung ke pengepul terverifikasi dengan harga pasar terbaik hari ini.
                    </p>

                    <div className="w-full">
                        <SearchBox onSearch={handleSearch} availableCommodities={availableCommodities} />
                    </div>
                </div>
            </section>

            <main className="max-w-7xl mx-auto px-6">
                {/* Categories Section */}
                <section className="mt-16 mb-20">
                    <div className="flex flex-col items-center mb-10 text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900">Kategori Unggulan</h2>
                        <p className="text-gray-500 mt-2 max-w-xl">
                            Eksplorasi komoditas terbaik dari berbagai daerah di Indonesia yang siap untuk pasar global.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {[
                            { name: "Kopi & Teh", icon: <Coffee size={32} />, color: "bg-amber-50 text-amber-600 border-amber-100" },
                            { name: "Rempah Nusantara", icon: <Leaf size={32} />, color: "bg-green-50 text-green-600 border-green-100" },
                            { name: "Hasil Laut", icon: <ShoppingBag size={32} />, color: "bg-blue-50 text-blue-600 border-blue-100" },
                            { name: "Biji-bijian", icon: <Box size={32} />, color: "bg-orange-50 text-orange-600 border-orange-100" },
                        ].map((cat, i) => (
                            <div key={i} className={`flex flex-col items-center justify-center p-8 rounded-3xl border cursor-pointer hover:-translate-y-1 transition-transform ${cat.color}`}>
                                {cat.icon}
                                <span className="mt-4 font-bold text-gray-900">{cat.name}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Latest Requests */}
                <section className="py-16 mt-10">
                    <div className="flex items-end justify-between mb-10">
                        <div>
                            <h2 className="text-3xl font-extrabold text-gray-900">Permintaan Terbaru</h2>
                            <p className="text-gray-400 text-sm mt-1">Update terakhir: 5 menit yang lalu</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {isLoading ? (
                            <div className="col-span-full flex justify-center py-10">
                                <p className="text-gray-500">Memuat permintaan...</p>
                            </div>
                        ) : filteredListings.length > 0 ? (
                            filteredListings.slice(0, 3).map((listing: any, index: number) => {
                                // Karena UPLOAD_PATH di backend kosong, FileServer membaca dari root folder aplikasi (/app)
                                // Sedangkan gambar disimpan di /app/storage/uploads/
                                // Jadi kita harus menambahkan /storage sebelum URL gambarnya
                                const imageUrl = listing.image_url ? `/api-proxy${listing.image_url.startsWith('/') ? '' : '/'}${listing.image_url}` : null;
                                
                                return (
                                <RequestCard
                                    key={listing.id || index}
                                    id={listing.id}
                                    title={listing.title}
                                    company={listing.company_name || "Perusahaan"}
                                    location={listing.location || "Lokasi"}
                                    volume={`${listing.min_volume || 0} Kg`}
                                    price={`Rp ${listing.price_buy?.toLocaleString('id-ID') || 0}`}
                                    type={listing.commodity?.name || "Komoditas"}
                                    imageUrl={imageUrl}
                                    latitude={listing.latitude || listing.location_lat}
                                    longitude={listing.longitude || listing.location_lng}
                                    bgColor={
                                        index % 3 === 0 ? "from-[#4a3721] to-[#6d4c41]" :
                                        index % 3 === 1 ? "from-[#3e2723] to-[#5d4037]" :
                                        "from-[#212121] to-[#424242]"
                                    }
                                />
                            )})
                        ) : (
                            <div className="col-span-full flex justify-center py-10">
                                <p className="text-gray-500">Belum ada permintaan terbaru.</p>
                            </div>
                        )}
                    </div>

                </section>

                {/* Impact Stats */}
                <section className="my-24 bg-[#113114] rounded-[40px] p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                    
                    <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-white/10 text-center">
                        <div className="flex flex-col items-center justify-center pt-4 sm:pt-0">
                            <div className="text-4xl font-extrabold text-white mb-2">50+</div>
                            <div className="text-xs font-bold text-gray-300 uppercase tracking-widest mt-1">Negara Tujuan</div>
                        </div>
                        <div className="flex flex-col items-center justify-center border-white/10 pt-8 sm:pt-0">
                            <div className="text-4xl font-extrabold text-[#B8E5B3] mb-2">10K+</div>
                            <div className="text-xs font-bold text-gray-300 uppercase tracking-widest mt-1">Ton Komoditas</div>
                        </div>
                        <div className="flex flex-col items-center justify-center border-white/10 pt-8 sm:pt-0">
                            <div className="text-4xl font-extrabold text-white mb-2">2.5K+</div>
                            <div className="text-xs font-bold text-gray-300 uppercase tracking-widest mt-1">Pengepul Aktif</div>
                        </div>
                        <div className="flex flex-col items-center justify-center border-white/10 pt-8 sm:pt-0">
                            <div className="text-4xl font-extrabold text-[#B8E5B3] mb-2">99%</div>
                            <div className="text-xs font-bold text-gray-300 uppercase tracking-widest mt-1">Tingkat Sukses</div>
                        </div>
                    </div>
                </section>

                {/* Call To Action */}
                <section className="my-20 md:my-24 text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
                        Siap Mengembangkan Jaringan Ekspor Anda?
                    </h2>
                    <p className="text-lg text-gray-500 mt-6 mb-10">
                        Bergabunglah dengan ribuan pengepul lainnya dan temukan pembeli potensial dari seluruh dunia dengan platform Eksporin.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button 
                            onClick={(e) => {
                                if (isLoggedIn) {
                                    e.preventDefault();
                                    setShowLoginAlert(true);
                                } else {
                                    router.push("/register");
                                }
                            }}
                            className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-primary/30 hover:-translate-y-1 active:translate-y-0"
                        >
                            Mulai Sekarang Gratis
                        </button>
                        <Link href="/explore" className="w-full sm:w-auto">
                            <button className="w-full sm:w-auto justify-center bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 px-8 py-4 rounded-2xl font-bold transition-all flex items-center gap-2 hover:-translate-y-1 active:translate-y-0 shadow-sm">
                                Lihat Pasar
                                <ArrowRight size={18} />
                            </button>
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />

            {/* Custom Alert Modal */}
            {showLoginAlert && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100">
                        <div className="p-8 text-center flex flex-col items-center">
                            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
                                <AlertCircle size={40} strokeWidth={2} />
                            </div>
                            <h3 className="text-2xl font-extrabold text-gray-900 mb-3">Akses Ditolak</h3>
                            <p className="text-gray-500 font-medium mb-8 leading-relaxed">
                                Anda sudah melakukan login dan daftar di sistem kami.
                            </p>
                            <button 
                                onClick={() => setShowLoginAlert(false)}
                                className="w-full py-3.5 rounded-2xl bg-gray-900 text-white font-bold hover:bg-black transition-colors shadow-lg shadow-black/10"
                            >
                                Mengerti
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
