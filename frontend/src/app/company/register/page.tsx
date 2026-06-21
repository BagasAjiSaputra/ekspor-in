"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Building2, Phone, MapPin, Loader2, ArrowLeft } from "lucide-react"
import { RegisterCompany } from "@/features/company/register_company"
import dynamic from "next/dynamic"

const MapPicker = dynamic(() => import("@/app/create-post/components/Map"), { ssr: false })

export default function RegisterCompanyPage() {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [address, setAddress] = useState("")
  const [showMapModal, setShowMapModal] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsPending(true)
    setError(null)
    
    try {
      const res = await RegisterCompany(formData)
      if (res?.error) {
        setError(res.error)
        alert(res.error)
      } else {
        alert(res.message || "Berhasil mendaftarkan perusahaan!")
        router.push("/profile")
      }
    } catch {
      setError("Terjadi kesalahan, coba lagi.")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pt-4 pb-12 p-8 font-body">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors shadow-sm"
          aria-label="Kembali"
        >
          <ArrowLeft size={18} strokeWidth={2.5} />
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Daftarkan Perusahaan
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Lengkapi data perusahaan Anda untuk mempublikasikan kebutuhan listing.
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8">
        <form action={handleSubmit} className="space-y-5">
          
          {/* Company Name */}
          <div className="space-y-1.5">
            <label htmlFor="company_name" className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              <Building2 size={13} strokeWidth={2.5} />
              Nama Perusahaan
            </label>
            <input
              id="company_name"
              name="company_name"
              type="text"
              placeholder="Contoh: PT. RyuPort Sejahtera"
              required
              disabled={isPending}
              className="w-full h-11 px-3.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
            />
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label htmlFor="phone" className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              <Phone size={13} strokeWidth={2.5} />
              Nomor Telepon
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Contoh: +6285736957264"
              required
              disabled={isPending}
              className="w-full h-11 px-3.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
            />
          </div>

          {/* Address */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label htmlFor="address" className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <MapPin size={13} strokeWidth={2.5} />
                Alamat Perusahaan
              </label>
              <button
                type="button"
                onClick={() => setShowMapModal(true)}
                className="text-xs font-bold text-[#237127] hover:text-white bg-white hover:bg-[#237127] border border-[#237127] transition-all flex items-center gap-1.5 px-3 py-1.5 rounded-lg shadow-sm active:scale-95"
              >
                <MapPin size={12} />
                Pilih dari Peta
              </button>
            </div>
            <textarea
              id="address"
              name="address"
              rows={4}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Masukkan alamat lengkap perusahaan"
              required
              disabled={isPending}
              className="w-full py-3 px-3.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 disabled:opacity-50 resize-y"
            />
          </div>

          {/* Error Message */}
          {error && (
             <div className="p-4 rounded-2xl text-xs font-bold border bg-red-50 text-red-600 border-red-100 flex items-center gap-2">
               <span>⚠</span> {error}
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="w-full sm:w-auto h-11 px-8 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark active:scale-95 transition-all duration-150 disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isPending && <Loader2 size={16} className="animate-spin" />}
              {isPending ? "Mendaftarkan..." : "Daftarkan Perusahaan"}
            </button>
          </div>

        </form>
      </div>

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
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-hidden">
              <MapPicker 
                onLocationSelect={(addr) => {
                  setAddress(addr)
                }} 
                onClose={() => setShowMapModal(false)} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
