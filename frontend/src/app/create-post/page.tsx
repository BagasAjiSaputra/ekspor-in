"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
    Home,
    User,
    PlusSquare,
    Edit3,
    Settings,
    LogOut,
    Bell,
    ChevronDown,
    MapPin,
    Plus,
    Upload,
    MessageSquare,
    Camera
} from "lucide-react";
import { CreateListingAction } from "@/features/listing/create_listing";
import { Logout } from "@/features/auth/logout";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { GetCompany } from "@/features/company/get_company";
import { GetAllCommodity } from "@/features/commodity/get_all_commodity";
import { GetProfile } from "@/features/auth/get_profile";
import dynamic from "next/dynamic";
import NotificationBell from "@/app/components/NotificationBell";

const MapPicker = dynamic(() => import("./components/Map"), { ssr: false });


export default function CreatePostPage() {
    const router = useRouter();
    const [sidebarActive, setSidebarActive] = useState("Buat Postingan");

    const [formData, setFormData] = useState({
        commodity_id: "",
        title: "",
        min_volume: "",
        price_buy: "",
        address: "",
        quality: "",
        description: "",
        whatsapp: "",
        email: "",
    });
    const [commodities, setCommodities] = useState<any[]>([]);
    const [companyId, setCompanyId] = useState<string>("");
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{type: "success" | "error" | null, text: string}>({type: null, text: ""});
    const [showMapModal, setShowMapModal] = useState(false);
    const [userProfileImage, setUserProfileImage] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [company, commodityList, profile] = await Promise.all([
                    GetCompany(),
                    GetAllCommodity(),
                    GetProfile()
                ]);
                
                if (profile && !profile.error) {
                    const userObj = profile.user || profile;
                    const savedImage = typeof window !== "undefined" ? localStorage.getItem("profile_picture") : null;
                    setUserProfileImage(userObj.photo_url || userObj.image || savedImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(userObj.name || 'User')}&background=random`);
                }

                if (company && company.error) {
                    if (profile?.is_verified === "pending") {
                        setMessage({ type: "error", text: `Perhatian: Pengajuan perusahaan Anda sedang diproses. Harap tunggu hingga Superadmin menyetujui akun Anda.` });
                    } else if (profile?.is_verified === "verified") {
                        setMessage({ type: "error", text: `Perhatian: Silakan isi data perusahaan Anda sekali lagi di menu Profil agar tersimpan permanen.` });
                    } else {
                        setMessage({ type: "error", text: `Perhatian: Anda belum mendaftarkan perusahaan. Silakan daftar di menu Profil terlebih dahulu.` });
                    }
                } else if (company && company.id) {
                    setCompanyId(company.id);
                    setFormData(prev => ({
                        ...prev,
                        address: company.address || prev.address,
                        whatsapp: company.phone || "",
                        email: profile?.email || profile?.user?.email || ""
                    }));
                }
                
                if (commodityList && commodityList.error) {
                    setMessage({ type: "error", text: `Gagal GetCommodity: ${commodityList.status} ${commodityList.message}` });
                    return;
                }
                
                if (commodityList && Array.isArray(commodityList.data)) {
                    setCommodities(commodityList.data);
                    if (commodityList.data.length > 0) {
                        setFormData(prev => ({...prev, commodity_id: commodityList.data[0].id}));
                    }
                } else if (Array.isArray(commodityList)) {
                    setCommodities(commodityList);
                    if (commodityList.length > 0) {
                        setFormData(prev => ({...prev, commodity_id: commodityList[0].id}));
                    }
                } else if (commodityList && typeof commodityList === "object") {
                    // Fallback to debug what we actually received
                    setMessage({ type: "error", text: `GetCommodity invalid structure: ${JSON.stringify(commodityList)}` });
                }
            } catch (err: any) {
                console.error("Failed to fetch prerequisite data", err);
                setMessage({ type: "error", text: `Error fetching data: ${err.message}` });
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ type: null, text: "" });

        try {
            if (!companyId) {
                throw new Error("Anda belum memiliki perusahaan. Silakan daftar perusahaan terlebih dahulu.");
            }
            if (!formData.commodity_id) {
                throw new Error("Silakan pilih kategori komoditas.");
            }

            const formDataPayload = new FormData();
            formDataPayload.append("commodity_id", formData.commodity_id);
            formDataPayload.append("company_id", companyId);
            formDataPayload.append("title", formData.title);
            formDataPayload.append("description", formData.description);
            formDataPayload.append("min_volume", formData.min_volume);
            formDataPayload.append("quality", formData.quality);
            formDataPayload.append("price_buy", formData.price_buy);
            formDataPayload.append("location", formData.address);
            formDataPayload.append("address", formData.address);
            
            if (imageFile) {
                formDataPayload.append("image", imageFile);
            }

            const res = await CreateListingAction(formDataPayload);
            if (!res.success) {
                throw new Error(res.message);
            }
            setMessage({ type: "success", text: res.message || "Berhasil mempublikasikan kebutuhan!" });
            setFormData(prev => ({
                ...prev,
                title: "",
                min_volume: "",
                price_buy: "",
                address: "",
                quality: "",
                description: "",
            }));
            setImageFile(null);
            setImagePreview(null);
        } catch (err: any) {
            setMessage({ type: "error", text: err.message || "Gagal membuat postingan." });
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await Logout();
        } catch (err: any) {
            if (err.message === "NEXT_REDIRECT") {
                // Ignore
            }
        } finally {
            router.push("/home");
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const menuItems = [
        { name: "Beranda", icon: <Home size={20} />, active: false, href: "/home" },
        { name: "Profil", icon: <User size={20} />, active: false, href: "/profile" },
        { name: "Buat Postingan", icon: <PlusSquare size={20} />, active: true, href: "/create-post" },
        { name: "Daftar Postingan", icon: <Edit3 size={20} />, active: false, href: "/active-posts" },
    ];

    const bottomMenuItems = [
        { name: "Keluar", icon: <LogOut size={20} />, active: false, href: "/login" },
    ];

    return (
        <div className="min-h-screen bg-[#FDFDFD] flex font-body">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-100 flex flex-col p-6 sticky top-0 h-screen">
                <div className="mb-10 px-2">
                    <h1 className="text-primary font-bold text-2xl tracking-tight">Eksporin</h1>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Modern Agrarian</p>
                </div>

                <nav className="flex-1 space-y-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${item.name === sidebarActive
                                ? "bg-bg-soft text-primary shadow-sm"
                                : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                }`}
                            onClick={() => setSidebarActive(item.name)}
                        >
                            <span className={item.name === sidebarActive ? "text-primary" : "text-gray-400"}>
                                {item.icon}
                            </span>
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="pt-6 border-t border-gray-100 space-y-2">
                    {bottomMenuItems.map((item) => item.name === "Keluar" ? (
                        <button
                            key={item.name}
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-all"
                        >
                            <span className="text-gray-400">{item.icon}</span>
                            {item.name}
                        </button>
                    ) : (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-all"
                        >
                            <span className="text-gray-400">{item.icon}</span>
                            {item.name}
                        </Link>
                    ))}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-10 max-w-7xl mx-auto">
                {/* Header */}
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h2 className="text-4xl font-extrabold text-gray-900">Halo, Pengepul Berkah</h2>
                        <p className="text-gray-500 mt-2 font-medium">
                            Kelola stok dan postingan komoditas Anda hari ini.
                        </p>
                    </div>
                </header>

                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Form Section */}
                    <div className="flex-1">
                        <div className="bg-[#F8F9F7] rounded-[40px] p-10 border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#237127] shadow-sm border border-gray-100">
                                    <Plus size={24} />
                                </div>
                                <h3 className="text-2xl font-extrabold text-gray-900">Buat Postingan Baru</h3>
                            </div>

                            <form className="space-y-8" onSubmit={handleSubmit}>
                                {message.type && (
                                    <div className={`p-4 rounded-2xl text-xs font-bold border ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                                        {message.text}
                                    </div>
                                )}
                                <div className="space-y-3">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Foto Komoditas</label>
                                    <label className="border-2 border-dashed border-gray-200 rounded-[24px] p-8 flex flex-col items-center justify-center gap-3 hover:border-primary/30 hover:bg-white transition-all cursor-pointer group relative overflow-hidden h-48 block w-full">
                                        {imagePreview ? (
                                            <>
                                                <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                                                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Camera size={24} className="mb-2" />
                                                    <p className="text-sm font-bold">Ganti Foto</p>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 group-hover:text-primary transition-colors">
                                                    <Camera size={24} />
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-sm font-bold text-gray-700">Unggah Foto Komoditas</p>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight mt-1">PNG, JPG atau WEBP (Maks. 5MB)</p>
                                                </div>
                                            </>
                                        )}
                                        <input 
                                            type="file" 
                                            className="hidden" 
                                            accept="image/*" 
                                            onChange={handleImageChange}
                                            disabled={isLoading}
                                        />
                                    </label>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Kategori Komoditas</label>
                                        <div className="relative">
                                            <select
                                                value={formData.commodity_id}
                                                onChange={(e) => setFormData({...formData, commodity_id: e.target.value})}
                                                required
                                                disabled={isLoading || commodities.length === 0}
                                                className="w-full bg-gray-200/50 border border-transparent rounded-[24px] py-4 px-6 text-sm font-bold text-gray-700 focus:outline-none focus:bg-white focus:border-primary/30 transition-all disabled:opacity-50 appearance-none"
                                            >
                                                <option value="" disabled>-- Pilih Komoditas --</option>
                                                {commodities.map((c) => (
                                                    <option key={c.id || Math.random()} value={c.id}>
                                                        {c.name || "Tanpa Nama"}
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Judul Postingan</label>
                                        <input
                                            type="text"
                                            placeholder="Contoh: Jagung Pipil"
                                            value={formData.title}
                                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                                            required
                                            disabled={isLoading}
                                            className="w-full bg-gray-200/50 border border-transparent rounded-[24px] py-4 px-6 text-sm font-bold text-gray-700 focus:outline-none focus:bg-white focus:border-primary/30 transition-all disabled:opacity-50"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Volume Estimasi (Ton)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            placeholder="Contoh: 5.5"
                                            value={formData.min_volume}
                                            onChange={(e) => setFormData({...formData, min_volume: e.target.value})}
                                            required
                                            disabled={isLoading}
                                            className="w-full bg-gray-200/50 border border-transparent rounded-[24px] py-4 px-6 text-sm font-bold text-gray-700 focus:outline-none focus:bg-white focus:border-primary/30 transition-all disabled:opacity-50"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Harga Beli Target (Rp/Kg)</label>
                                        <div className="relative">
                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 font-bold text-gray-900">Rp</div>
                                            <input
                                                type="number"
                                                placeholder="0"
                                                value={formData.price_buy}
                                                onChange={(e) => setFormData({...formData, price_buy: e.target.value})}
                                                required
                                                disabled={isLoading}
                                                className="w-full bg-gray-200/50 border border-transparent rounded-[24px] py-4 pl-14 pr-6 text-sm font-bold text-gray-700 focus:outline-none focus:bg-white focus:border-primary/30 transition-all disabled:opacity-50"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Lokasi Gudang / Penjemputan</label>
                                        <div className="flex gap-3">
                                            <div className="relative group flex-1">
                                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#237127]">
                                                    <MapPin size={20} />
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Kecamatan, Kabupaten"
                                                    value={formData.address}
                                                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                                                    required
                                                    disabled={isLoading}
                                                    className="w-full bg-gray-200/50 border border-transparent rounded-[24px] py-4 pl-14 pr-6 text-sm font-bold text-gray-700 focus:outline-none focus:bg-white focus:border-primary/30 transition-all disabled:opacity-50"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setShowMapModal(true)}
                                                className="bg-[#237127] hover:bg-[#1b5e1e] text-white px-6 rounded-[24px] font-bold flex items-center gap-2 transition-colors shadow-sm whitespace-nowrap"
                                            >
                                                <MapPin size={18} />
                                                Peta
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Kualitas</label>
                                        <input
                                            type="text"
                                            placeholder="Contoh: Kekeringan 50%"
                                            value={formData.quality}
                                            onChange={(e) => setFormData({...formData, quality: e.target.value})}
                                            required
                                            disabled={isLoading}
                                            className="w-full bg-gray-200/50 border border-transparent rounded-[24px] py-4 px-6 text-sm font-bold text-gray-700 focus:outline-none focus:bg-white focus:border-primary/30 transition-all disabled:opacity-50"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Nomor WhatsApp</label>
                                        <input
                                            type="text"
                                            value={formData.whatsapp}
                                            readOnly
                                            className="w-full bg-gray-100 border border-transparent rounded-[24px] py-4 px-6 text-sm font-bold text-gray-500 focus:outline-none transition-all cursor-not-allowed"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            readOnly
                                            className="w-full bg-gray-100 border border-transparent rounded-[24px] py-4 px-6 text-sm font-bold text-gray-500 focus:outline-none transition-all cursor-not-allowed"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Deskripsi Barang</label>
                                    <div className="relative group">
                                        <textarea
                                            placeholder="Tuliskan detail deskripsi komoditas, seperti kondisi, spesifikasi, atau catatan tambahan..."
                                            rows={4}
                                            value={formData.description}
                                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                                            required
                                            disabled={isLoading}
                                            className="w-full bg-gray-200/50 border border-transparent rounded-[24px] py-4 px-6 text-sm font-medium text-gray-700 focus:outline-none focus:bg-white focus:border-primary/30 transition-all resize-none disabled:opacity-50"
                                        ></textarea>
                                    </div>
                                </div>

                                <button 
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-[#237127] hover:bg-[#1b5e1e] text-white py-5 rounded-[24px] font-bold flex items-center justify-center gap-3 shadow-lg shadow-green-900/10 transition-all hover:-translate-y-1 active:translate-y-0 mt-4 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <Upload size={20} />
                                            Publikasikan Kebutuhan
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>


                </div>
            </main>

            {/* Map Modal */}
            {showMapModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[32px] p-6 w-full max-w-3xl h-[80vh] shadow-2xl border border-gray-100 flex flex-col animate-in fade-in zoom-in duration-200">
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
                                    setFormData(prev => ({...prev, address}));
                                }} 
                                onClose={() => setShowMapModal(false)} 
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Custom icons to match the design
const Leaf = ({ size, className }: { size?: number, className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 8h-3" />
        <path d="M11 20c-1.2-1.3-3.2-1.2-4.5 0a1 1 0 0 0 1.5 1.5c1.3-1.2 1.3-3.2 0-4.5" />
    </svg>
);
