"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
    Home,
    User,
    PlusSquare,
    Edit3,
    Settings,
    LogOut,
    Bell,
    Search,
    Edit,
    XCircle,
    List,
    Loader2,
    CheckCircle2,
    X
} from "lucide-react";
import { GetManageListing } from "@/features/listing/get_manage_listing";
import { DeleteListingAction } from "@/features/listing/delete_listing";
import { UpdateListingAction } from "@/features/listing/update_listing";
import { BASE_URL } from "@/features/global/url";

export default function ActivePostsPage() {
    const [sidebarActive, setSidebarActive] = useState("Daftar Postingan");
    const [listings, setListings] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    
    // Delete state
    const [listingToDelete, setListingToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteStatus, setDeleteStatus] = useState<"idle" | "success" | "error">("idle");
    const [deleteError, setDeleteError] = useState<string | null>(null);

    // Edit state
    const [listingToEdit, setListingToEdit] = useState<any | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editStatus, setEditStatus] = useState<"idle" | "success" | "error">("idle");
    const [editError, setEditError] = useState<string | null>(null);
    const [editForm, setEditForm] = useState({
        title: "",
        min_volume: 0,
        price_buy: 0,
        quality: "",
        location: ""
    });

    const fetchListings = async () => {
        setIsLoading(true);
        try {
            const res = await GetManageListing();
            const data = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
            setListings(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchListings();
    }, []);

    const handleDeleteClick = (id: string) => {
        setListingToDelete(id);
        setDeleteStatus("idle");
        setDeleteError(null);
    };

    const executeDelete = async () => {
        if (!listingToDelete) return;
        
        setIsDeleting(true);
        setDeleteStatus("idle");
        setDeleteError(null);
        const res = await DeleteListingAction(listingToDelete);
        setIsDeleting(false);
        
        if (res.success) {
            setDeleteStatus("success");
            setTimeout(() => {
                setListingToDelete(null);
                setDeleteStatus("idle");
                fetchListings();
            }, 1500);
        } else {
            setDeleteStatus("error");
            setDeleteError(res.message || "Gagal menghapus postingan");
        }
    };

    const handleEditClick = (listing: any) => {
        setListingToEdit(listing);
        setEditForm({
            title: listing.title || "",
            min_volume: listing.min_volume || 0,
            price_buy: listing.price_buy || 0,
            quality: listing.quality || "",
            location: listing.location || ""
        });
        setEditStatus("idle");
        setEditError(null);
    };

    const executeEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!listingToEdit) return;

        setIsEditing(true);
        setEditStatus("idle");
        setEditError(null);

        const formData = new FormData();
        formData.append("title", editForm.title);
        formData.append("min_volume", editForm.min_volume.toString());
        formData.append("price_buy", editForm.price_buy.toString());
        formData.append("quality", editForm.quality);
        formData.append("location", editForm.location);

        const res = await UpdateListingAction(listingToEdit.id, formData);
        setIsEditing(false);

        if (res.success) {
            setEditStatus("success");
            setTimeout(() => {
                setListingToEdit(null);
                setEditStatus("idle");
                fetchListings();
            }, 1500);
        } else {
            setEditStatus("error");
            setEditError(res.message || "Gagal memperbarui postingan");
        }
    };

    const filteredListings = listings.filter((listing) => 
        listing.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatRupiah = (amount: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }).format(amount || 0);
    };

    const menuItems = [
        { name: "Beranda", icon: <Home size={20} />, active: false, href: "/home" },
        { name: "Profil", icon: <User size={20} />, active: false, href: "/profile" },
        { name: "Buat Postingan", icon: <PlusSquare size={20} />, active: false, href: "/create-post" },
        { name: "Daftar Postingan", icon: <Edit3 size={20} />, active: true, href: "/active-posts" },
    ];

    const bottomMenuItems = [
        { name: "Keluar", icon: <LogOut size={20} />, active: false, href: "/home" }, // Assuming /home or /login
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
                    {bottomMenuItems.map((item) => (
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
            <main className="flex-1 p-10 max-w-7xl mx-auto relative">
                {/* Header */}
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h2 className="text-4xl font-extrabold text-gray-900">Halo, Pengepul Berkah</h2>
                        <p className="text-gray-500 mt-2 font-medium">
                            Kelola stok dan postingan komoditas Anda hari ini.
                        </p>
                    </div>

                </header>

                {/* Table Section */}
                <div className="bg-[#F8F9F7] rounded-[40px] p-8 border border-gray-100 shadow-sm min-h-[600px]">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#237127] shadow-sm border border-gray-100">
                                <List size={24} />
                            </div>
                            <h3 className="text-2xl font-extrabold text-gray-900">Daftar Postingan Aktif</h3>
                        </div>
                        
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input 
                                type="text"
                                placeholder="Cari postingan..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-gray-200/50 border border-transparent rounded-2xl py-3 pl-12 pr-4 text-sm font-bold text-gray-700 focus:outline-none focus:bg-white focus:border-primary/30 transition-all shadow-inner"
                            />
                        </div>
                    </div>

                    <div className="w-full overflow-x-auto">
                        <table className="w-full text-left border-separate border-spacing-y-4">
                            <thead>
                                <tr className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                    <th className="px-6 pb-2">Komoditas</th>
                                    <th className="px-6 pb-2">Volume</th>
                                    <th className="px-6 pb-2">Harga Target</th>
                                    <th className="px-6 pb-2 text-center">Status</th>
                                    <th className="px-6 pb-2 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={5} className="text-center py-10">
                                            <Loader2 size={32} className="mx-auto animate-spin text-[#237127]" />
                                            <p className="mt-2 text-gray-500 font-medium">Memuat data...</p>
                                        </td>
                                    </tr>
                                ) : filteredListings.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center py-10 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                            <p className="text-gray-500 font-medium">Belum ada postingan aktif.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredListings.map((post) => (
                                        <tr key={post.id} className="group">
                                            <td className="bg-white px-6 py-4 rounded-l-[24px] border-y border-l border-gray-100 shadow-sm group-hover:shadow-md transition-shadow">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-16 rounded-2xl overflow-hidden border border-gray-100 flex-shrink-0 bg-gray-50">
                                                        {post.image_url ? (
                                                            <img 
                                                                src={`${BASE_URL}${post.image_url.startsWith('/') ? '' : '/'}${post.image_url}`} 
                                                                alt={post.title} 
                                                                className="w-full h-full object-cover" 
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-xs">IMG</div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-extrabold text-gray-900">{post.title}</h4>
                                                        <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">Lokasi: {post.location || post.address || "-"}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="bg-white px-6 py-4 border-y border-gray-100 shadow-sm group-hover:shadow-md transition-shadow">
                                                <span className="text-sm font-extrabold text-gray-900">{post.min_volume} Ton</span>
                                            </td>
                                            <td className="bg-white px-6 py-4 border-y border-gray-100 shadow-sm group-hover:shadow-md transition-shadow">
                                                <span className="text-sm font-extrabold text-[#237127]">{formatRupiah(post.price_buy)}/Kg</span>
                                            </td>
                                            <td className="bg-white px-6 py-4 border-y border-gray-100 shadow-sm group-hover:shadow-md transition-shadow text-center">
                                                <div className="inline-flex items-center gap-1.5 bg-green-50 text-[#237127] px-3 py-1 rounded-full border border-green-100">
                                                    <div className="w-1.5 h-1.5 bg-[#237127] rounded-full"></div>
                                                    <span className="text-[10px] font-bold uppercase tracking-wider">AKTIF</span>
                                                </div>
                                            </td>
                                            <td className="bg-white px-6 py-4 rounded-r-[24px] border-y border-r border-gray-100 shadow-sm group-hover:shadow-md transition-shadow text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => handleEditClick(post)} className="p-2.5 text-[#237127] hover:bg-[#237127]/5 rounded-xl transition-colors">
                                                        <Edit size={20} />
                                                    </button>
                                                    <button onClick={() => handleDeleteClick(post.id)} className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                                                        <XCircle size={20} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Delete Modal Confirmation */}
                {listingToDelete && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                        <div className="bg-white rounded-[24px] p-6 w-full max-w-sm shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-200 text-center">
                            
                            {deleteStatus === "success" ? (
                                <div className="py-6 animate-in zoom-in duration-300">
                                    <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle2 size={40} className="animate-bounce" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 font-plus-jakarta-sans mb-2">
                                        Berhasil!
                                    </h3>
                                    <p className="text-gray-500 font-medium">Postingan telah berhasil dihapus.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <XCircle size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        Hapus Postingan?
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-6">
                                        Tindakan ini tidak dapat dibatalkan. Postingan akan dihapus secara permanen.
                                    </p>

                                    {deleteStatus === "error" && deleteError && (
                                        <div className="mb-6 p-3 text-sm font-semibold bg-red-50 text-red-600 border border-red-100 rounded-xl text-left">
                                            Gagal: {deleteError}
                                        </div>
                                    )}

                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setListingToDelete(null);
                                                setDeleteStatus("idle");
                                            }}
                                            disabled={isDeleting}
                                            className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="button"
                                            onClick={executeDelete}
                                            disabled={isDeleting}
                                            className="flex-1 px-4 py-3 bg-red-600 text-white font-bold text-sm rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-red-600/20"
                                        >
                                            {isDeleting ? <Loader2 size={16} className="animate-spin" /> : "Ya, Hapus"}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* Edit Modal Confirmation */}
                {listingToEdit && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                        <div className="bg-white rounded-[32px] p-8 w-full max-w-md shadow-2xl border border-gray-100 relative animate-in fade-in zoom-in-95 duration-200">
                            <button 
                                onClick={() => setListingToEdit(null)}
                                className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={20} />
                            </button>
                            <h3 className="text-xl font-extrabold text-gray-900 mb-6">Edit Postingan</h3>
                            
                            {editStatus === 'success' ? (
                                <div className="py-6 text-center animate-in zoom-in duration-300">
                                    <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle2 size={40} className="animate-bounce" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                        Berhasil!
                                    </h3>
                                    <p className="text-gray-500 font-medium">Postingan telah berhasil diperbarui.</p>
                                </div>
                            ) : (
                                <form onSubmit={executeEdit}>
                                    {editStatus === 'error' && (
                                        <div className="p-4 mb-6 rounded-2xl text-sm font-bold border bg-red-50 text-red-600 border-red-100">
                                            {editError}
                                        </div>
                                    )}

                                    <div className="space-y-4 mb-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Judul Komoditas</label>
                                            <input
                                                type="text"
                                                value={editForm.title}
                                                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                                disabled={isEditing}
                                                required
                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 px-5 text-sm font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all font-body disabled:opacity-50"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Volume (Ton)</label>
                                                <input
                                                    type="number"
                                                    value={editForm.min_volume}
                                                    onChange={(e) => setEditForm({ ...editForm, min_volume: Number(e.target.value) })}
                                                    disabled={isEditing}
                                                    required
                                                    min="0"
                                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 px-5 text-sm font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all font-body disabled:opacity-50"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Harga Target (/Kg)</label>
                                                <input
                                                    type="number"
                                                    value={editForm.price_buy}
                                                    onChange={(e) => setEditForm({ ...editForm, price_buy: Number(e.target.value) })}
                                                    disabled={isEditing}
                                                    required
                                                    min="0"
                                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 px-5 text-sm font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all font-body disabled:opacity-50"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Lokasi</label>
                                            <input
                                                type="text"
                                                value={editForm.location}
                                                onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                                                disabled={isEditing}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 px-5 text-sm font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all font-body disabled:opacity-50"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-4">
                                        <button 
                                            type="button"
                                            onClick={() => setListingToEdit(null)}
                                            disabled={isEditing}
                                            className="flex-1 py-4 rounded-2xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
                                        >
                                            Batal
                                        </button>
                                        <button 
                                            type="submit"
                                            disabled={isEditing}
                                            className="flex-1 bg-[#113114] hover:bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-black/10 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70"
                                        >
                                            {isEditing ? <Loader2 size={18} className="animate-spin" /> : "Simpan Perubahan"}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
