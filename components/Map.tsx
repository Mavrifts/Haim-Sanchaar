'use client';

import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { VillageData } from '@/app/actions';
import { X, AlertTriangle, Shield, Navigation } from 'lucide-react';

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
  return (
    <div className="relative w-full h-[600px] border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <MapContainer 
        center={[31.1, 77.1]} 
        zoom={6} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {villages.map((v) => (
          <Marker 
            key={v.id} 
            position={[v.latitude, v.longitude]} 
            icon={customIcon}
          >
            <Popup className="custom-popup" minWidth={250}>
              <div className="p-2">
                <h3 className="font-bold text-sm text-slate-900 mb-1">{v.name}</h3>
                <div className="space-y-1.5 text-xs text-slate-600">
                    <p className="flex items-center gap-1"><strong>Status:</strong> <span className={`px-1.5 py-0.5 rounded-full ${v.risk_status === 'CRITICAL' ? 'bg-red-100 text-red-700' : v.risk_status === 'WARNING' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>{v.risk_status}</span></p>
                    <p><strong>District:</strong> {v.district}</p>
                    <p><strong>River Basin:</strong> {v.river_basin}</p>
                    {v.ai_directive && (
                        <div className="mt-2 p-2 bg-blue-50 border border-blue-100 rounded text-[10px] text-blue-800">
                            <strong>AI Directive:</strong> {v.ai_directive}
                        </div>
                    )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

