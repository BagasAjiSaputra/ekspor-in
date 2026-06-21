"use client";

import React, { useState } from "react";
import { Edit2, Trash2, Plus, Loader2, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { CreateCommodity, UpdateCommodity, DeleteCommodity } from "@/features/commodity/manage_commodity";

export interface Commodity {
  id: string;
  name: string;
  category: string;
  usageCount?: number;
}

export function CommodityTable({ initialCommodities }: { initialCommodities: Commodity[] }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [selectedCommodity, setSelectedCommodity] = useState<Commodity | null>(null);
  
  const [formData, setFormData] = useState({ name: "", category: "Pertanian" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpenModal = (commodity?: Commodity) => {
    setError(null);
    if (commodity) {
      setSelectedCommodity(commodity);
      setFormData({ name: commodity.name, category: commodity.category || "Pertanian" });
    } else {
      setSelectedCommodity(null);
      setFormData({ name: "", category: "Pertanian" });
    }
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (commodity: Commodity) => {
    setSelectedCommodity(commodity);
    setError(null);
    setDeleteSuccess(false);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedCommodity(null);
    setError(null);
    setDeleteSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      let res;
      if (selectedCommodity) {
        res = await UpdateCommodity(selectedCommodity.id, formData.name, formData.category);
      } else {
        res = await CreateCommodity(formData.name, formData.category);
      }

      if (res.success) {
        setIsModalOpen(false);
        router.refresh();
      } else {
        setError(res.message || "Gagal menyimpan komoditas.");
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCommodity) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await DeleteCommodity(selectedCommodity.id);
      if (res.success) {
        setDeleteSuccess(true);
        setTimeout(() => {
          handleCloseDeleteModal();
          router.refresh();
        }, 1500);
      } else {
        setError(`Gagal: ${res.message}`);
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm"
        >
          <Plus size={16} />
          Tambah Komoditas
        </button>
      </div>

      <div className="bg-white rounded-[16px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">No</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Nama Komoditas</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Kategori</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Digunakan Oleh</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {initialCommodities.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-500">
                    Belum ada data komoditas.
                  </td>
                </tr>
              ) : (
                initialCommodities.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-500">{idx + 1}</td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-gray-900">{item.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                        {item.category || "Pertanian"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                        {item.usageCount || 0} Postingan
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(item)}
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleOpenDeleteModal(item)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus"
                        >
                          <Trash2 size={16} />
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

      {/* Modal Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-gray-100 animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6 font-plus-jakarta-sans">
              {selectedCommodity ? "Edit Komoditas" : "Tambah Komoditas Baru"}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-xs font-semibold bg-red-50 text-red-600 border border-red-100 rounded-xl">
                  {error}
                </div>
              )}
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Nama Komoditas</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Kopi Robusta"
                  disabled={isLoading}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Kategori</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  disabled={isLoading}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition-all appearance-none"
                >
                  <option value="Pertanian">Pertanian</option>
                  <option value="Kelautan">Kelautan</option>
                  <option value="Perkebunan">Perkebunan</option>
                  <option value="Peternakan">Peternakan</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 font-semibold text-sm rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-green-700 text-white font-semibold text-sm rounded-xl hover:bg-green-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isLoading && <Loader2 size={16} className="animate-spin" />}
                  {selectedCommodity ? "Simpan Perubahan" : "Tambahkan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Delete */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl border border-gray-100 animate-in fade-in zoom-in duration-200 text-center">
            
            {deleteSuccess ? (
              <div className="py-6 animate-in zoom-in duration-300">
                <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} className="animate-bounce" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 font-plus-jakarta-sans mb-2">
                  Berhasil!
                </h3>
                <p className="text-gray-500 font-medium">Komoditas telah berhasil dihapus.</p>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 font-plus-jakarta-sans">
                  Hapus Komoditas?
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Tindakan ini tidak dapat dibatalkan. Komoditas <span className="font-bold text-gray-700">{selectedCommodity?.name}</span> akan dihapus dari sistem.
                </p>

                {error && (
                  <div className="mb-6 p-3 text-sm font-semibold bg-red-50 text-red-600 border border-red-100 rounded-xl text-left">
                    {error}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleCloseDeleteModal}
                    disabled={isLoading}
                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-semibold text-sm rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isLoading}
                    className="flex-1 px-4 py-3 bg-red-600 text-white font-semibold text-sm rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-md shadow-red-600/20"
                  >
                    {isLoading && <Loader2 size={16} className="animate-spin" />}
                    Ya, Hapus
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
