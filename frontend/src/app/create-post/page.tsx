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
    });
    const [commodities, setCommodities] = useState<any[]>([]);
    const [companyId, setCompanyId] = useState<string>("");
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{type: "success" | "error" | null, text: string}>({type: null, text: ""});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [company, commodityList, profile] = await Promise.all([
                    GetCompany(),
                    GetAllCommodity(),
                    GetProfile()
                ]);
                
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
        { name: "Edit Aktif", icon: <Edit3 size={20} />, active: false, href: "/active-posts" },
    ];

    const bottomMenuItems = [
        { name: "Pengaturan", icon: <Settings size={20} />, active: false, href: "#" },
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
                    <div className="flex items-center gap-4">
                        <button className="p-3 bg-white border border-gray-100 rounded-2xl shadow-sm text-gray-400 hover:text-primary transition-colors">
                            <Bell size={20} />
                        </button>
                        <div className="w-12 h-12 bg-[#B8E5B3] rounded-2xl flex items-center justify-center text-[#237127] shadow-sm overflow-hidden">
                             <User size={24} />
                        </div>
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
                                        <div className="relative group">
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

                    {/* Sidebar Stats */}
                    <div className="w-full lg:w-80 space-y-6">
                        {/* Storage Capacity Card */}
                        <div className="bg-[#114B1F] rounded-[32px] p-8 text-white relative overflow-hidden">
                            <div className="relative z-10">
                                <h4 className="text-xs font-bold text-white/60 uppercase tracking-widest mb-4">Kapasitas Gudang Terpakai</h4>
                                <div className="text-5xl font-extrabold mb-6 tracking-tight">84.5%</div>
                                
                                <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden mb-4">
                                    <div className="w-[84.5%] h-full bg-white rounded-full"></div>
                                </div>
                                
                                <p className="text-[11px] text-white/50 font-medium">
                                    15.5 Ton tersisa dari total 100 Ton
                                </p>
                            </div>
                            
                            {/* Decorative Icon */}
                            <div className="absolute bottom-[-20px] right-[-20px] opacity-10">
                                <Home size={140} strokeWidth={1} />
                            </div>
                        </div>

                        {/* Active Summary Card */}
                        <div className="bg-[#EBEEE8] rounded-[32px] p-8 border border-gray-100">
                            <h4 className="text-sm font-extrabold text-gray-900 mb-6">Ringkasan Aktif</h4>
                            
                            <div className="space-y-4">
                                <div className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm">
                                    <div className="w-10 h-10 bg-[#B8E5B3] rounded-xl flex items-center justify-center text-[#237127]">
                                        <Leaf size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <h5 className="text-xs font-extrabold text-gray-900">Padi Ciherang</h5>
                                            <span className="text-[9px] font-bold px-2 py-0.5 bg-[#E6F4E8] text-[#237127] rounded-md uppercase tracking-tighter">Aktif</span>
                                        </div>
                                        <p className="text-[10px] font-bold text-gray-400 mt-0.5">5.0 Ton</p>
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm">
                                    <div className="w-10 h-10 bg-[#FFEED9] rounded-xl flex items-center justify-center text-[#E69138]">
                                        <PlusSquare size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <h5 className="text-xs font-extrabold text-gray-900">Jagung Pipil</h5>
                                            <span className="text-[9px] font-bold px-2 py-0.5 bg-[#FFF3E0] text-[#E69138] rounded-md uppercase tracking-tighter">Diproses</span>
                                        </div>
                                        <p className="text-[10px] font-bold text-gray-400 mt-0.5">12.2 Ton</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
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
