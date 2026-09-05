'use client';

import React, { useState, useEffect, useTransition } from 'react';
import dynamic from 'next/dynamic';
import { useAppState } from '@/context/StateContext';
import { getVillagesByState, DashboardResponse, VillageData } from '@/app/actions';
import { RefreshCw, Map as MapIcon, Layers } from 'lucide-react';
import SectorSelector from '@/components/SectorSelector';

// Dynamic import of map component to prevent SSR / Leaflet window errors
const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[620px] rounded-3xl bg-neutral-900 border border-neutral-800 flex flex-col items-center justify-center text-neutral-400 text-xs font-semibold gap-2">
      <RefreshCw className="w-5 h-5 animate-spin text-[#0071E3]" />
      Initializing GIS Leaflet Radar & Telemetry Layers...
    </div>
  ),
});

export default function LiveMapPage() {
  const { selectedState, t } = useAppState();
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isPending, startTransition] = useTransition();
  const [selectedVillage, setSelectedVillage] = useState<VillageData | null>(null);

  const loadData = (stateToLoad: string) => {
    setLoading(true);
    startTransition(async () => {
      try {
        const res = await getVillagesByState(stateToLoad);
        setData(res);
      } catch (err) {
        console.error('Error fetching map data:', err);
      } finally {
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    loadData(selectedState);
    setSelectedVillage(null);
  }, [selectedState]);

  const villages = data?.villages || [];

  return (
    <>
      <SectorSelector />

      <div className="space-y-6 h-full flex flex-col animate-in fade-in duration-300">
  
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1D1D1F] flex items-center gap-2">
            <MapIcon className="w-6 h-6 text-[#0071E3]" /> {t.map}
          </h1>
          <p className="text-xs text-[#86868B] mt-0.5">
            Interactive OpenStreetMap plotting coordinates for {selectedState}. Click any sensor node/circle marker to generate Gemini AI evacuation directives, route suggestions, and helplines.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#86868B] bg-white px-3 py-1 rounded-full border border-black/[0.06] shadow-2xs font-semibold shrink-0">
            {villages.length} {t.activeSensors}
          </span>
          <button
            onClick={() => loadData(selectedState)}
            disabled={loading || isPending}
            className="rounded-full px-4 py-1.5 text-xs font-semibold bg-white hover:bg-neutral-50 text-[#1D1D1F] border border-black/[0.08] shadow-xs transition-all active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading || isPending ? 'animate-spin text-[#0071E3]' : ''}`} />
            <span>Refresh Map</span>
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 relative">
        <Map
          villages={villages}
          selectedVillage={selectedVillage}
          selectedState={selectedState}
          onSelectVillage={(v) => setSelectedVillage(v)}
          t={t}
        />
      </div>
      </div>
    </>
  );
}
