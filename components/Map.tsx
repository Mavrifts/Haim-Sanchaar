'use client';

import { useAppState } from '@/context/StateContext';
import React, { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { VillageData, getVillageEvacuationDirective } from '@/app/actions';
import { MapPin, X, Sparkles, Navigation } from 'lucide-react';

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
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const { mode, t: contextT } = useAppState();

  const [activePopupVillage, setActivePopupVillage] = useState<VillageData | null>(null);
  const [aiDirectives, setAiDirectives] = useState<Record<string | number, string>>({});

  useEffect(() => {
    if (!mapContainerRef.current) return;
    
    if (!mapInstanceRef.current) {
        mapInstanceRef.current = L.map(mapContainerRef.current).setView([31.1, 77.1], 8);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapInstanceRef.current);
    }

    const map = mapInstanceRef.current;
    
    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.CircleMarker || layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    villages.forEach((v) => {
        const pulseIcon = L.divIcon({
            className: 'bg-red-500 rounded-full w-4 h-4 animate-ping',
            html: '<div class="w-4 h-4 bg-red-600 rounded-full animate-pulse border-2 border-white"></div>'
        });
        
        L.marker([v.lat, v.lon], { icon: pulseIcon })
          .addTo(map)
          .on('click', () => setActivePopupVillage(v));
    });

  }, [villages]);

  return (
    <div className="relative w-full h-[600px] border border-slate-200 rounded-2xl overflow-hidden">
        <div ref={mapContainerRef} className="w-full h-full" />
        
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
