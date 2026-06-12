    "use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "lucide-react";
import { GetProfile } from "@/features/auth/get_profile";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [userProfileImage, setUserProfileImage] = React.useState<string | null>(null);
    const pathname = usePathname();

    React.useEffect(() => {
        const checkAuth = async () => {
            try {
                const profile = await GetProfile();
                if (profile && !profile.error && profile.id) {
                    setIsLoggedIn(true);
                    const userObj = profile.user || profile;
                    const savedImage = typeof window !== "undefined" ? localStorage.getItem("profile_picture") : null;
                    setUserProfileImage(userObj.photo_url || userObj.image || savedImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(userObj.name || 'User')}&background=random`);
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
                    <Link href="/home" className={pathname === "/home" ? "text-primary border-b-2 border-primary pb-1" : "hover:text-primary pb-1 transition-colors"}>Home</Link>
                    <Link href="/explore" className={pathname === "/explore" ? "text-primary border-b-2 border-primary pb-1" : "hover:text-primary pb-1 transition-colors"}>Explore</Link>
                    <Link href="/about" className={pathname === "/about" ? "text-primary border-b-2 border-primary pb-1" : "hover:text-primary pb-1 transition-colors"}>About</Link>
                    <Link href="/help" className={pathname === "/help" ? "text-primary border-b-2 border-primary pb-1" : "hover:text-primary pb-1 transition-colors"}>Help</Link>
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
        </nav>
    );
}
