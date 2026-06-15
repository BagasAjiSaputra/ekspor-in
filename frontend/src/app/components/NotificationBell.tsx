"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import Link from "next/link";
import { getListings } from "@/features/listing/get_all_listing";

interface NotificationBellProps {
    buttonClassName?: string;
}

export default function NotificationBell({ buttonClassName = "p-3 bg-white border border-gray-100 rounded-2xl shadow-sm text-gray-400 hover:text-primary transition-colors relative flex items-center justify-center" }: NotificationBellProps) {
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [recentListings, setRecentListings] = useState<any[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchRecent = async () => {
            try {
                const res = await getListings();
                const data = Array.isArray(res) ? res : (res as any)?.data || [];
                // Urutkan berdasarkan yang paling baru
                const sorted = data.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                setRecentListings(sorted.slice(0, 5)); // Ambil 5 teratas
            } catch (err) {
                console.error(err);
            }
        };
        fetchRecent();

        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsNotifOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className={buttonClassName}
            >
                <Bell size={20} />
                {recentListings.length > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                )}
            </button>

            {isNotifOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-[100] origin-top-right animate-in fade-in zoom-in duration-200">
                    <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                        <h3 className="font-bold text-gray-900 text-sm">Notifikasi Global</h3>
                        <p className="text-xs text-gray-500 mt-0.5">Permintaan komoditas terbaru</p>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto">
                        {recentListings.length > 0 ? recentListings.map((listing: any) => (
                            <Link 
                                key={listing.id} 
                                href={`/listing/${listing.id}`}
                                className="block p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors"
                                onClick={() => setIsNotifOpen(false)}
                            >
                                <div className="flex gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#E6F4E8] flex items-center justify-center shrink-0">
                                        <Bell size={16} className="text-[#237127]" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-gray-900 line-clamp-1">{listing.title}</h4>
                                        <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                                            {listing.company_name || "Perusahaan"} mencari {listing.min_volume} Kg
                                        </p>
                                        <span className="text-[10px] font-bold text-[#237127] mt-1 block">Baru Saja</span>
                                    </div>
                                </div>
                            </Link>
                        )) : (
                            <div className="p-6 text-center text-gray-500 text-sm">Belum ada notifikasi</div>
                        )}
                    </div>
                    <Link 
                        href="/home" 
                        onClick={() => setIsNotifOpen(false)} 
                        className="block w-full p-3 text-center text-xs font-bold text-[#237127] hover:bg-gray-50 transition-colors"
                    >
                        Lihat Semua Permintaan
                    </Link>
                </div>
            )}
        </div>
    );
}
