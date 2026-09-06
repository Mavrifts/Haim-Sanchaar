'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useAppState } from '@/context/StateContext';
import { getVillagesByState, dispatchQRT, DashboardResponse, TelemetryData } from '@/app/actions';
import {
  Table,
  RefreshCw,
  Search,
  Droplets,
  Gauge,
  Activity,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  ShieldAlert,
  AlertTriangle,
  Building,
  Route,
  Activity as ActivityIcon,
  Layers,
  ArrowUpRight
} from 'lucide-react';

import SectorSelector from '@/components/SectorSelector';
export default function TelemetryPage() {
  const { selectedState, t } = useAppState();
  const activeState = selectedState || 'Himachal Pradesh';
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Track dispatch states locally for each village (e.g. 'idle' | 'loading' | 'success')
  const [dispatchStates, setDispatchStates] = useState<Record<string | number, 'idle' | 'loading' | 'success'>>({});
  const [dispatchMessage, setDispatchMessage] = useState<string | null>(null);

  const loadData = (stateToLoad: string) => {
    setLoading(true);
    startTransition(async () => {
      try {
        const res = await getVillagesByState(stateToLoad || 'Himachal Pradesh');
        setData(res.villages.length > 0 ? res : await getVillagesByState('ALL'));
      } catch (err) {
        console.error('Error fetching telemetry data:', err);
      } finally {
        setLoading(false);
      }
    });
      <SectorSelector />

  };

  useEffect(() => {
    loadData(activeState);
  }, [activeState]);

  const handleDispatchQRT = async (village: any) => {
    setDispatchStates((prev) => ({ ...prev, [village.id]: 'loading' }));
    
    const tel = Array.isArray(village.live_telemetry)
      ? village.live_telemetry[0]
      : (village.live_telemetry as unknown as TelemetryData) || {};

    const waterLevel = tel.water_level ?? 12.5;
    const soilMoisture = tel.soil_moisture_pct ?? 82;
    // Calculate custom Slope Stability Index (SSI) based on saturation and rainfall
    const moistureFactor = (soilMoisture / 100);
    const rainFactor = ((tel.rainfall_mm_hr ?? 30) / 100);
    const slopeStability = Math.max(0.05, Math.min(1.00, Number((1.15 - (moistureFactor * 0.65) - (rainFactor * 0.25)).toFixed(2))));

    try {
      const res = await dispatchQRT({
        villageId: village.id,
        villageName: village.name,
        state: village.state,
        district: village.district,
        waterLevel,
        soilMoisture,
        slopeStability,
        timestamp: new Date().toISOString()
      });

      if (res.success) {
        setDispatchStates((prev) => ({ ...prev, [village.id]: 'success' }));
        setDispatchMessage(`Operational deployment trigger: ${res.message} for ${village.name}.`);
        setTimeout(() => setDispatchMessage(null), 5000);
      } else {
        setDispatchStates((prev) => ({ ...prev, [village.id]: 'idle' }));
        alert(`Failed to dispatch QRT: ${res.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error(err);
      setDispatchStates((prev) => ({ ...prev, [village.id]: 'idle' }));
    }
  };

  const villages = data?.villages || [];
  
  // Filter villages based on search query
  const filteredVillages = villages.filter((v) => {
    if (!searchQuery || searchQuery.trim() === '') return true;
    const term = searchQuery.toLowerCase();
    return (
      v.name.toLowerCase().includes(term) ||
      v.district.toLowerCase().includes(term) ||
      v.state.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1D1D1F] flex items-center gap-2">
            <ActivityIcon className="w-6 h-6 text-[#0071E3]" /> Live Hydrological Telemetry
          </h1>
          <p className="text-xs text-[#86868B] mt-0.5">
            Real-time sensory inputs from mountain basins across {activeState}. Evaluate water level trends and land slip metrics before triggering QRT deployment.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#86868B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by name, basin, district..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 pl-9 pr-4 py-1.5 bg-white border border-black/[0.08] rounded-full text-xs text-[#1D1D1F] placeholder-[#86868B] focus:outline-none focus:border-[#0071E3] transition"
            />
          </div>

          <button
            onClick={() => loadData(activeState)}
            disabled={loading || isPending}
            className="rounded-full px-4 py-1.5 text-xs font-semibold bg-white hover:bg-neutral-50 text-[#1D1D1F] border border-black/[0.08] shadow-xs transition-all active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading || isPending ? 'animate-spin text-[#0071E3]' : ''}`} />
            <span>Sync Feed</span>
          </button>
        </div>
      </div>

      {/* Dispatch Feedback Message */}
      {dispatchMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200/50 text-emerald-800 text-xs rounded-2xl flex items-center gap-2 animate-in slide-in-from-top-4 duration-300 shadow-sm">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{dispatchMessage}</span>
        </div>
      )}

      {/* Telemetry Hydrological Table */}
      <section className="bg-white border border-black/[0.08] rounded-3xl p-6 md:p-8 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-black/[0.04] pb-4">
          <h2 className="text-sm font-bold text-[#1D1D1F] flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#86868B]" /> Sensor Telemetry & Soil Hydration Matrix
          </h2>
          <span className="text-[11px] text-[#86868B]">
            Region: <strong className="text-[#1D1D1F]">{activeState}</strong>
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-black/[0.06]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-black/[0.01] text-[#86868B] font-semibold border-b border-black/[0.06]">
                <th className="py-4 px-4">{t.stationId}</th>
                <th className="py-4 px-4">{t.districtSector}</th>
                <th className="py-4 px-4">{t.riverBasin}</th>
                <th className="py-4 px-4">{t.waterLevel}</th>
                <th className="py-4 px-4">{t.dangerLevel}</th>
                <th className="py-4 px-4">{t.rainfallRate}</th>
                <th className="py-4 px-4">{t.soilMoisturePct}</th>
                <th className="py-4 px-4">{t.riskStatus}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04]">
              {filteredVillages.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#86868B]">
                    No monitored sectors matched your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredVillages.map((village) => {
                  const tel = Array.isArray(village.live_telemetry)
                    ? village.live_telemetry[0]
                    : (village.live_telemetry as unknown as TelemetryData) || {};

                  // Derive Water Level Trend
                  const isRising = tel.rate_of_rise && tel.rate_of_rise > 0;
                  const isFalling = tel.rate_of_rise && tel.rate_of_rise < 0;
                  const trendLabel = isRising ? 'Rising 📈' : isFalling ? 'Falling 📉' : 'Steady ➡️';

                  // Calculate custom Slope Stability Index (SSI)
                  const moistureVal = tel.soil_moisture_pct ?? 82;
                  const rainVal = tel.rainfall_mm_hr ?? 30;
                  const moistureFactor = (moistureVal / 100);
                  const rainFactor = (rainVal / 100);
                  const ssi = Math.max(0.05, Math.min(1.00, Number((1.15 - (moistureFactor * 0.65) - (rainFactor * 0.25)).toFixed(2))));

                  // Slope stability warning styling
                  let ssiColor = 'text-emerald-600 bg-emerald-500/10 border-emerald-500/15';
                  let ssiStatus = 'Stable';
                  if (ssi < 0.45) {
                    ssiColor = 'text-red-600 bg-red-500/10 border-red-500/15';
                    ssiStatus = 'Critical Slideline';
                  } else if (ssi < 0.65) {
                    ssiColor = 'text-amber-600 bg-amber-500/10 border-amber-500/15';
                    ssiStatus = 'Imminent Slide Warning';
                  } else if (ssi < 0.80) {
                    ssiColor = 'text-yellow-700 bg-yellow-500/10 border-yellow-500/15';
                    ssiStatus = 'Moderate';
                  }

                  const dispatchState = dispatchStates[village.id] || 'idle';

                  return (
                    <tr key={village.id} className="hover:bg-black/[0.01] transition-colors group">
                      {/* Name and River Basin */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-[#1D1D1F] text-sm">{village.name}</div>
                        <div className="text-[11px] text-[#86868B] mt-0.5 font-mono">{village.river_basin}</div>
                      </td>

                      {/* Risk badge */}
                      <td className="py-4 px-4">
                        {village.risk_status === 'CRITICAL' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-red-500/10 text-red-600 border border-red-500/15">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Critical
                          </span>
                        ) : village.risk_status === 'HIGH' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-amber-500/10 text-amber-600 border border-amber-500/15">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> High Risk
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-emerald-500/10 text-emerald-600 border border-emerald-500/15">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Safe
                          </span>
                        )}
                      </td>

                      {/* Water Level & Trend */}
                      <td className="py-4 px-4 font-mono">
                        <div className="font-bold text-neutral-800 flex items-center gap-1">
                          <span>{tel.water_level ? `${tel.water_level.toFixed(1)} m` : 'Surgemark'}</span>
                        </div>
                        <div className="text-[11px] text-[#86868B] mt-0.5 flex items-center gap-1 font-semibold">
                          {isRising ? (
                            <TrendingUp className="w-3.5 h-3.5 text-red-500 shrink-0" />
                          ) : (
                            <TrendingDown className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          )}
                          <span>{trendLabel}</span>
                        </div>
                      </td>

                      {/* Soil Moisture */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 font-bold text-neutral-800">
                          <Gauge className="w-4 h-4 text-blue-500" />
                          <span>{moistureVal}%</span>
                        </div>
                        <div className="text-[10px] text-[#86868B] mt-0.5">Saturated Mass</div>
                      </td>

                      {/* Slope Stability Index (SSI) */}
                      <td className="py-4 px-4">
                        <div className={`inline-flex flex-col px-3 py-1.5 rounded-2xl border ${ssiColor}`}>
                          <span className="font-bold text-sm tracking-tight">{ssi.toFixed(2)} SSI</span>
                          <span className="text-[9px] font-bold uppercase tracking-wider">{ssiStatus}</span>
                        </div>
                      </td>

                      {/* Rain Rate */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 font-bold text-neutral-800">
                          <Droplets className="w-4 h-4 text-[#0071E3]" />
                          <span>{rainVal} mm/hr</span>
                        </div>
                        <div className="text-[10px] text-[#86868B] mt-0.5">Precipitation Node</div>
                      </td>

                      {/* Make.com Webhook trigger button */}
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => handleDispatchQRT(village)}
                          disabled={dispatchState !== 'idle'}
                          className={`px-4 py-2 rounded-full text-xs font-bold transition-all active:scale-95 shadow-xs flex items-center gap-1.5 ml-auto cursor-pointer ${
                            dispatchState === 'success'
                              ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                              : dispatchState === 'loading'
                              ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                              : village.risk_status === 'CRITICAL'
                              ? 'bg-[#0071E3] hover:bg-[#0077ED] text-white shadow-blue-500/25'
                              : 'bg-black/[0.04] hover:bg-black/[0.07] text-[#1D1D1F]'
                          }`}
                        >
                          {dispatchState === 'loading' ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Deploying...</span>
                            </>
                          ) : dispatchState === 'success' ? (
                            <>
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>QRT Dispatched ✓</span>
                            </>
                          ) : (
                            <>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                              <span>Dispatch QRT</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
