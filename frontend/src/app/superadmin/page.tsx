import React from "react";
import {
  ClipboardCheck,
  MapPin,
  FileText,
  History,
  TrendingUp,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function SuperadminDashboard() {
  return (
    <div className="max-w-7xl mx-auto pb-10">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-plus-jakarta-sans tracking-tight">
          Verifikasi Agregator Baru
        </h1>
        <p className="text-gray-500 mt-2 text-[15px] max-w-3xl">
          Kelola pendaftaran mitra pengepul dan tinjau kelayakan operasional mereka sebelum
          diizinkan mengakses pasar digital.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Menunggu Persetujuan */}
        <div className="lg:col-span-2 bg-[#F6F7F6] rounded-[24px] p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <ClipboardCheck className="text-green-700 h-6 w-6" />
              <h2 className="text-xl font-bold text-green-800 font-plus-jakarta-sans">
                Menunggu Persetujuan
              </h2>
            </div>
            <span className="bg-green-700 text-white text-xs font-semibold px-3 py-1 rounded-full">
              12 Permintaan
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs font-bold text-gray-400 tracking-wider border-b border-gray-200 uppercase">
                  <th className="pb-4 font-semibold">Nama Agregator</th>
                  <th className="pb-4 font-semibold">Wilayah Operasi</th>
                  <th className="pb-4 font-semibold">Dokumen</th>
                  <th className="pb-4 text-right font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {/* Row 1 */}
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-5">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-xl bg-green-200 text-green-700 flex items-center justify-center font-bold text-sm">
                        PT
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">Tani Maju Mandiri</p>
                        <p className="text-xs text-gray-500">Daftar: 2 jam yang lalu</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-1.5 text-gray-400" />
                      <span>
                        Malang,<br />
                        <span className="font-semibold text-gray-800">Jawa Timur</span>
                      </span>
                    </div>
                  </td>
                  <td className="py-5">
                    <div className="flex items-center text-sm font-semibold text-green-700 cursor-pointer hover:underline">
                      <FileText className="h-4 w-4 mr-1.5" />
                      SIUP_2024.pdf
                    </div>
                  </td>
                  <td className="py-5 text-right">
                    <div className="flex flex-col items-end space-y-2">
                      <button className="bg-green-700 hover:bg-green-800 text-white text-xs font-bold py-1.5 px-4 rounded-lg transition-colors w-20 text-center">
                        Setujui
                      </button>
                      <button className="bg-red-100 hover:bg-red-200 text-red-600 text-xs font-bold py-1.5 px-4 rounded-lg transition-colors w-20 text-center">
                        Tolak
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Row 2 */}
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-5">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-xl bg-orange-200 text-orange-800 flex items-center justify-center font-bold text-sm">
                        CV
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">Subur Makmur Sejahtera</p>
                        <p className="text-xs text-gray-500">Daftar: 5 jam yang lalu</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-1.5 text-gray-400" />
                      <span>
                        Cianjur,<br />
                        <span className="font-semibold text-gray-800">Jawa Barat</span>
                      </span>
                    </div>
                  </td>
                  <td className="py-5">
                    <div className="flex items-center text-sm font-semibold text-green-700 cursor-pointer hover:underline">
                      <FileText className="h-4 w-4 mr-1.5" />
                      IB_09912.pdf
                    </div>
                  </td>
                  <td className="py-5 text-right">
                    <div className="flex flex-col items-end space-y-2">
                      <button className="bg-green-700 hover:bg-green-800 text-white text-xs font-bold py-1.5 px-4 rounded-lg transition-colors w-20 text-center">
                        Setujui
                      </button>
                      <button className="bg-red-100 hover:bg-red-200 text-red-600 text-xs font-bold py-1.5 px-4 rounded-lg transition-colors w-20 text-center">
                        Tolak
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Row 3 */}
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-5">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-bold text-sm">
                        JD
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">Jaya Desa Koop</p>
                        <p className="text-xs text-gray-500">Daftar: Kemarin</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-1.5 text-gray-400" />
                      <span>
                        Sleman,<br />
                        <span className="font-semibold text-gray-800">DIY</span>
                      </span>
                    </div>
                  </td>
                  <td className="py-5">
                    <div className="flex items-center text-sm font-semibold text-green-700 cursor-pointer hover:underline">
                      <FileText className="h-4 w-4 mr-1.5" />
                      AKTA_331.pdf
                    </div>
                  </td>
                  <td className="py-5 text-right">
                    <div className="flex flex-col items-end space-y-2">
                      <button className="bg-green-700 hover:bg-green-800 text-white text-xs font-bold py-1.5 px-4 rounded-lg transition-colors w-20 text-center">
                        Setujui
                      </button>
                      <button className="bg-red-100 hover:bg-red-200 text-red-600 text-xs font-bold py-1.5 px-4 rounded-lg transition-colors w-20 text-center">
                        Tolak
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Aktivitas Terbaru */}
          <div className="bg-white rounded-[24px] p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.03)] border border-gray-100">
            <div className="flex items-center space-x-2 mb-6">
              <History className="h-5 w-5 text-green-700" />
              <h2 className="text-lg font-bold text-gray-900 font-plus-jakarta-sans">
                Aktivitas Terbaru
              </h2>
            </div>
            
            <div className="space-y-6">
              {/* Activity 1 */}
              <div className="relative pl-4 border-l-2 border-green-400">
                <div className="absolute -left-[5px] top-1 h-2 w-2 rounded-full bg-green-500"></div>
                <h3 className="text-sm font-bold text-gray-900">Moderasi Berhasil</h3>
                <p className="text-xs text-gray-600 mt-1 mb-1 leading-relaxed">
                  Postingan &quot;Bibit Jagung&quot; dihapus karena melanggar aturan.
                </p>
                <p className="text-[10px] text-gray-400 font-medium">10:45 AM • Admin Budi</p>
              </div>

              {/* Activity 2 */}
              <div className="relative pl-4 border-l-2 border-yellow-400">
                <div className="absolute -left-[5px] top-1 h-2 w-2 rounded-full bg-yellow-500"></div>
                <h3 className="text-sm font-bold text-gray-900">Komoditas Baru</h3>
                <p className="text-xs text-gray-600 mt-1 mb-1 leading-relaxed">
                  &quot;Bawang Merah Brebes&quot; ditambahkan ke Master Data.
                </p>
                <p className="text-[10px] text-gray-400 font-medium">09:12 AM • System</p>
              </div>

              {/* Activity 3 */}
              <div className="relative pl-4 border-l-2 border-red-500">
                <div className="absolute -left-[5px] top-1 h-2 w-2 rounded-full bg-red-600"></div>
                <h3 className="text-sm font-bold text-gray-900">Laporan Curiga</h3>
                <p className="text-xs text-gray-600 mt-1 mb-1 leading-relaxed">
                  User @petani_ceria dilaporkan melakukan spamming.
                </p>
                <p className="text-[10px] text-gray-400 font-medium">08:00 AM • Automated Bot</p>
              </div>
            </div>
          </div>

          {/* Total Postingan Aktif */}
          <div className="bg-[#105126] rounded-[24px] p-6 relative overflow-hidden text-white shadow-md">
            {/* Background pattern/icon */}
            <FileText className="absolute -right-6 -bottom-6 h-32 w-32 text-white opacity-10" />
            
            <div className="relative z-10">
              <p className="text-green-100 font-medium text-sm mb-1">Total Postingan Aktif</p>
              <h2 className="text-5xl font-extrabold font-plus-jakarta-sans tracking-tight">2,482</h2>
              
              <div className="inline-flex items-center space-x-1 bg-green-800/60 rounded-full px-3 py-1.5 mt-5">
                <TrendingUp className="h-3.5 w-3.5 text-green-300" />
                <span className="text-xs font-semibold text-green-100">+12% Minggu ini</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Master Data Komoditas Section */}
      <div className="bg-[#F6F7F6] rounded-[24px] p-8 mt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 font-plus-jakarta-sans">
              Master Data Komoditas
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Update harga referensi dan kategori tanaman secara global.
            </p>
          </div>
          <button className="bg-[#105126] hover:bg-green-800 text-white font-bold py-2.5 px-5 rounded-xl transition-colors flex items-center shadow-sm">
            <Plus className="h-5 w-5 mr-2" />
            Tambah Komoditas
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 group">
            <div className="flex justify-between items-start mb-4">
              <div className="h-14 w-14 rounded-xl overflow-hidden relative">
                <Image 
                  src="https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500&q=80" 
                  alt="Bawang Merah"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="text-gray-400 hover:text-green-600 transition-colors">
                  <Pencil className="h-4 w-4" />
                </button>
                <button className="text-gray-400 hover:text-red-600 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-[15px]">Bawang Merah</h3>
              <p className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold mb-4">
                Kategori: Umbi-umbian
              </p>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-[11px] text-gray-400">Ref. Harga</span>
                <span className="font-bold text-green-700 text-sm">Rp 24.500/kg</span>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 group">
            <div className="flex justify-between items-start mb-4">
              <div className="h-14 w-14 rounded-xl overflow-hidden relative">
                <Image 
                  src="https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500&q=80" 
                  alt="Wortel Organik"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="text-gray-400 hover:text-green-600 transition-colors">
                  <Pencil className="h-4 w-4" />
                </button>
                <button className="text-gray-400 hover:text-red-600 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-[15px]">Wortel Organik</h3>
              <p className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold mb-4">
                Kategori: Sayuran
              </p>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-[11px] text-gray-400">Ref. Harga</span>
                <span className="font-bold text-green-700 text-sm">Rp 12.000/kg</span>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 group">
            <div className="flex justify-between items-start mb-4">
              <div className="h-14 w-14 rounded-xl overflow-hidden relative">
                <Image 
                  src="https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&q=80" 
                  alt="Kentang Dieng"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="text-gray-400 hover:text-green-600 transition-colors">
                  <Pencil className="h-4 w-4" />
                </button>
                <button className="text-gray-400 hover:text-red-600 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-[15px]">Kentang Dieng</h3>
              <p className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold mb-4">
                Kategori: Umbi-umbian
              </p>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-[11px] text-gray-400">Ref. Harga</span>
                <span className="font-bold text-green-700 text-sm">Rp 18.200/kg</span>
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 group">
            <div className="flex justify-between items-start mb-4">
              <div className="h-14 w-14 rounded-xl overflow-hidden relative">
                <Image 
                  src="https://images.unsplash.com/photo-1588047917757-123497d3910c?w=500&q=80" 
                  alt="Cabai Hijau"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="text-gray-400 hover:text-green-600 transition-colors">
                  <Pencil className="h-4 w-4" />
                </button>
                <button className="text-gray-400 hover:text-red-600 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-[15px]">Cabai Hijau</h3>
              <p className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold mb-4">
                Kategori: Bumbu
              </p>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-[11px] text-gray-400">Ref. Harga</span>
                <span className="font-bold text-green-700 text-sm">Rp 32.000/kg</span>
              </div>
            </div>
          </div>
        </div>
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
