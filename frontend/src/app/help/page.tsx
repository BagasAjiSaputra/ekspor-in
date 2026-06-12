"use client";

import React from "react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { Search, ChevronDown, MessageSquare, PhoneCall, Mail } from "lucide-react";

export default function HelpPage() {
    const [openFaq, setOpenFaq] = React.useState<number | null>(0);

    const faqs = [
        {
            q: "Bagaimana cara mendaftar sebagai pengepul di Eksporin?",
            a: "Anda dapat mendaftar dengan menekan tombol 'Daftar' di pojok kanan atas. Isi data diri dan informasi perusahaan Anda. Setelah itu, tim kami akan memverifikasi data Anda dalam waktu maksimal 2x24 jam."
        },
        {
            q: "Apakah layanan Eksporin berbayar?",
            a: "Untuk saat ini, pendaftaran dan pembuatan postingan komoditas di Eksporin 100% gratis. Kami mengambil margin kecil hanya jika transaksi ekspor telah berhasil dilakukan melalui platform kami."
        },
        {
            q: "Bagaimana sistem pembayaran yang digunakan?",
            a: "Kami menggunakan sistem Rekening Bersama (Escrow) yang terintegrasi. Dana dari pembeli internasional akan ditahan dengan aman dan baru diteruskan ke pengepul setelah barang diverifikasi terkirim."
        },
        {
            q: "Apa syarat komoditas agar bisa diekspor?",
            a: "Setiap komoditas memiliki standar ekspor yang berbeda tergantung negara tujuan. Secara umum, komoditas harus lulus uji fitosanitari, memiliki sertifikat asal (Certificate of Origin), dan memenuhi standar kualitas kelembapan/grade yang ditentukan."
        },
        {
            q: "Apakah saya bisa membatalkan postingan komoditas?",
            a: "Tentu, Anda dapat mengelola, mengedit, atau menghapus postingan komoditas Anda kapan saja melalui dashboard 'Profil' atau 'Daftar Postingan' selama belum ada transaksi yang berjalan."
        }
    ];

    return (
        <div className="min-h-screen bg-bg-soft font-body flex flex-col">
            <Navbar />
            
            <main className="flex-grow">
                {/* Header */}
                <section className="bg-primary pt-24 pb-32 px-6 text-center text-white relative">
                    <div className="max-w-3xl mx-auto relative z-10">
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Pusat Bantuan</h1>
                        <p className="text-lg text-primary-light mb-10">
                            Ada yang bisa kami bantu hari ini? Temukan jawaban untuk pertanyaan Anda di bawah ini.
                        </p>
                        
                        <div className="relative max-w-2xl mx-auto">
                            <input 
                                type="text" 
                                placeholder="Ketik kata kunci pencarian (ex: cara daftar, pembayaran)..."
                                className="w-full bg-white text-gray-900 rounded-2xl pl-14 pr-6 py-4 shadow-xl focus:outline-none focus:ring-4 focus:ring-white/20"
                            />
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
                        </div>
                    </div>
                </section>

                <section className="max-w-5xl mx-auto px-6 -mt-16 relative z-20 mb-24">
                    <div className="grid md:grid-cols-3 gap-6 mb-12">
                        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm text-center hover:-translate-y-1 transition-transform">
                            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MessageSquare size={24} />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">Live Chat</h3>
                            <p className="text-sm text-gray-500 mb-4">Ngobrol langsung dengan tim support kami (09:00 - 17:00).</p>
                            <button className="text-blue-600 font-bold text-sm">Mulai Chat</button>
                        </div>
                        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm text-center hover:-translate-y-1 transition-transform">
                            <div className="w-14 h-14 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <PhoneCall size={24} />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">Telepon</h3>
                            <p className="text-sm text-gray-500 mb-4">Layanan darurat untuk kendala transaksi.</p>
                            <button className="text-green-600 font-bold text-sm">+62 811 1234 5678</button>
                        </div>
                        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm text-center hover:-translate-y-1 transition-transform">
                            <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Mail size={24} />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">Email</h3>
                            <p className="text-sm text-gray-500 mb-4">Kirimkan pertanyaan detail beserta lampiran.</p>
                            <button className="text-orange-600 font-bold text-sm">support@eksporin.id</button>
                        </div>
                    </div>

                    {/* FAQ */}
                    <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-extrabold text-gray-900 mb-8 text-center">Pertanyaan yang Sering Diajukan (FAQ)</h2>
                        
                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <div 
                                    key={index} 
                                    className={`border rounded-2xl overflow-hidden transition-all duration-300 ${openFaq === index ? 'border-primary ring-1 ring-primary/20' : 'border-gray-200'}`}
                                >
                                    <button 
                                        onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                        className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                                    >
                                        <span className={`font-bold pr-4 ${openFaq === index ? 'text-primary' : 'text-gray-900'}`}>{faq.q}</span>
                                        <ChevronDown size={20} className={`text-gray-400 transition-transform duration-300 shrink-0 ${openFaq === index ? 'rotate-180 text-primary' : ''}`} />
                                    </button>
                                    <div 
                                        className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openFaq === index ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
                                    >
                                        <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
