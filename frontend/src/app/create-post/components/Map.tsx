"use client";
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Search, Loader2 } from "lucide-react";

// Fix Leaflet's default marker icon issue in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface MapProps {
  onLocationSelect: (address: string) => void;
  onClose: () => void;
}

function InteractiveMapLogic({ 
  onLocationSelect, 
  searchedCoords 
}: { 
  onLocationSelect: (address: string) => void;
  searchedCoords: { lat: number; lng: number; address: string } | null;
}) {
  const map = useMap();
  const [position, setPosition] = useState<L.LatLng | null>(null);

  const fetchAddress = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      if (data && data.display_name) {
        onLocationSelect(data.display_name);
      } else {
        onLocationSelect(`${lat}, ${lng}`);
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      onLocationSelect(`${lat}, ${lng}`);
    }
  };

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      fetchAddress(e.latlng.lat, e.latlng.lng);
    },
  });

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          map.flyTo([latitude, longitude], 15, { animate: true });
          
          // Auto set pin at current location
          const latlng = new L.LatLng(latitude, longitude);
          setPosition(latlng);
          fetchAddress(latitude, longitude);
        },
        (error) => {
          console.warn("Geolocation failed or denied, using default center. Details:", error.message);
        },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  useEffect(() => {
    if (searchedCoords) {
      const latlng = new L.LatLng(searchedCoords.lat, searchedCoords.lng);
      map.flyTo(latlng, 15, { animate: true });
      setPosition(latlng);
      onLocationSelect(searchedCoords.address);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchedCoords, map]);

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}


export default function Map({ onLocationSelect, onClose }: MapProps) {
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchedCoords, setSearchedCoords] = useState<{ lat: number; lng: number; address: string } | null>(null);

  const handleSelect = (addr: string) => {
    setSelectedAddress(addr);
  };

  const handleConfirm = () => {
    if (selectedAddress) {
      onLocationSelect(selectedAddress);
      onClose();
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectResult = (result: any) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    const address = result.display_name;
    
    setSearchedCoords({ lat, lng, address });
    setSelectedAddress(address);
    setSearchResults([]); // Hide results after selection
  };

  return (
    <div className="flex flex-col h-full relative min-h-0">
      
      {/* Search Bar */}
      <div className="mb-4 relative z-[2000]">
        <form onSubmit={handleSearch} className="relative flex items-center">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (e.target.value === "") setSearchResults([]);
            }}
            placeholder="Cari lokasi (Kota, Kecamatan, dll)..."
            className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-10 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#237127]/20 focus:border-[#237127] shadow-sm"
          />
          <Search size={18} className="absolute left-4 text-gray-400" />
          {isSearching && <Loader2 size={18} className="absolute right-4 text-gray-400 animate-spin" />}
        </form>
        
        {/* Search Results Dropdown */}
        {searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden max-h-60 overflow-y-auto z-[2001]">
            {searchResults.map((res: any, idx: number) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectResult(res)}
                className="w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors text-sm text-gray-700 last:border-0"
              >
                {res.display_name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 min-h-0 bg-gray-100 relative rounded-2xl overflow-hidden shadow-inner border border-gray-200 z-0">
        <MapContainer
          center={[-0.7893, 113.9213]} // Indonesia center
          zoom={5}
          style={{ height: "100%", width: "100%" }}
        >
          {/* Using OpenStreetMap standard tiles for clear visibility */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <InteractiveMapLogic onLocationSelect={handleSelect} searchedCoords={searchedCoords} />
        </MapContainer>
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg font-bold text-sm text-gray-700 pointer-events-none">
          Klik pada peta untuk memilih lokasi
        </div>
      </div>
      
      {selectedAddress && (
        <div className="mt-4 p-4 bg-green-50 border border-green-100 rounded-2xl shadow-sm">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Lokasi Terpilih</p>
          <p className="text-sm font-bold text-gray-800 leading-relaxed">{selectedAddress}</p>
        </div>
      )}

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-200 transition-colors"
        >
          Batal
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={!selectedAddress}
          className="flex-1 px-4 py-3 bg-[#237127] text-white font-bold text-sm rounded-xl hover:bg-[#1b5e1e] transition-colors shadow-lg shadow-green-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Konfirmasi Lokasi
        </button>
      </div>
    </div>
  );
}
