import React from "react";

// Brand Icons
const FacebookIcon = ({ size = 18 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
);

const TwitterIcon = ({ size = 18 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
);

const InstagramIcon = ({ size = 18 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
);

const LinkedinIcon = ({ size = 18 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" />
    </svg>
);

export default function Footer() {
    return (
        <footer className="bg-bg-soft pt-16 pb-8 border-t border-gray-200 mt-20">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="col-span-1 md:col-span-1">
                    <div className="text-primary font-bold text-2xl mb-6">Eksporin</div>
                    <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                        Memberdayakan petani Indonesia melalui teknologi untuk akses pasar yang lebih adil dan transparan.
                    </p>
                    <div className="flex gap-4 mt-8">
                        <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100 text-primary cursor-pointer hover:scale-110 transition-transform"><FacebookIcon /></div>
                        <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100 text-primary cursor-pointer hover:scale-110 transition-transform"><TwitterIcon /></div>
                        <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100 text-primary cursor-pointer hover:scale-110 transition-transform"><InstagramIcon /></div>
                        <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100 text-primary cursor-pointer hover:scale-110 transition-transform"><LinkedinIcon /></div>
                    </div>
                </div>

                <div>
                    <h4 className="font-bold text-gray-900 mb-6">Perusahaan</h4>
                    <ul className="flex flex-col gap-4 text-sm text-gray-500">
                        <li className="hover:text-primary cursor-pointer">Tentang Kami</li>
                        <li className="hover:text-primary cursor-pointer">Karir</li>
                        <li className="hover:text-primary cursor-pointer">Kontak</li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-gray-900 mb-6">Bantuan</h4>
                    <ul className="flex flex-col gap-4 text-sm text-gray-500">
                        <li className="hover:text-primary cursor-pointer">Pusat Bantuan</li>
                        <li className="hover:text-primary cursor-pointer">Panduan Petani</li>
                        <li className="hover:text-primary cursor-pointer">FAQ</li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-gray-900 mb-6">Legal</h4>
                    <ul className="flex flex-col gap-4 text-sm text-gray-500">
                        <li className="hover:text-primary cursor-pointer">Privasi</li>
                        <li className="hover:text-primary cursor-pointer">Syarat & Ketentuan</li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-gray-200">
                <p className="text-xs text-gray-400 text-center">
                    © 2026 Eksporin. Memberdayakan Petani Indonesia.
                </p>
            </div>
        </footer>
    );
}
