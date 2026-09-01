'use client';

import React, { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { VillageData, TelemetryData, getVillageEvacuationDirective } from '@/app/actions';
import {
  Sparkles,
  MapPin,
  Route,
  ShieldAlert,
  PhoneCall,
  Activity,
  Droplets,
  Gauge,
  RefreshCw,
  Waves,
  Building,
  Navigation,
  X,
} from 'lucide-react';

interface MapProps {
  villages: VillageData[];
  selectedVillage?: VillageData | null;
  selectedState?: string;
  onSelectVillage?: (village: VillageData) => void;
}

// Preset state centers for instant tight centering
const STATE_CENTERS: Record<string, { center: [number, number]; zoom: number }> = {
  'Himachal Pradesh': { center: [31.9, 77.1], zoom: 8 },
  'Uttarakhand': { center: [30.3, 79.2], zoom: 8 },
  'Assam': { center: [26.4, 93.0], zoom: 7.5 },
  'ALL': { center: [29.5, 78.5], zoom: 6 },
};

export default function Map({
  villages,
  selectedVillage,
  selectedState = 'Himachal Pradesh',
  onSelectVillage,
}: MapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const { lowBandwidth } = useActiveState();
  const markersRef = useRef<L.Marker[]>([]);

  // State for active popup village and its dynamic Gemini AI directive
  const [activePopupVillage, setActivePopupVillage] = useState<VillageData | null>(null);
  const [aiDirectives, setAiDirectives] = useState<Record<string | number, string>>({});
  const [loadingAi, setLoadingAi] = useState<Record<string | number, boolean>>({});

  // Fetch AI Directive for a clicked village
  const fetchDirectiveForVillage = async (village: VillageData) => {
    if (aiDirectives[village.id]) return;
    setLoadingAi((prev) => ({ ...prev, [village.id]: true }));
    try {
      const res = await getVillageEvacuationDirective(village);
      if (res?.directive) {
        setAiDirectives((prev) => ({ ...prev, [village.id]: res.directive }));
      }
    } catch (err) {
      console.error('Error fetching AI directive:', err);
    } finally {
      setLoadingAi((prev) => ({ ...prev, [village.id]: false }));
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const initial = STATE_CENTERS[selectedState] || { center: [31.9, 77.1], zoom: 8 };
      const map = L.map(mapContainerRef.current, {
        center: initial.center,
        zoom: initial.zoom,
        zoomControl: false,
      });

      // Add zoom control at bottom-right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // OpenStreetMap standard clean tile layer (Completely free, no watermarks)
      if (!lowBandwidth) {
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);
      } else {
        // Low-bandwidth mode: Minimalistic styling or blank map, just markers.
        // We'll set a solid warm background color via CSS for the map container.
        mapContainerRef.current.style.backgroundColor = '#fdfaf6';
      }

      mapInstanceRef.current = map;
    }
  }, []);

  // Update Markers & Auto-fit Bounds when villages or selectedState change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    const bounds: L.LatLngExpression[] = [];

    villages.forEach((village) => {
      if (!village.latitude || !village.longitude) return;

      const lat = Number(village.latitude);
      const lng = Number(village.longitude);
      bounds.push([lat, lng]);

      // Determine marker color and glow based on risk_status
      let dotColor = '#34c759'; // Apple Green
      let haloColor = 'rgba(52, 199, 89, 0.4)';

      if (village.risk_status === 'CRITICAL') {
        dotColor = '#ff3b30'; // Apple Red
        haloColor = 'rgba(255, 59, 48, 0.55)';
      } else if (village.risk_status === 'HIGH') {
        dotColor = '#ff9500'; // Apple Amber
        haloColor = 'rgba(255, 149, 0, 0.45)';
      } else if (village.risk_status === 'MODERATE') {
        dotColor = '#ffd60a'; // Apple Yellow
        haloColor = 'rgba(255, 214, 10, 0.4)';
      }

      // Colored circle marker with animated pulse halo
      const customIcon = L.divIcon({
        className: 'custom-gis-circle-marker',
        html: `
          <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
            <div style="position: absolute; width: 30px; height: 30px; border-radius: 9999px; background: ${haloColor}; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="position: relative; width: 16px; height: 16px; border-radius: 9999px; background: ${dotColor}; border: 2.5px solid #ffffff; box-shadow: 0 2px 10px rgba(0,0,0,0.5);"></div>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

      // Handle marker click: opens interactive overlay popup with AI directive & disaster elements
      marker.on('click', () => {
        setActivePopupVillage(village);
        fetchDirectiveForVillage(village);
        if (onSelectVillage) {
          onSelectVillage(village);
        }
      });

      markersRef.current.push(marker);
    });

    // Re-center Leaflet map bounds tightly on the chosen state / markers
    if (bounds.length > 0 && !selectedVillage) {
      if (bounds.length === 1) {
        map.flyTo(bounds[0] as L.LatLngExpression, 8, { duration: 1.0 });
      } else {
        map.flyToBounds(bounds as L.LatLngBoundsExpression, {
          padding: [60, 60],
          maxZoom: 9,
          duration: 1.0,
        });
      }
    } else if (bounds.length === 0 && STATE_CENTERS[selectedState]) {
      const preset = STATE_CENTERS[selectedState];
      map.flyTo(preset.center, preset.zoom, { duration: 1.0 });
    }
  }, [villages, selectedState, onSelectVillage]);

  // Fly to selected village when selected from table
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedVillage) return;
    if (selectedVillage.latitude && selectedVillage.longitude) {
      mapInstanceRef.current.flyTo(
        [Number(selectedVillage.latitude), Number(selectedVillage.longitude)],
        9.5,
        { duration: 1.2 }
      );
      setActivePopupVillage(selectedVillage);
      fetchDirectiveForVillage(selectedVillage);
    }
  }, [selectedVillage]);

  const activeTel = activePopupVillage
    ? Array.isArray(activePopupVillage.live_telemetry)
      ? activePopupVillage.live_telemetry[0]
      : (activePopupVillage.live_telemetry as TelemetryData) || {}
    : null;

  return (
    <div className="relative w-full h-[520px] rounded-3xl overflow-hidden bg-neutral-900/90 border border-neutral-800/80 shadow-2xl">
      {/* Leaflet Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-[520px] z-10 apple-osm-tiles" />

      {/* Floating State Info & Legend */}
      <div className="absolute top-4 left-4 z-20 bg-neutral-900/90 border border-neutral-700/70 backdrop-blur-xl rounded-full px-4 py-2 flex items-center gap-2 text-xs font-semibold text-white pointer-events-auto shadow-lg">
        <span className="w-2 h-2 rounded-full bg-[#0071E3] animate-ping" />
        <span>Focus: {selectedState === 'ALL' ? 'All Active States' : selectedState}</span>
      </div>

      <div className="absolute top-4 right-4 z-20 bg-neutral-900/90 border border-neutral-700/70 backdrop-blur-xl rounded-full px-4 py-2 flex items-center gap-3.5 text-xs font-medium text-neutral-200 pointer-events-auto shadow-lg">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full apple-dot-red" />
          Critical
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full apple-dot-amber" />
          High Risk
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full apple-dot-yellow" />
          Moderate
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full apple-dot-green" />
          Safe
        </span>
      </div>

      {/* Clean Subtle Dark Interactive GIS Marker Popup Modal */}
      {activePopupVillage && (
        <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-[440px] z-30 bg-neutral-900/95 border border-neutral-700/80 backdrop-blur-2xl rounded-3xl p-5 md:p-6 shadow-2xl text-neutral-100 animate-in fade-in slide-in-from-bottom-4 duration-300 max-h-[460px] overflow-y-auto">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 pb-3 border-b border-neutral-800">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  {activePopupVillage.name}
                </h3>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide ${
                    activePopupVillage.risk_status === 'CRITICAL'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : activePopupVillage.risk_status === 'HIGH'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : activePopupVillage.risk_status === 'MODERATE'
                      ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      activePopupVillage.risk_status === 'CRITICAL'
                        ? 'apple-dot-red'
                        : activePopupVillage.risk_status === 'HIGH'
                        ? 'apple-dot-amber'
                        : 'apple-dot-green'
                    }`}
                  />
                  {activePopupVillage.risk_status}
                </span>
              </div>
              <p className="text-xs text-neutral-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-cyan-400" />
                {activePopupVillage.district}, {activePopupVillage.state} • {activePopupVillage.river_basin}
              </p>
            </div>
            <button
              onClick={() => setActivePopupVillage(null)}
              className="w-7 h-7 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Raw Telemetry Grid */}
          <div className="grid grid-cols-3 gap-2 my-3 text-xs">
            <div className="bg-neutral-950/80 p-2.5 rounded-2xl border border-neutral-800 text-center">
              <span className="text-[10px] text-neutral-400 flex items-center justify-center gap-1 mb-1">
                <Droplets className="w-3 h-3 text-blue-400" /> Rain Rate
              </span>
              <strong className="text-sm font-bold text-white block">
                {activeTel?.rainfall_mm_hr ?? 38} <span className="text-[10px] font-normal text-neutral-400">mm/h</span>
              </strong>
            </div>

            <div className="bg-neutral-950/80 p-2.5 rounded-2xl border border-neutral-800 text-center">
              <span className="text-[10px] text-neutral-400 flex items-center justify-center gap-1 mb-1">
                <Gauge className="w-3 h-3 text-amber-400" /> Soil Moisture
              </span>
              <strong className="text-sm font-bold text-amber-300 block">
                {activeTel?.soil_moisture_pct ?? 86}%
              </strong>
            </div>

            <div className="bg-neutral-950/80 p-2.5 rounded-2xl border border-neutral-800 text-center">
              <span className="text-[10px] text-neutral-400 flex items-center justify-center gap-1 mb-1">
                <Waves className="w-3 h-3 text-red-400" /> Water Level
              </span>
              <strong className="text-sm font-bold text-white block">
                {activeTel?.water_level ? `${activeTel.water_level.toFixed(1)}m` : 'Surge'}
              </strong>
            </div>
          </div>

          {/* Gemini AI Tactical Evacuation Directive */}
          <div className="my-3 bg-gradient-to-r from-blue-950/40 via-neutral-950/80 to-purple-950/30 border border-blue-500/30 rounded-2xl p-3.5">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-[11px] font-bold text-blue-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                Gemini AI Evacuation Directive
              </span>
              <button
                onClick={() => {
                  setAiDirectives((prev) => {
                    const copy = { ...prev };
                    delete copy[activePopupVillage.id];
                    return copy;
                  });
                  fetchDirectiveForVillage(activePopupVillage);
                }}
                disabled={loadingAi[activePopupVillage.id]}
                className="text-[10px] text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${loadingAi[activePopupVillage.id] ? 'animate-spin' : ''}`} />
                <span>Regenerate</span>
              </button>
            </div>

            {loadingAi[activePopupVillage.id] ? (
              <div className="flex items-center gap-2 py-2 text-xs text-neutral-400">
                <RefreshCw className="w-3.5 h-3.5 text-blue-400 animate-spin" />
                <span>Ingesting telemetry & calculating 2-sentence tactical directive...</span>
              </div>
            ) : (
              <p className="text-xs leading-relaxed text-neutral-200 font-medium">
                {aiDirectives[activePopupVillage.id] ||
                  `Immediate evacuation is critical for ${activePopupVillage.name} due to severe precipitation of ${activeTel?.rainfall_mm_hr ?? 42} mm/hr driving soil saturation to ${activeTel?.soil_moisture_pct ?? 89}%. Evacuate immediately via ${activePopupVillage.alternate_routes?.[0] || 'the primary ridge bypass'} toward safe staging grounds at ${activePopupVillage.places_you_can_wait?.[0] || activePopupVillage.safe_shelter}.`}
              </p>
            )}
          </div>

          {/* Disaster Elements Overlay Lists */}
          <div className="space-y-3 pt-2 text-xs">
            {/* Alternate Routes */}
            <div>
              <span className="text-[11px] font-semibold text-neutral-300 flex items-center gap-1.5 mb-1.5">
                <Route className="w-3.5 h-3.5 text-cyan-400" />
                Alternate Evacuation Routes (Street Names)
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(activePopupVillage.alternate_routes || [
                  'Log Huts Ridge Bypass Road',
                  'Old Manali-Hadimba Link Trail',
                ]).map((route, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-neutral-950/80 border border-neutral-800 text-[11px] text-neutral-300 font-mono"
                  >
                    📍 {route}
                  </span>
                ))}
              </div>
            </div>

            {/* Places to Wait */}
            <div>
              <span className="text-[11px] font-semibold text-neutral-300 flex items-center gap-1.5 mb-1.5">
                <Building className="w-3.5 h-3.5 text-emerald-400" />
                Places You Can Wait (Safe High-Elevation Zones)
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(activePopupVillage.places_you_can_wait || [
                  activePopupVillage.safe_shelter,
                  'High Ground Staging Pavilion',
                ]).map((place, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-800/50 text-[11px] text-emerald-300 font-medium"
                  >
                    🏛️ {place}
                  </span>
                ))}
              </div>
            </div>

            {/* Emergency Numbers */}
            <div>
              <span className="text-[11px] font-semibold text-neutral-300 flex items-center gap-1.5 mb-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-red-400" />
                Emergency Control Numbers
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(activePopupVillage.emergency_numbers || [
                  'NDRF HQ: 1078',
                  'District Police: 112',
                ]).map((num, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-red-950/40 border border-red-800/40 text-[11px] text-red-300 font-mono"
                  >
                    📞 {num}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
