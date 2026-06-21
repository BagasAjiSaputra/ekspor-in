"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Menu, X } from "lucide-react";
import { GetProfile } from "@/features/auth/get_profile";
import NotificationBell from "./NotificationBell";
import { BASE_URL } from "@/features/global/url";

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [userProfileImage, setUserProfileImage] = React.useState<string | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const pathname = usePathname();

    React.useEffect(() => {
        const checkAuth = async () => {
            try {
                const profile = await GetProfile();
                if (profile && !profile.error && profile.id) {
                    setIsLoggedIn(true);
                    const userObj = profile.user || profile;
                    const savedImage = typeof window !== "undefined" ? localStorage.getItem("profile_picture") : null;
                    const rawPhoto = userObj.user_image || userObj.photo_url || savedImage;
                    const finalPhoto = rawPhoto
                        ? (rawPhoto.startsWith('http') ? rawPhoto : `/api-proxy${rawPhoto.startsWith('/') ? '' : '/'}${rawPhoto}`)
                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(userObj.name || 'User')}&background=random`;
                    setUserProfileImage(finalPhoto);
                }
            } catch (err) {
                // Not logged in
            }
        };
        checkAuth();

        const handleProfileUpdate = () => {
            checkAuth();
        };

        window.addEventListener("profile_picture_updated", handleProfileUpdate);
        return () => window.removeEventListener("profile_picture_updated", handleProfileUpdate);
    }, []);

    return (
        <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-100 w-full sticky top-0 z-50">
            <div className="flex items-center justify-between px-6 md:px-8 py-4">
                <div className="flex items-center gap-8">
                    <Link href="/home" className="text-primary font-bold text-2xl tracking-tight">Eksporin</Link>
                    <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-500">
                        <Link href="/home" className={pathname === "/home" ? "text-primary border-b-2 border-primary pb-1" : "hover:text-primary pb-1 transition-colors"}>Home</Link>
                        <Link href="/explore" className={pathname === "/explore" ? "text-primary border-b-2 border-primary pb-1" : "hover:text-primary pb-1 transition-colors"}>Explore</Link>
                        <Link href="/about" className={pathname === "/about" ? "text-primary border-b-2 border-primary pb-1" : "hover:text-primary pb-1 transition-colors"}>About</Link>
                        <Link href="/help" className={pathname === "/help" ? "text-primary border-b-2 border-primary pb-1" : "hover:text-primary pb-1 transition-colors"}>Help</Link>
                    </div>
                </div>
                
                {/* Desktop Auth/Profile */}
                <div className="hidden md:flex items-center gap-4">
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
                            <NotificationBell buttonClassName="p-2 hover:bg-gray-100 rounded-full cursor-pointer transition-colors relative flex items-center justify-center text-gray-600" />
                            <Link href="/profile" className="p-0 hover:bg-gray-100 rounded-full cursor-pointer transition-colors border border-gray-200 overflow-hidden w-9 h-9 flex items-center justify-center">
                                {userProfileImage ? (
                                    <img src={userProfileImage} alt="Profile" className="w-full h-full object-cover rounded-full" />
                                ) : (
                                    <User size={20} className="text-gray-600" />
                                )}
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button & Profile/Bell */}
                <div className="md:hidden flex items-center gap-3">
                    {isLoggedIn && (
                        <div className="flex items-center gap-2">
                            <NotificationBell buttonClassName="p-1.5 hover:bg-gray-100 rounded-full cursor-pointer transition-colors relative flex items-center justify-center text-gray-600" />
                            <Link href="/profile" className="p-0 hover:bg-gray-100 rounded-full cursor-pointer transition-colors border border-gray-200 overflow-hidden w-8 h-8 flex items-center justify-center">
                                {userProfileImage ? (
                                    <img src={userProfileImage} alt="Profile" className="w-full h-full object-cover rounded-full" />
                                ) : (
                                    <User size={18} className="text-gray-600" />
                                )}
                            </Link>
                        </div>
                    )}
                    <button 
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                        className="p-1 text-gray-600 focus:outline-none hover:bg-gray-100 rounded-md"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl flex flex-col py-2 z-50">
                    <Link href="/home" onClick={() => setIsMobileMenuOpen(false)} className={`px-6 py-3 font-medium ${pathname === "/home" ? "text-primary bg-primary/5" : "text-gray-600"}`}>Home</Link>
                    <Link href="/explore" onClick={() => setIsMobileMenuOpen(false)} className={`px-6 py-3 font-medium ${pathname === "/explore" ? "text-primary bg-primary/5" : "text-gray-600"}`}>Explore</Link>
                    <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className={`px-6 py-3 font-medium ${pathname === "/about" ? "text-primary bg-primary/5" : "text-gray-600"}`}>About</Link>
                    <Link href="/help" onClick={() => setIsMobileMenuOpen(false)} className={`px-6 py-3 font-medium ${pathname === "/help" ? "text-primary bg-primary/5" : "text-gray-600"}`}>Help</Link>
                    
                    {!isLoggedIn && (
                        <div className="flex flex-col gap-3 px-6 py-4 mt-2 border-t border-gray-100">
                            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                <button className="w-full text-center text-gray-600 bg-gray-50 hover:bg-gray-100 py-2.5 rounded-xl font-semibold border border-gray-200 transition-colors">Masuk</button>
                            </Link>
                            <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                                <button className="w-full text-center bg-primary text-white py-2.5 rounded-xl font-semibold transition-colors">Daftar</button>
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
}
