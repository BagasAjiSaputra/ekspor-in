"use client";

import React, { useState } from "react";
import { Eye, Trash2, Ban, Search, Loader2, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { BASE_URL } from "@/features/global/url";
import { DeleteListingAction } from "@/features/listing/delete_listing";

interface Listing {
  id: string;
  title: string;
  description: string;
  min_volume: number;
  quality: string;
  price_buy: number;
  location: string;
  image_url?: string;
  status?: string;
  company_id?: string;
  commodity_id?: string;
  created_at?: string;
}

export function ListingTable({ initialListings }: { initialListings: Listing[] }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [listingToDelete, setListingToDelete] = useState<string | null>(null);
  const [deleteStatus, setDeleteStatus] = useState<"idle" | "success" | "error">("idle");
  const [deleteError, setDeleteError] = useState<string | null>(null);

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
        setIsModalOpen(false);
        setListingToDelete(null);
        setDeleteStatus("idle");
        router.refresh();
      }, 1500);
    } else {
      setDeleteStatus("error");
      setDeleteError(res.message || "Gagal menghapus postingan");
    }
  };

  const filteredListings = initialListings.filter((listing) => 
    listing.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDetail = (listing: Listing) => {
    setSelectedListing(listing);
    setIsModalOpen(true);
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
            placeholder="Cari judul postingan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-[16px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Info Postingan</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Volume & Harga</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Lokasi</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredListings.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-500">
                    Belum ada data postingan atau tidak ditemukan.
                  </td>
                </tr>
              ) : (
                filteredListings.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {item.image_url ? (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden relative border border-gray-200">
                            <img src={`/api-proxy${item.image_url.startsWith('/') ? '' : '/'}${item.image_url}`} alt={item.title} className="object-cover w-full h-full" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center border border-green-100 text-green-600 font-bold text-xs">
                            IMG
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-bold text-gray-900">{item.title}</p>
                          <p className="text-[11px] font-semibold text-gray-400 mt-0.5 truncate max-w-[200px]">{item.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900">{item.min_volume} Ton</p>
                      <p className="text-[11px] font-bold text-green-600 mt-0.5">{formatRupiah(item.price_buy)} / Kg</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-700">{item.location}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenDetail(item)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Lihat Detail"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(item.id)}
                          disabled={isDeleting}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Hapus / Ban Postingan"
                        >
                          <Ban size={16} />
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

      {/* Modal Detail Postingan */}
      {isModalOpen && selectedListing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] p-6 w-full max-w-lg shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 font-plus-jakarta-sans">
                Detail Postingan
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              {selectedListing.image_url && (
                <div className="w-full h-48 bg-gray-100 rounded-xl overflow-hidden relative border border-gray-200">
                  <img src={`/api-proxy${selectedListing.image_url.startsWith('/') ? '' : '/'}${selectedListing.image_url}`} alt="Foto Komoditas" className="object-cover w-full h-full" />
                </div>
              )}

              <div>
                <h4 className="text-lg font-bold text-gray-900">{selectedListing.title}</h4>
                <p className="text-sm font-medium text-gray-500 mt-1">{selectedListing.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Volume Min</p>
                  <p className="text-sm font-bold text-gray-900 mt-1">{selectedListing.min_volume} Ton</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Harga Target</p>
                  <p className="text-sm font-bold text-green-700 mt-1">{formatRupiah(selectedListing.price_buy)} / Kg</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Kualitas</p>
                  <p className="text-sm font-bold text-gray-900 mt-1">{selectedListing.quality || "-"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Lokasi</p>
                  <p className="text-sm font-bold text-gray-900 mt-1 truncate">{selectedListing.location}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
               <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteClick(selectedListing.id)}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-3 bg-red-50 text-red-600 font-bold text-sm rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Ban size={16} /> 
                  Banned Post
                </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
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
                  <Ban size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 font-plus-jakarta-sans mb-2">
                  Hapus Postingan?
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Tindakan ini tidak dapat dibatalkan. Postingan akan dihapus secara permanen dari sistem.
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
    </div>
  );
}
