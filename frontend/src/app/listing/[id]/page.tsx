"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Droplet, Layers, Award, Leaf, MapPin, Phone, MessageCircle } from "lucide-react";
import { getListings } from "@/features/listing/get_all_listing";
import { BASE_URL } from "@/features/global/url";
import { GetProfile } from "@/features/auth/get_profile";
import { GetCompany } from "@/features/company/get_company";
import dynamic from "next/dynamic";
import Navbar from "@/app/components/Navbar";

const MiniMap = dynamic(() => import("../../home/components/MiniMap"), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-gray-200 animate-pulse"></div>
});

export default function ListingDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [listing, setListing] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [userProfile, setUserProfile] = useState<any>(null);
    const [userCompany, setUserCompany] = useState<any>(null);
    const [userProfileImage, setUserProfileImage] = useState<string | null>(null);
    const [publicProfile, setPublicProfile] = useState<any>(null);

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const response = await getListings();
                const data = Array.isArray(response) ? response : (response as any)?.data || [];
                const found = data.find((item: any) => item.id === id);
                setListing(found);

                if (found?.user_id) {
                    const { GetPublicProfile } = await import('@/features/auth/get_public_profile');
                    const profile = await GetPublicProfile(found.user_id);
                    if (profile) setPublicProfile(profile);
                }
            } catch (error) {
                console.error("Failed to fetch listing:", error);
            } finally {
                setIsLoading(false);
            }
        };
        
        const fetchUserData = async () => {
            try {
                const profile = await GetProfile();
                if (!profile?.error) {
                    const userObj = profile.user || profile;
                    setUserProfile(userObj);
                    
                    const savedImage = typeof window !== "undefined" ? localStorage.getItem("profile_picture") : null;
                    setUserProfileImage(userObj.photo_url || userObj.image || savedImage || null);
                }
                
                const company = await GetCompany();
                if (!company?.error) setUserCompany(company);
            } catch (err) {
                console.error("Failed to fetch user fallback data:", err);
            }
        };

        if (id) {
            fetchListing();
            fetchUserData();
        }
    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD]">
                <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!listing) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFDFD]">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Permintaan tidak ditemukan</h2>
                <button onClick={() => router.push('/home')} className="px-6 py-2 bg-primary text-white rounded-xl font-bold">Kembali ke Beranda</button>
            </div>
        );
    }

    const price = listing.price_buy || 0;
    const volumeKg = listing.min_volume || 0;
    const isTon = volumeKg >= 1000;
    const displayVolume = isTon ? (volumeKg / 1000).toFixed(1) : volumeKg;
    const displayUnit = isTon ? "Ton" : "Kg";
    
    // Parse coordinates
    const lat = listing.latitude || listing.location_lat;
    const lng = listing.longitude || listing.location_lng;
    const hasCoordinates = lat && lng;

    const handleAcceptOffer = () => {
        let phone = listing.company?.phone || listing.user?.phone || publicProfile?.phone || publicProfile?.company?.phone;
        
        if (!phone) {
            alert("Nomor WhatsApp pihak terkait belum didaftarkan di profil mereka.");
            return;
        }

        let cleanPhone = phone.replace(/\D/g, '');
        if (cleanPhone.startsWith('0')) {
            cleanPhone = '62' + cleanPhone.substring(1);
        }

        const targetName = listing.company_name || listing.company?.name || listing.user?.name || publicProfile?.name || "Bapak/Ibu";
        const message = `Halo ${targetName}, saya melihat postingan *${listing.title}* di Eksporin. Saya tertarik dengan penawaran komoditas sebesar ${displayVolume} ${displayUnit} dengan harga Rp ${price.toLocaleString('id-ID')}/kg. Apakah penawaran ini masih tersedia?`;

        const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <div className="min-h-screen bg-[#FDFDFD] font-body flex flex-col">
            {/* Header */}
            <Navbar />

            {/* Main Content */}
            <main className="flex-1 w-full px-8 py-2 md:py-4">
                <div className="max-w-[1600px] mx-auto">
                    {/* Header Info */}
                    <div className="mb-6 pb-6 border-b border-gray-100">
                        {/* Back Button */}
                        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold mb-4 transition-colors text-sm">
                            <ArrowLeft size={18} />
                            Kembali
                        </button>

                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                {/* Title */}
                                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight mb-2">
                                    {listing.title}
                                </h1>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-10 xl:gap-16">
                        {/* Left Column */}
                        <div className="flex-1 flex flex-col">
                            {/* User Info & Tags */}
                            <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden border border-gray-300">
                                        <img 
                                            src={
                                                (listing.user?.user_image || publicProfile?.user_image)
                                                    ? ((listing.user?.user_image || publicProfile?.user_image).startsWith('http') 
                                                        ? (listing.user?.user_image || publicProfile?.user_image) 
                                                        : `/api-proxy${(listing.user?.user_image || publicProfile?.user_image).startsWith('/') ? '' : '/'}${listing.user?.user_image || publicProfile?.user_image}`)
                                                    : `https://avatar.vercel.sh/${listing.company_name || listing.company?.name || listing.user?.name || publicProfile?.name || listing.id}?size=40`
                                            } 
                                            alt="Avatar Pengepul" 
                                            className="w-full h-full object-cover" 
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-base">{listing.company_name || listing.company?.name || listing.user?.name || publicProfile?.name || "Pengepul Anonim"}</h3>
                                        <div className="flex items-center gap-1.5 text-gray-500 text-xs mt-0.5">
                                            <CheckCircle2 size={12} className="text-primary" />
                                            <span className="font-medium">Pengepul Terverifikasi • {listing.location || "Lokasi tidak tersedia"}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Tags */}
                                <div className="flex items-center gap-2">
                                    <span className="bg-[#B8E5B3] text-[#113114] text-[9px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-widest">
                                        {listing.commodity?.name || "Komoditas"}
                                    </span>
                                    <span className="bg-[#9E7C4A] text-white text-[9px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-widest shadow-sm">
                                        Dicari
                                    </span>
                                </div>
                            </div>

                            {/* Highlight Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                            {/* Price Card */}
                            <div className="bg-[#237127] rounded-3xl p-5 text-white shadow-lg shadow-green-900/10 flex flex-col justify-center">
                                <h4 className="text-[9px] font-bold text-white/70 uppercase tracking-widest mb-2">Harga Beli / Ekspor</h4>
                                <div className="flex items-baseline gap-2 mb-3">
                                    <span className="text-2xl font-extrabold">Rp {price.toLocaleString('id-ID')}</span>
                                    <span className="text-white/80 font-medium text-sm">/ kg</span>
                                </div>
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold w-fit">
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                                    Penawaran Terbaik
                                </div>
                            </div>

                            {/* Volume Card */}
                            <div className="bg-[#EAEBE8] rounded-3xl p-5 border border-gray-200 flex flex-col justify-center">
                                <h4 className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-2">Volume Dibutuhkan</h4>
                                <div className="flex items-baseline gap-2 mb-3">
                                    <span className="text-3xl font-extrabold text-[#237127]">{displayVolume}</span>
                                    <span className="text-gray-600 font-bold text-sm">{displayUnit}</span>
                                </div>
                                <p className="text-[10px] font-bold text-gray-500">
                                    Batas Waktu: <span className="text-gray-800">Cepat Berlaku</span>
                                </p>
                            </div>
                        </div>

                        {/* Specifications Container */}
                        <div className="bg-[#F6F7F5] rounded-3xl p-4 mb-2">
                            <h3 className="font-extrabold text-gray-900 text-base flex items-center gap-2 mb-3">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#237127" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                Spesifikasi Kualitas
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="bg-white rounded-2xl p-3 flex items-start gap-3 border border-gray-100 shadow-sm">
                                    <div className="text-[#9E7C4A] mt-1"><Award size={16} /></div>
                                    <div>
                                        <h4 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Kualitas</h4>
                                        <p className="font-bold text-gray-900 text-xs mt-0.5">{listing.quality || "Standar Ekspor"}</p>
                                    </div>
                                </div>
                                <div className="bg-white rounded-2xl p-3 flex items-start gap-3 border border-gray-100 shadow-sm">
                                    <div className="text-[#9E7C4A] mt-1"><Leaf size={16} /></div>
                                    <div>
                                        <h4 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Deskripsi</h4>
                                        <p className="font-bold text-gray-900 text-xs mt-0.5 line-clamp-2">{listing.description || "Tidak ada spesifikasi tambahan"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Column (Map) */}
                    <div className="w-full lg:w-[400px] xl:w-[450px] shrink-0">
                        {/* Delivery Address & Map */}
                        <div className="sticky top-24 mb-4">
                            <h3 className="font-extrabold text-gray-900 text-lg flex items-center gap-2 mb-3">
                                <MapPin size={20} className="text-[#237127]" />
                                Alamat Pengiriman
                            </h3>

                            <div className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm flex flex-col">
                                <div className="h-40 lg:h-48 bg-gray-200 relative w-full z-0 isolate group">
                                    {/* Full Width Map Preview */}
                                    <MiniMap 
                                        lat={hasCoordinates ? parseFloat(lat) : -0.7893} 
                                        lng={hasCoordinates ? parseFloat(lng) : 113.9213} 
                                        zoom={hasCoordinates ? 15 : 5}
                                    />
                                    <div className="absolute inset-0 pointer-events-none z-10 shadow-inner"></div>
                                    
                                    {/* Hover Overlay Button */}
                                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex items-center justify-center pointer-events-none">
                                        <button 
                                            onClick={() => {
                                                const mapUrl = hasCoordinates 
                                                    ? `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
                                                    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(listing.location || listing.address || "Indonesia")}`;
                                                window.open(mapUrl, '_blank');
                                            }}
                                            className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-full font-bold text-sm shadow-xl flex items-center gap-2 pointer-events-auto hover:bg-white hover:scale-105 transition-all text-gray-900"
                                        >
                                            <MapPin size={18} className="text-primary" />
                                            Buka Peta Interaktif
                                        </button>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h4 className="font-bold text-gray-900 text-sm">{listing.location || "Alamat Lengkap"}</h4>
                                    <p className="text-gray-500 text-xs mt-1">{listing.address || "Lokasi spesifik tidak dicantumkan oleh pengiklan."}</p>
                                </div>
                            </div>
                            
                            <button 
                                onClick={handleAcceptOffer}
                                className="w-full bg-[#25D366] hover:bg-[#1DA851] text-white font-extrabold py-3 px-6 rounded-2xl mt-4 shadow-xl shadow-green-900/20 transition-all hover:-translate-y-1 flex items-center justify-center gap-2 text-base active:translate-y-0"
                            >
                                <MessageCircle size={20} />
                                Lanjut ke WhatsApp
                            </button>
                        </div>
                    </div>
                </div>
                </div>
            </main>
        </div>
    );
}
