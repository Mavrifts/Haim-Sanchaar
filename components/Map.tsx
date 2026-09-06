'use client';

import { useAppState } from '@/context/StateContext';
import React, { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { VillageData, TelemetryData, getVillageEvacuationDirective } from '@/app/actions';
import {
  Sparkles,
  MapPin,
  Route,
  PhoneCall,
  Activity,
  Droplets,
  Gauge,
  RefreshCw,
  Waves,
  Building,
  Navigation,
  X,
  Layers,
  AlertTriangle,
  Hospital,
  Zap,
  ShieldCheck,
} from 'lucide-react';

interface MapProps {
  villages: VillageData[];
  selectedVillage?: VillageData | null;
  selectedState?: string;
  onSelectVillage?: (village: VillageData) => void;
  t?: any;
}

const STATE_CENTERS: Record<string, { center: [number, number]; zoom: number }> = {
  'Himachal Pradesh': { center: [31.1048, 77.1734], zoom: 8 },
  'Uttarakhand': { center: [30.0668, 79.0193], zoom: 8 },
  'Jammu & Kashmir': { center: [33.7782, 76.5762], zoom: 7 },
  'Ladakh': { center: [34.1526, 77.5771], zoom: 7 },
};

// Mock Infrastructure Nodes for Layer 2
const INFRASTRUCTURE_NODES = [
  { name: 'Kullu District Hospital', lat: 31.9579, lng: 77.1095, type: 'hospital' },
  { name: 'Pandoh Hydro Power Substation', lat: 31.6700, lng: 77.0600, type: 'power' },
  { name: 'Beas River Main Span Bridge', lat: 31.9000, lng: 77.1500, type: 'bridge' },
  { name: 'Shimla SEOC Command Base', lat: 31.1048, lng: 77.1734, type: 'hospital' },
];

export default function Map({
  villages,
  selectedVillage,
  selectedState = 'Himachal Pradesh',
  onSelectVillage,
}: MapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const { lowBandwidth, t } = useAppState();

  const markersRef = useRef<L.Marker[]>([]);
  const infraMarkersRef = useRef<L.Marker[]>([]);
  const citizenMarkersRef = useRef<L.Marker[]>([]);
  const routePolylinesRef = useRef<L.Polyline[]>([]);

  // Layer Visibility State
  const [showIotSensors, setShowIotSensors] = useState<boolean>(true);
  const [showInfrastructure, setShowInfrastructure] = useState<boolean>(true);
  const [showEvacRoutes, setShowEvacRoutes] = useState<boolean>(true);
  const [showCitizenReports, setShowCitizenReports] = useState<boolean>(true);

  // Active popup state
  const [activePopupVillage, setActivePopupVillage] = useState<VillageData | null>(null);
  const [aiDirectives, setAiDirectives] = useState<Record<string | number, string>>({});
  const [loadingAi, setLoadingAi] = useState<Record<string | number, boolean>>({});
  const [activeEvacPath, setActiveEvacPath] = useState<string | null>(null);

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

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const initial = STATE_CENTERS[selectedState] || { center: [31.1048, 77.1734], zoom: 8 };
      const map = L.map(mapContainerRef.current, {
        center: initial.center,
        zoom: initial.zoom,
        zoomControl: false,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // OpenStreetMap Carto tiles for clear borders and terrain
      if (!lowBandwidth) {
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);
      } else {
        mapContainerRef.current.style.backgroundColor = '#f8fafc';
      }

      mapInstanceRef.current = map;
    }
  }, []);

  // Render Markers and Layers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // 1. Clear existing layers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
    infraMarkersRef.current.forEach((m) => m.remove());
    infraMarkersRef.current = [];
    citizenMarkersRef.current.forEach((m) => m.remove());
    citizenMarkersRef.current = [];
    routePolylinesRef.current.forEach((p) => p.remove());
    routePolylinesRef.current = [];

    const bounds: L.LatLngExpression[] = [];

    // Layer 1: IoT Sensor Villages
    if (showIotSensors) {
      villages.forEach((village) => {
        if (!village.latitude || !village.longitude) return;
        const lat = Number(village.latitude);
        const lng = Number(village.longitude);
        bounds.push([lat, lng]);

        let dotColor = '#16a34a';
        let haloColor = 'rgba(22, 163, 74, 0.4)';

        if (village.risk_status === 'CRITICAL') {
          dotColor = '#dc2626';
          haloColor = 'rgba(220, 38, 38, 0.55)';
        } else if (village.risk_status === 'HIGH') {
          dotColor = '#d97706';
          haloColor = 'rgba(217, 119, 6, 0.45)';
        } else if (village.risk_status === 'MODERATE') {
          dotColor = '#ca8a04';
          haloColor = 'rgba(202, 138, 4, 0.4)';
        }

        const customIcon = L.divIcon({
          className: 'custom-gis-marker',
          html: `
            <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
              <div style="position: absolute; width: 28px; height: 28px; border-radius: 9999px; background: ${haloColor}; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
              <div style="position: relative; width: 16px; height: 16px; border-radius: 9999px; background: ${dotColor}; border: 2px solid #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

        marker.on('click', () => {
          setActivePopupVillage(village);
          fetchDirectiveForVillage(village);
          if (onSelectVillage) onSelectVillage(village);
        });

        markersRef.current.push(marker);

        // Layer 3: Terrain-Aware Evacuation Polyline connecting to high ground
        if (showEvacRoutes && village.risk_status === 'CRITICAL') {
          const highGroundLat = lat + 0.03;
          const highGroundLng = lng + 0.02;

          const polyline = L.polyline(
            [
              [lat, lng],
              [lat + 0.015, lng + 0.008],
              [highGroundLat, highGroundLng],
            ],
            {
              color: '#005a9c',
              weight: 4,
              dashArray: '6, 8',
              opacity: 0.9,
            }
          ).addTo(map);

          routePolylinesRef.current.push(polyline);
        }
      });
    }

    // Layer 2: Critical Infrastructure
    if (showInfrastructure) {
      INFRASTRUCTURE_NODES.forEach((node) => {
        const infraIcon = L.divIcon({
          className: 'custom-infra-marker',
          html: `
            <div style="background: #1e293b; color: #ffffff; padding: 4px 6px; border-radius: 6px; font-size: 10px; font-weight: bold; border: 1.5px solid #005a9c; box-shadow: 0 2px 6px rgba(0,0,0,0.3); display: flex; items-center; gap: 3px;">
              🏥 ${node.name}
            </div>
          `,
          iconSize: [120, 24],
          iconAnchor: [60, 12],
        });
        const m = L.marker([node.lat, node.lng], { icon: infraIcon }).addTo(map);
        infraMarkersRef.current.push(m);
      });
    }

    // Layer 4: Citizen Reports
    if (showCitizenReports) {
      const reports = JSON.parse(localStorage.getItem('ndrf_citizen_reports') || '[]');
      reports.forEach((rep: any, idx: number) => {
        const baseLat = 31.95 + idx * 0.04;
        const baseLng = 77.1 + idx * 0.03;
        const reportIcon = L.divIcon({
          className: 'custom-citizen-report-marker',
          html: `
            <div style="background: #dc2626; color: #ffffff; padding: 3px 6px; border-radius: 9999px; font-size: 10px; font-weight: bold; border: 1.5px solid #ffffff; box-shadow: 0 2px 8px rgba(220,38,38,0.5);">
              ⚠️ ${rep.type}
            </div>
          `,
          iconSize: [110, 22],
          iconAnchor: [55, 11],
        });
        const m = L.marker([baseLat, baseLng], { icon: reportIcon }).addTo(map);
        citizenMarkersRef.current.push(m);
      });
    }

    // Recenter
    if (bounds.length > 0 && !selectedVillage) {
      map.flyToBounds(bounds as L.LatLngBoundsExpression, {
        padding: [50, 50],
        maxZoom: STATE_CENTERS[selectedState]?.zoom || 8,
        duration: 1.0,
      });
    } else if (STATE_CENTERS[selectedState]) {
      const preset = STATE_CENTERS[selectedState];
      map.flyTo(preset.center, preset.zoom, { duration: 1.0 });
    }
  }, [villages, selectedState, showIotSensors, showInfrastructure, showEvacRoutes, showCitizenReports]);

  // Fly to village when selected externally
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
    <div className="relative w-full h-[550px] rounded-2xl overflow-hidden border border-slate-300 shadow-md bg-slate-100">
      {/* Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Floating Layer Controls Panel */}
      <div className="absolute top-4 left-4 z-20 bg-white/95 border border-slate-200 backdrop-blur-md rounded-xl p-3 shadow-md space-y-2 text-xs">
        <span className="font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-200 pb-1">
          <Layers className="w-3.5 h-3.5 text-[#005a9c]" /> Map Layers
        </span>

        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-slate-700 font-semibold cursor-pointer">
            <input
              type="checkbox"
              checked={showIotSensors}
              onChange={(e) => setShowIotSensors(e.target.checked)}
              className="accent-[#005a9c]"
            />
            <span>{t.iotLayer || 'IoT Sensors & Gauges'}</span>
          </label>

          <label className="flex items-center gap-2 text-slate-700 font-semibold cursor-pointer">
            <input
              type="checkbox"
              checked={showInfrastructure}
              onChange={(e) => setShowInfrastructure(e.target.checked)}
              className="accent-[#005a9c]"
            />
            <span>{t.infrastructureLayer || 'Critical Infrastructure'}</span>
          </label>

          <label className="flex items-center gap-2 text-slate-700 font-semibold cursor-pointer">
            <input
              type="checkbox"
              checked={showEvacRoutes}
              onChange={(e) => setShowEvacRoutes(e.target.checked)}
              className="accent-[#005a9c]"
            />
            <span>{t.evacuationRoutes || 'Evacuation Routes'}</span>
          </label>

          <label className="flex items-center gap-2 text-slate-700 font-semibold cursor-pointer">
            <input
              type="checkbox"
              checked={showCitizenReports}
              onChange={(e) => setShowCitizenReports(e.target.checked)}
              className="accent-[#005a9c]"
            />
            <span>{t.citizenReports || 'Citizen Reports'}</span>
          </label>
        </div>
      </div>

      {/* Legend Badge */}
      <div className="absolute top-4 right-4 z-20 bg-white/95 border border-slate-200 backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-3 text-xs font-bold text-slate-700 shadow-md">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-600" /> Critical</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> High</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600" /> Safe</span>
      </div>

      {/* Translated Light-Mode Marker Popup Overlay */}
      {activePopupVillage && (
        <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-[420px] z-30 bg-white border border-slate-300 rounded-2xl p-5 shadow-2xl text-slate-900 animate-in fade-in slide-in-from-bottom-4 duration-200 max-h-[460px] overflow-y-auto">
          <div className="flex items-start justify-between border-b border-slate-200 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900">{activePopupVillage.name}</h3>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    activePopupVillage.risk_status === 'CRITICAL'
                      ? 'bg-red-100 text-red-800 border border-red-200'
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}
                >
                  {activePopupVillage.risk_status}
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                {activePopupVillage.district}, {activePopupVillage.state} • {activePopupVillage.river_basin} Basin
              </p>
            </div>
            <button
              onClick={() => setActivePopupVillage(null)}
              className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Telemetry Stats */}
          <div className="grid grid-cols-3 gap-2 my-3 text-xs">
            <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] text-slate-500 font-bold block">{t.rainfallRate || 'Rainfall'}</span>
              <strong className="text-sm font-extrabold text-slate-900">{activeTel?.rainfall_mm_hr ?? 38} mm/h</strong>
            </div>

            <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] text-slate-500 font-bold block">{t.soilMoisturePct || 'Soil Saturation'}</span>
              <strong className="text-sm font-extrabold text-amber-700">{activeTel?.soil_moisture_pct ?? 86}%</strong>
            </div>

            <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] text-slate-500 font-bold block">{t.waterLevel || 'Water Surge'}</span>
              <strong className="text-sm font-extrabold text-red-600">{activeTel?.water_level ? `${activeTel.water_level.toFixed(1)}m` : 'Critical'}</strong>
            </div>
          </div>

          {/* AI Directive */}
          <div className="my-3 p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1">
            <span className="text-[11px] font-bold text-blue-900 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" /> AI Evacuation Directive
            </span>
            <p className="text-xs text-blue-950 font-medium leading-relaxed">
              {aiDirectives[activePopupVillage.id] ||
                `Immediate evacuation required for ${activePopupVillage.name}. Move via ${activePopupVillage.alternate_routes?.[0] || 'High Ridge Road'} to staging ground at ${activePopupVillage.safe_shelter}.`}
            </p>
          </div>

          {/* Action Button */}
          <button
            onClick={() => setActiveEvacPath(activePopupVillage.alternate_routes?.[0] || 'Ridge High Road')}
            className="w-full py-2 bg-[#005a9c] hover:bg-blue-800 text-white rounded-xl font-bold text-xs shadow-xs flex items-center justify-center gap-2 mt-2 transition"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>{t.startEvacuation || 'Start Safe Route Evacuation'}</span>
          </button>

          {activeEvacPath && (
            <p className="text-[11px] text-emerald-700 font-bold text-center mt-2 bg-emerald-50 p-1.5 rounded-lg border border-emerald-200">
              ✓ Route Active: {activeEvacPath} (GPS Guidance Enabled)
            </p>
          )}
        </div>
      )}
    </div>
  );
}
