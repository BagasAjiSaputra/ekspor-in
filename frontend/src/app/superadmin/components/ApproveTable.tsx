"use client";

import React, { useState, useTransition } from "react";
import { FileText, MapPin, Loader2 } from "lucide-react";
import { ApproveUserAction } from "@/features/superadmin/approve_user";
import { UserData } from "@/features/superadmin/get_users";
import { useRouter } from "next/navigation";

export function ApproveTable({ initialUsers }: { initialUsers: UserData[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredUsers = initialUsers.filter((u) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const name = (u.company_name || u.name || u.full_name || "").toLowerCase();
    const id = (u.id || "").toLowerCase();
    return name.includes(q) || id.includes(q);
  });

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const handleApprove = (userId: string, approve: boolean) => {
    startTransition(async () => {
      const res = await ApproveUserAction(userId, approve);
      if (res.success) {
        // Refresh the current route to fetch updated data from server
        router.refresh();
      } else {
        alert(res.message);
      }
    });
  };

  if (initialUsers.length === 0) {
    return (
      <div className="py-10 text-center text-gray-500">
        Belum ada agregator yang terdaftar.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex justify-end">
        <input
          type="text"
          placeholder="Cari nama atau ID..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full sm:w-64 px-4 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-700/20 focus:border-green-700 transition-all"
        />
      </div>

      <div className="overflow-x-auto relative">
        {isPending && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl">
            <Loader2 className="animate-spin text-green-700 h-8 w-8" />
          </div>
        )}
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-xs font-bold text-gray-400 tracking-wider border-b border-gray-200 uppercase">
            <th className="pb-4 font-semibold">Nama Agregator</th>
            <th className="pb-4 font-semibold">Wilayah Operasi</th>
            <th className="pb-4 font-semibold">Dokumen</th>
            <th className="pb-4 font-semibold">Status</th>
            <th className="pb-4 text-right font-semibold">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {paginatedUsers.length === 0 ? (
            <tr>
              <td colSpan={4} className="py-10 text-center text-gray-500">
                Pencarian tidak ditemukan.
              </td>
            </tr>
          ) : (
            paginatedUsers.map((user, i) => {
              const status = user.is_verified || "none";
              
              return (
              <tr key={user.id || i} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-5">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-xl bg-green-200 text-green-700 flex items-center justify-center font-bold text-sm uppercase">
                      {(user.company_name || user.name || user.full_name || "PT").substring(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        {user.company_name || user.name || user.full_name || "Perusahaan"}
                      </p>
                      <p className="text-xs text-gray-500">
                        ID: {user.id?.substring(0, 8)}...
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-5">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-1.5 text-gray-400" />
                    <span>
                      {user.location || "Lokasi Belum Diisi"}
                    </span>
                  </div>
                </td>
                <td className="py-5">
                  {user.document_url ? (
                    <a href={user.document_url} target="_blank" rel="noreferrer" className="flex items-center text-sm font-semibold text-green-700 cursor-pointer hover:underline">
                      <FileText className="h-4 w-4 mr-1.5" />
                      Lihat Dokumen
                    </a>
                  ) : (
                    <span className="text-xs text-gray-400 italic">Tidak ada dokumen</span>
                  )}
                </td>
                <td className="py-5">
                  <div className="flex flex-col gap-1">
                    {status === "verified" && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 w-fit">
                        Verified
                      </span>
                    )}
                    {status === "pending" && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 w-fit">
                        Menunggu
                      </span>
                    )}
                    {status === "none" && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 w-fit">
                        User Biasa
                      </span>
                    )}
                    {status === "rejected" && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 w-fit">
                        Ditolak
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-5 text-right">
                  {status === "pending" ? (
                    <div className="flex flex-col items-end space-y-2">
                      <button 
                        onClick={() => handleApprove(user.id, true)}
                        disabled={isPending}
                        className="bg-green-700 hover:bg-green-800 text-white text-xs font-bold py-1.5 px-4 rounded-lg transition-colors w-20 text-center disabled:opacity-50"
                      >
                        Setujui
                      </button>
                      <button 
                        onClick={() => handleApprove(user.id, false)}
                        disabled={isPending}
                        className="bg-red-100 hover:bg-red-200 text-red-600 text-xs font-bold py-1.5 px-4 rounded-lg transition-colors w-20 text-center disabled:opacity-50"
                      >
                        Tolak
                      </button>
                    </div>
                  ) : status === "verified" ? (
                    <span className="text-xs font-semibold text-green-700 pr-2">Disetujui</span>
                  ) : status === "rejected" ? (
                    <span className="text-xs font-semibold text-red-600 pr-2">Ditolak</span>
                  ) : (
                    <span className="text-xs font-semibold text-gray-400 pr-2 italic">Belum Mengajukan</span>
                  )}
                </td>
              </tr>
            )})
          )}
        </tbody>
      </table>
    </div>
      
      {/* Pagination Controls */}
      {filteredUsers.length > 0 && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Menampilkan {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredUsers.length)} dari {filteredUsers.length}
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-xs font-semibold border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Sebelumnya
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-xs font-semibold border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
