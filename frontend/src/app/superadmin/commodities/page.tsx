import React from "react";
import { Package } from "lucide-react";
import { GetAllCommodity } from "@/features/commodity/get_all_commodity";
import { CommodityTable } from "./components/CommodityTable";
import Link from "next/link";

export default async function CommoditiesDashboard() {
  const res = await GetAllCommodity();
  // Handle case where res might be an error or not an array
  const commodities = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
  
  return (
    <div className="max-w-7xl mx-auto pb-10">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-plus-jakarta-sans tracking-tight">
          Master Komoditas
        </h1>
        <p className="text-gray-500 mt-2 text-[15px] max-w-3xl">
          Kelola daftar komoditas yang tersedia di platform Eksporin. Tambah, edit, atau hapus kategori komoditas pertanian dan kelautan.
        </p>
      </div>

      {/* Main Container */}
      <div className="bg-[#F6F7F6] rounded-[24px] p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Package className="text-green-700 h-6 w-6" />
            <h2 className="text-xl font-bold text-green-800 font-plus-jakarta-sans">
              Daftar Komoditas
            </h2>
          </div>
          <span className="bg-green-700 text-white text-xs font-semibold px-3 py-1 rounded-full">
            {commodities.length} Komoditas
          </span>
        </div>

        {/* Tabel Komoditas (Client Component) */}
        <CommodityTable initialCommodities={commodities} />
      </div>

      {/* Footer Area */}
      <footer className="mt-8 bg-[#F6F7F6] rounded-[24px] p-8 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="max-w-xs mb-6 md:mb-0">
          <h2 className="text-xl font-bold text-green-800 font-plus-jakarta-sans mb-2">Eksporin</h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-4">
            Memberdayakan Petani Indonesia melalui transparansi data dan akses pasar yang lebih luas.
          </p>
          <p className="text-xs text-gray-400">
            &copy; 2026 Eksporin. Memberdayakan Petani Indonesia.
          </p>
        </div>
        
        <div className="flex space-x-16">
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-green-900 mb-4">Navigasi</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-sm text-gray-500 hover:text-green-700 transition-colors">Tentang Kami</Link></li>
              <li><Link href="#" className="text-sm text-gray-500 hover:text-green-700 transition-colors">Pusat Bantuan</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-green-900 mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-sm text-gray-500 hover:text-green-700 transition-colors">Privasi</Link></li>
              <li><Link href="#" className="text-sm text-gray-500 hover:text-green-700 transition-colors">Syarat & Ketentuan</Link></li>
            </ul>
          </div>
        </div>
      </footer>

      {/* Chat Bubble Icon - Fixed Bottom Right */}
      <div className="fixed bottom-8 right-8 z-50">
        <button className="h-14 w-14 rounded-full bg-white text-green-700 shadow-lg border border-gray-100 flex items-center justify-center hover:scale-105 transition-transform hover:shadow-xl">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/><path d="M8 12h.01"/><path d="M12 12h.01"/><path d="M16 12h.01"/></svg>
        </button>
      </div>
    </div>
  );
}
