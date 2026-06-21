"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix leaflet icon issue for Next.js
const customIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

export default function MiniMap({ lat, lng }: { lat: number, lng: number }) {
    const [mapKey, setMapKey] = useState<string>("");

    useEffect(() => {
        // Generate a unique key on every mount so Strict Mode doesn't reuse the Leaflet container
        setMapKey(Math.random().toString(36).substring(2, 9));
    }, [lat, lng]);

    if (!mapKey) return <div className="w-full h-full bg-gray-200 animate-pulse"></div>;

    return (
        <div style={{ width: '100%', height: '100%', zIndex: 0, position: 'relative' }}>
            <MapContainer 
                key={mapKey}
                center={[lat, lng]} 
                zoom={15} 
                zoomControl={false} 
                dragging={false} 
                doubleClickZoom={false} 
                scrollWheelZoom={false}
                attributionControl={false}
                className="w-full h-full"
                style={{ width: '100%', height: '100%', zIndex: 0 }}
            >
                <TileLayer
                    url="http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}"
                />
                <Marker position={[lat, lng]} icon={customIcon} />
            </MapContainer>
        </div>
    );
}
