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
    Camera,
    CheckCircle,
    Shield,
    Mail,
    Phone,
    Save,
    X,
    Building2,
    Loader2,
    MapPin
} from "lucide-react";
import dynamic from "next/dynamic";
import { authService } from "@/services/auth";
import { GetProfile } from "@/features/auth/get_profile";
import { UpdateProfile } from "@/features/auth/update_profile";
import { UploadProfileImage } from "@/features/auth/upload_profile_image";
import { VerifyRole } from "@/features/auth/role_verified";
import { Logout } from "@/features/auth/logout";
import { BASE_URL } from "@/features/global/url";
import { GetCompany } from "@/features/company/get_company";
import { UpdateCompany } from "@/features/company/update_company";

const MapPicker = dynamic(() => import("@/app/create-post/components/Map"), { ssr: false });
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const router = useRouter();
    const [sidebarActive, setSidebarActive] = useState("Profil");
    const [profileData, setProfileData] = useState<any>(null);
    const [companyData, setCompanyData] = useState<any>(null);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', user_image: '' });
    const [companyFormData, setCompanyFormData] = useState({ company_name: '', phone: '', address: '' });
    const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isUpdatingCompany, setIsUpdatingCompany] = useState(false);
    const [updateMessage, setUpdateMessage] = useState({ type: '', text: '' });
    const [updateCompanyMessage, setUpdateCompanyMessage] = useState({ type: '', text: '' });
    const [error, setError] = useState<string | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showEditCompanyModal, setShowEditCompanyModal] = useState(false);
    const [isApplying, setIsApplying] = useState(false);
    const [showMapModal, setShowMapModal] = useState(false);

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

    React.useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await GetProfile();
                // Assuming the API returns the user object directly, or in a specific key.
                // We'll set the whole response for now.
                const user = data.user || data;
                setProfileData(user);
                setFormData({ 
                    name: user.name || '', 
                    email: user.email || '',
                    password: '',
                    user_image: user.photo_url || user.image || user.user_image || ''
                });

                // Fetch Company Data
                try {
                    const company = await GetCompany();
                    if (company && !company.error) {
                        setCompanyData(company);
                        setCompanyFormData({
                            company_name: company.company_name || '',
                            phone: company.phone || '',
                            address: company.address || ''
                        });
                    }
                } catch (e) {
                    console.error("No company found", e);
                }

            } catch (err: any) {
                setError(err.message || "Gagal memuat profil");
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleUpdateProfile = async () => {
        setIsUpdating(true);
        setUpdateMessage({ type: '', text: '' });
        try {
            // Siapkan payload JSON untuk update profile sesuai Postman
            const payload: any = {
                name: formData.name,
                email: formData.email,
            };
            
            if (formData.password) {
                payload.password = formData.password;
            }
            
            if (formData.user_image) {
                payload.user_image = formData.user_image;
            }
            
            const res = await UpdateProfile(payload);
            if (res && res.error) {
                throw new Error(res.error);
            }
            
            setUpdateMessage({ type: 'success', text: 'Profil berhasil diperbarui!' });
            setProfileData((prev: any) => ({ ...prev, name: formData.name, email: formData.email, photo_url: formData.user_image, user_image: formData.user_image }));
            
            // Simpan path foto baru ke localStorage agar Navbar bisa langsung mendeteksinya jika ada caching
            if (formData.user_image) {
                localStorage.setItem("profile_picture", formData.user_image);
            }

            setTimeout(() => {
                setShowEditModal(false);
                setUpdateMessage({ type: '', text: '' });
                setFormData(prev => ({ ...prev, password: '' })); // reset password field
                window.location.reload(); // Paksa refresh seluruh state UI termasuk Navbar
            }, 1500);
        } catch (err: any) {
            setUpdateMessage({ type: 'error', text: err.message || 'Gagal memperbarui profil.' });
        } finally {
            setIsUpdating(false);
        }
    };

    const handleUpdateCompany = async () => {
        setIsUpdatingCompany(true);
        setUpdateCompanyMessage({ type: '', text: '' });
        try {
            const payload = {
                company_name: companyFormData.company_name,
                phone: companyFormData.phone,
                address: companyFormData.address,
            };
            
            const res = await UpdateCompany(payload);
            if (res && res.error) {
                throw new Error(res.error);
            }
            
            setUpdateCompanyMessage({ type: 'success', text: 'Perusahaan berhasil diperbarui!' });
            setCompanyData((prev: any) => ({ ...prev, ...payload }));
            setTimeout(() => {
                setShowEditCompanyModal(false);
                setUpdateCompanyMessage({ type: '', text: '' });
            }, 1500);
        } catch (err: any) {
            setUpdateCompanyMessage({ type: 'error', text: err.message || 'Gagal memperbarui perusahaan.' });
        } finally {
            setIsUpdatingCompany(false);
        }
    };

    const [isUploadingImage, setIsUploadingImage] = useState(false);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsUploadingImage(true);
            // Preview lokal sementara
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setProfileImagePreview(base64String);
            };
            reader.readAsDataURL(file);
            
            // Langsung upload ke endpoint /api/profile/upload
            try {
                const fd = new FormData();
                fd.append("image", file);
                const uploadRes = await UploadProfileImage(fd);
                
                if (!uploadRes.error && uploadRes.data) {
                    const resData = uploadRes.data;
                    // Ambil path image dari response (biasanya image_url, url, path, user_image)
                    const path = resData.url || resData.image_url || resData.path || resData.user_image || resData.data?.url || resData.data?.image_url;
                    
                    if (path) {
                        setFormData(prev => ({ ...prev, user_image: path }));
                        
                        // Lakukan auto-update profil tanpa harus klik simpan lagi
                        try {
                            const payload: any = {
                                name: profileData?.name || "",
                                email: profileData?.email || "",
                                user_image: path
                            };
                            const resUpdate = await UpdateProfile(payload);
                            
                            if (resUpdate?.error) {
                                alert("Pembaruan ditolak oleh server: " + resUpdate.error);
                                setProfileImagePreview(null);
                            } else {
                                setProfileData((prev: any) => ({ ...prev, user_image: path, photo_url: path }));
                                localStorage.setItem("profile_picture", path);
                                
                                // Beritahu komponen lain (seperti Navbar) untuk update gambar tanpa reload
                                window.dispatchEvent(new Event("profile_picture_updated"));
                            }
                        } catch (updateErr: any) {
                            console.error("Gagal auto-update profil:", updateErr);
                            alert("Terjadi kesalahan saat menyimpan foto profil.");
                            setProfileImagePreview(null);
                        }
                    }
                } else {
                    console.error("Gagal upload gambar:", uploadRes.error);
                    alert("Gagal mengunggah gambar ke server.");
                    setProfileImagePreview(null);
                }
            } catch (err) {
                console.error("Error upload:", err);
                setProfileImagePreview(null);
            } finally {
                setIsUploadingImage(false);
            }
        }
    };

    const handleApplyVerification = async () => {
        setIsApplying(true);
        try {
            const res = await VerifyRole();
            if (res && res.error) {
                alert(res.error);
            } else {
                alert("Pengajuan verifikasi berhasil dikirim! Silakan tunggu persetujuan Superadmin.");
                setProfileData((prev: any) => ({ ...prev, is_verified: "pending" }));
            }
        } catch (err: any) {
            alert("Gagal mengajukan verifikasi: " + err.message);
        } finally {
            setIsApplying(false);
        }
    };

    const menuItems = [
        { name: "Beranda", icon: <Home size={20} />, active: false, href: "/home" },
        { name: "Profil", icon: <User size={20} />, active: true, href: "/profile" },
        { name: "Buat Postingan", icon: <PlusSquare size={20} />, active: false, href: "/create-post" },
        { name: "Daftar Postingan", icon: <Edit3 size={20} />, active: false, href: "/active-posts" },
    ];

    const bottomMenuItems = [
        { name: "Keluar", icon: <LogOut size={20} />, active: false },
    ];

    return (
        <div className="min-h-screen bg-[#FDFDFD] flex font-body">
            {/* Edit Modal */}
            {showEditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
                    <div className="bg-white rounded-[32px] p-8 w-full max-w-md shadow-2xl border border-gray-100 relative animate-in fade-in zoom-in-95 duration-200">
                        <button 
                            onClick={() => setShowEditModal(false)}
                            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={20} />
                        </button>
                        <h3 className="text-xl font-extrabold text-gray-900 mb-6">Edit Profil</h3>
                        
                        {updateMessage.text && (
                            <div className={`p-4 mb-6 rounded-2xl text-sm font-bold border ${updateMessage.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                                {updateMessage.text}
                            </div>
                        )}

                        <div className="space-y-4 mb-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    disabled={isUpdating}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 px-5 text-sm font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all font-body disabled:opacity-50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    disabled={isUpdating}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 px-5 text-sm font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all font-body disabled:opacity-50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Password Baru (Kosongkan jika tidak diubah)</label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    disabled={isUpdating}
                                    placeholder="••••••••"
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 px-5 text-sm font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all font-body disabled:opacity-50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Path Image (Auto-fill saat upload foto)</label>
                                <input
                                    type="text"
                                    value={formData.user_image}
                                    onChange={(e) => setFormData({ ...formData, user_image: e.target.value })}
                                    disabled={isUpdating}
                                    placeholder="/uploads/..."
                                    readOnly
                                    className="w-full bg-gray-100 border border-gray-200 rounded-2xl py-3.5 px-5 text-sm font-medium text-gray-500 focus:outline-none font-body cursor-not-allowed"
                                />
                            </div>
                        </div>
                        
                        <div className="flex gap-4">
                            <button 
                                onClick={() => setShowEditModal(false)}
                                disabled={isUpdating}
                                className="flex-1 py-4 rounded-2xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
                            >
                                Batal
                            </button>
                            <button 
                                onClick={handleUpdateProfile}
                                disabled={isUpdating}
                                className="flex-1 bg-[#113114] hover:bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-black/10 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70"
                            >
                                {isUpdating ? "Menyimpan..." : "Simpan"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Company Modal */}
            {showEditCompanyModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
                    <div className="bg-white rounded-[32px] p-8 w-full max-w-md shadow-2xl border border-gray-100 relative animate-in fade-in zoom-in-95 duration-200">
                        <button 
                            onClick={() => setShowEditCompanyModal(false)}
                            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={20} />
                        </button>
                        <h3 className="text-xl font-extrabold text-gray-900 mb-6">Edit Perusahaan</h3>
                        
                        {updateCompanyMessage.text && (
                            <div className={`p-4 mb-6 rounded-2xl text-sm font-bold border ${updateCompanyMessage.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                                {updateCompanyMessage.text}
                            </div>
                        )}

                        <div className="space-y-4 mb-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Nama Perusahaan</label>
                                <input
                                    type="text"
                                    value={companyFormData.company_name}
                                    onChange={(e) => setCompanyFormData({ ...companyFormData, company_name: e.target.value })}
                                    disabled={isUpdatingCompany}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 px-5 text-sm font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all font-body disabled:opacity-50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Nomor Telepon</label>
                                <input
                                    type="text"
                                    value={companyFormData.phone}
                                    onChange={(e) => setCompanyFormData({ ...companyFormData, phone: e.target.value })}
                                    disabled={isUpdatingCompany}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 px-5 text-sm font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all font-body disabled:opacity-50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Alamat Gudang Utama</label>
                                <div className="flex gap-3 items-start">
                                    <div className="relative group flex-1">
                                        <div className="absolute left-4 top-3.5 text-[#237127]">
                                            <MapPin size={20} />
                                        </div>
                                        <textarea
                                            rows={3}
                                            value={companyFormData.address}
                                            onChange={(e) => setCompanyFormData({ ...companyFormData, address: e.target.value })}
                                            disabled={isUpdatingCompany}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 pl-12 pr-5 text-sm font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all resize-none font-body disabled:opacity-50"
                                        ></textarea>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowMapModal(true)}
                                        className="bg-[#237127] hover:bg-[#1b5e1e] text-white px-5 rounded-2xl font-bold flex items-center gap-2 transition-colors shadow-sm whitespace-nowrap py-3.5"
                                    >
                                        <MapPin size={18} />
                                        Peta
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex gap-4">
                            <button 
                                onClick={() => setShowEditCompanyModal(false)}
                                disabled={isUpdatingCompany}
                                className="flex-1 py-4 rounded-2xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
                            >
                                Batal
                            </button>
                            <button 
                                onClick={handleUpdateCompany}
                                disabled={isUpdatingCompany}
                                className="flex-1 bg-[#113114] hover:bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-black/10 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70"
                            >
                                {isUpdatingCompany ? "Menyimpan..." : "Simpan"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
                    {bottomMenuItems.map((item) => (
                        <button
                            key={item.name}
                            onClick={item.name === "Keluar" ? handleLogout : undefined}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-all"
                        >
                            <span className="text-gray-400">{item.icon}</span>
                            {item.name}
                        </button>
                    ))}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-8 max-w-7xl">
                <header className="mb-6">
                    <h2 className="text-3xl font-extrabold text-gray-900">Profil Pengepul</h2>
                    <p className="text-gray-500 mt-2 font-medium text-sm">
                        Kelola identitas bisnis dan informasi kontak Anda untuk meningkatkan kepercayaan petani.
                    </p>
                </header>

                <div className="flex gap-6">
                    {/* Left Column: Profile Card & Security */}
                    <div className="w-80 space-y-4">
                        {/* Profile Card */}
                        <div className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm flex flex-col items-center">
                            <div className="relative mb-4 group">
                                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg relative">
                                    <img
                                        src={profileImagePreview || (
                                            (profileData?.user_image || profileData?.photo_url)
                                                ? ((profileData?.user_image || profileData?.photo_url).startsWith('http')
                                                    ? (profileData?.user_image || profileData?.photo_url)
                                                    : `/api-proxy${(profileData?.user_image || profileData?.photo_url).startsWith('/') ? '' : '/'}${profileData?.user_image || profileData?.photo_url}`)
                                                : `https://avatar.vercel.sh/${profileData?.name?.replace(/\s+/g, '-') || 'user'}?size=128`
                                        )}
                                        alt="Avatar"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className={`absolute inset-0 flex items-center justify-center transition-opacity cursor-pointer ${isUploadingImage ? 'bg-black/50 opacity-100' : 'bg-black/40 opacity-0 group-hover:opacity-100'}`}>
                                        {isUploadingImage ? (
                                            <Loader2 className="text-white animate-spin" size={28} />
                                        ) : (
                                            <Camera className="text-white" size={24} />
                                        )}
                                    </div>
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        disabled={isUploadingImage}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        onChange={handleImageChange}
                                        title="Ganti Foto Profil"
                                    />
                                </div>
                                <label className="absolute bottom-1 right-1 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-primary-dark transition-colors border-2 border-white cursor-pointer z-10 pointer-events-none">
                                    <Camera size={16} />
                                </label>
                            </div>

                            {profileData?.is_verified === "verified" ? (
                                <div className="flex items-center gap-1.5 bg-green-100 text-[#237127] px-3 py-1 rounded-full mb-4">
                                    <CheckCircle size={14} />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Terverifikasi</span>
                                </div>
                            ) : profileData?.is_verified === "pending" ? (
                                <div className="flex items-center gap-1.5 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full mb-4">
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Menunggu Persetujuan</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1.5 bg-gray-100 text-gray-600 px-3 py-1 rounded-full mb-4">
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Belum Verifikasi</span>
                                </div>
                            )}

                            <h3 className="text-xl font-extrabold text-gray-900 text-center">
                                {isLoading ? "Memuat..." : profileData?.name || "Nama Tidak Tersedia"}
                            </h3>
                            <p className="text-gray-400 text-sm mt-1">
                                {profileData?.created_at 
                                    ? `Bergabung sejak ${new Date(profileData.created_at).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}` 
                                    : "Bergabung sejak saat ini"}
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Update Forms */}
                    <div className="flex-1 bg-white rounded-[32px] p-6 md:p-8 border border-gray-100 shadow-sm">
                        {/* Business Info Section */}
                        <section className="mb-6">
                            <h3 className="text-lg font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                                Informasi Bisnis
                                <div className="h-[1px] flex-1 bg-gray-100 ml-2"></div>
                            </h3>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Nama Perusahaan / Pengepul</label>
                                    <input
                                        type="text"
                                        placeholder="Agro Jaya Mandiri"
                                        value={companyData?.company_name || profileData?.name || ""}
                                        readOnly
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 px-5 text-sm font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all font-body cursor-default"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">ID Pengepul</label>
                                    <input
                                        type="text"
                                        readOnly
                                        value={companyData?.id || "Belum terdaftar"}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 px-5 text-sm font-bold text-gray-400 focus:outline-none cursor-not-allowed font-body"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Alamat Gudang Utama</label>
                                <textarea
                                    rows={2}
                                    value={companyData?.address || profileData?.address || ""}
                                    readOnly
                                    placeholder="Jl. Raya Pertanian No. 42, Pangalengan, Kabupaten Bandung, Jawa Barat 40378"
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 text-sm font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all resize-none font-body cursor-default"
                                ></textarea>
                            </div>
                        </section>

                        {/* Personal Contact Section */}
                        <section className="mb-0">
                            <h3 className="text-lg font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                                Kontak Personal
                                <div className="h-[1px] flex-1 bg-gray-100 ml-2"></div>
                            </h3>

                            <div className="grid grid-cols-2 gap-4 items-end">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Bisnis</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                                            <Mail size={18} />
                                        </div>
                                        <input
                                            type="email"
                                            value={profileData?.email || ""}
                                            readOnly
                                            placeholder="contact@agrojaya.com"
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 pl-12 pr-5 text-sm font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all font-body cursor-default"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center justify-end gap-3 mb-1">
                                    {!companyData ? (
                                        <Link 
                                            href="/company/register"
                                            className="bg-white border-2 border-[#113114] text-[#113114] hover:bg-gray-50 px-6 py-3.5 rounded-2xl font-bold flex items-center gap-2 transition-all hover:-translate-y-0.5 active:translate-y-0"
                                        >
                                            <Building2 size={18} />
                                            Daftarkan Perusahaan
                                        </Link>
                                    ) : (
                                        <button 
                                            onClick={() => setShowEditCompanyModal(true)}
                                            className="bg-white border-2 border-[#113114] text-[#113114] hover:bg-gray-50 px-6 py-3.5 rounded-2xl font-bold flex items-center gap-2 transition-all hover:-translate-y-0.5 active:translate-y-0"
                                        >
                                            <Building2 size={18} />
                                            Update Perusahaan
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => setShowEditModal(true)}
                                        className="bg-[#113114] hover:bg-black text-white px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-black/10 transition-all hover:-translate-y-0.5 active:translate-y-0"
                                    >
                                        <Edit3 size={18} />
                                        Update Profil
                                    </button>
                                </div>
                            </div>
                        </section>
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
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-hidden">
                            <MapPicker 
                                onLocationSelect={(address) => {
                                    setCompanyFormData(prev => ({...prev, address}));
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
