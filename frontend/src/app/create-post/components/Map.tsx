"use client";
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

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

function InteractiveMapLogic({ onLocationSelect }: { onLocationSelect: (address: string) => void }) {
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

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}


export default function Map({ onLocationSelect, onClose }: MapProps) {
  const [selectedAddress, setSelectedAddress] = useState<string>("");

  const handleSelect = (addr: string) => {
    setSelectedAddress(addr);
  };

  const handleConfirm = () => {
    if (selectedAddress) {
      onLocationSelect(selectedAddress);
      onClose();
    }
  };

  return (
    <div className="flex flex-col h-full relative min-h-0">
      <div className="flex-1 min-h-0 bg-gray-100 relative rounded-2xl overflow-hidden shadow-inner border border-gray-200">
        <MapContainer
          center={[-0.7893, 113.9213]} // Indonesia center
          zoom={5}
          style={{ height: "100%", width: "100%" }}
        >
          {/* Using Google Maps Satellite/Hybrid tile layer as requested by the user */}
          <TileLayer
            attribution='&copy; <a href="https://www.google.com/intl/en_us/help/terms_maps.html">Google Maps</a>'
            url="http://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
          />
          <InteractiveMapLogic onLocationSelect={handleSelect} />
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
