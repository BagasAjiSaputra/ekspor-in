import React from "react";
import { FileText } from "lucide-react";
import { GetAllListings } from "@/features/listing/get_all_listings";
import { ListingTable } from "./components/ListingTable";
import Link from "next/link";

export default async function ListingsModerationDashboard() {
  const res = await GetAllListings();
  // Handle case where res might be an error or not an array
  const listings = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
  
  return (
    <div className="max-w-7xl mx-auto pb-10">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-plus-jakarta-sans tracking-tight">
          Moderasi Postingan
        </h1>
        <p className="text-gray-500 mt-2 text-[15px] max-w-3xl">
          Tinjau seluruh postingan komoditas yang dipublikasikan oleh para agregator. Pastikan kualitas konten sesuai dengan standar Eksporin.
        </p>
      </div>

      {/* Main Container */}
      <div className="bg-[#F6F7F6] rounded-[24px] p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <FileText className="text-green-700 h-6 w-6" />
            <h2 className="text-xl font-bold text-green-800 font-plus-jakarta-sans">
              Daftar Postingan
            </h2>
          </div>
          <span className="bg-green-700 text-white text-xs font-semibold px-3 py-1 rounded-full">
            {listings.length} Postingan
          </span>
        </div>

        {/* Tabel Postingan (Client Component) */}
        <ListingTable initialListings={listings} />
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
    </div>
  );
}
