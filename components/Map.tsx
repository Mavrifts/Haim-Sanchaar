'use client';

import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { VillageData } from '@/app/actions';
import { X } from 'lucide-react';
import { useAppState } from '@/context/StateContext';

// Fix default Leaflet marker icon paths for Next.js
const customIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapProps {
  villages: VillageData[];
  selectedVillage?: VillageData | null;
  selectedState?: string;
  t?: Record<string, string>;
  sensors?: any[];
  onSelectVillage?: (v: VillageData | null) => void;
}

export default function Map({
  villages = [],
  selectedVillage,
  selectedState = 'Himachal Pradesh',
  t,
  sensors,
  onSelectVillage,
}: MapProps) {
  const [activePopupVillage, setActivePopupVillage] = useState<VillageData | null>(null);
  const [aiDirectives, setAiDirectives] = useState<Record<string | number, string>>({});

  return (
    <div className="relative w-full h-[600px] border border-slate-200 rounded-2xl overflow-hidden">
      <MapContainer 
        center={[31.1, 77.1]} 
        zoom={8} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {villages.map((v) => (
          <Marker 
            key={v.id} 
            position={[v.lat, v.lon]} 
            icon={customIcon}
            eventHandlers={{
                click: () => setActivePopupVillage(v)
            }}
          />
        ))}
      </MapContainer>
        
        {activePopupVillage && (
            <div className="absolute top-4 right-4 z-[1000] bg-white p-4 rounded-xl shadow-lg w-72 border border-slate-200">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-sm">{activePopupVillage.name}</h3>
                    <button onClick={() => setActivePopupVillage(null)}><X className="w-4 h-4" /></button>
                </div>
                <p className="text-xs mb-2">Risk: {activePopupVillage.risk_status}</p>
                <div className="p-2 bg-blue-50 text-xs rounded border border-blue-100">
                    {activePopupVillage.risk_status} - Directive: {aiDirectives[activePopupVillage.id] || "Calculating..."}
                </div>
            </div>
        )}
    </div>
  );
}

