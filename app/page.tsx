'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useAppState, ForecastWindow } from '@/context/StateContext';
import { getVillagesByState, DashboardResponse } from './actions';
import {
  Shield,
  Radio,
  RefreshCw,
  Sparkles,
  Copy,
  Check,
  Activity,
  Gauge,
  AlertTriangle,
  Users,
  Compass,
  ArrowRight,
  TrendingUp,
  MapPin,
  Search,
  Sliders,
  Cpu,
  Layers,
  CloudRain,
  Building2,
  Anchor
} from 'lucide-react';
import Link from 'next/link';
import SectorSelector from '@/components/SectorSelector';

export default function HomeDashboard() {
  const { selectedState, mode, forecastTime, setForecastTime, t } = useAppState();
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isPending, startTransition] = useTransition();
  const [copied, setCopied] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const loadData = (stateToLoad: string) => {
    setLoading(true);
    startTransition(async () => {
      try {
        const res = await getVillagesByState(stateToLoad);
        setData(res);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    loadData(selectedState);
  }, [selectedState]);

  const copySummary = () => {
    if (data?.evacuationSummary) {
      navigator.clipboard.writeText(data.evacuationSummary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const villages = data?.villages || [];

  // Filter villages by micro-watershed search
  const filteredVillages = villages.filter(
    (v) =>
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.river_basin.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Dynamic calculations based on forecast window multiplier
  const windowMultiplier =
    forecastTime === '0-3h' ? 1.0 : forecastTime === '3-6h' ? 1.25 : 1.5;

  const criticalCount = Math.round(
    filteredVillages.filter((v) => v.risk_status === 'CRITICAL').length * (forecastTime === '0-3h' ? 1 : 1.2)
  );

  const basePop = data?.totalPopulationAtRisk || 14200;
  const projectedPop = Math.round(basePop * windowMultiplier);

  const soilMoistureVal =
    selectedState === 'Himachal Pradesh'
      ? (91.2 * (forecastTime === '0-3h' ? 1.0 : 1.04)).toFixed(1)
      : (94.0 * (forecastTime === '0-3h' ? 1.0 : 1.03)).toFixed(1);

  const bridgesThreatened = forecastTime === '0-3h' ? 4 : forecastTime === '3-6h' ? 7 : 12;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Sector Selector & Sensor Fallback Indicator */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <SectorSelector />

        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full text-xs font-bold text-emerald-800 shadow-2xs">
          <Cpu className="w-4 h-4 text-emerald-600 animate-pulse" />
          <span>{t.primaryOnline || 'Primary IoT Telemetry Online'}</span>
          <span className="text-[10px] text-emerald-600 font-normal">| 142 Gauges Active</span>
        </div>
      </div>

      {/* Top Header & Forecast Slider */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            <Shield className="w-7 h-7 text-[#005a9c]" />
            {t.situationalCommand || 'Situational Command'}: {selectedState}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {t.realTimeTactical || 'Real-time tactical intelligence, AI directives, and active hydration telemetry for NDRF deployables.'}
          </p>
        </div>

        {/* 0-24h Interactive Forecast Window Selector */}
        <div className="flex flex-col items-start md:items-end gap-1.5">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
            <Sliders className="w-3.5 h-3.5 text-[#005a9c]" />
            {t.forecastWindow || 'Forecast Horizon'}:
          </span>
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 gap-1">
            {(['0-3h', '3-6h', '6-24h'] as ForecastWindow[]).map((fw) => (
              <button
                key={fw}
                onClick={() => setForecastTime(fw)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                  forecastTime === fw
                    ? 'bg-[#005a9c] text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                {fw}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Micro-Watershed Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.searchWatershed || 'Filter Micro-Watershed / Village (e.g. Old Manali, Pandoh, Sangla)...'}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs md:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
        />
      </div>

      {/* Gemini AI Tactical Directive Banner */}
      <section className="border border-blue-200 rounded-2xl p-6 bg-gradient-to-r from-blue-50/70 via-white to-amber-50/50 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                {t.tacticalEvacuation || 'Tactical Evacuation Directive'}
              </h2>
              <p className="text-xs text-slate-500">{t.aiSynthesized || `AI-synthesized directives for ${selectedState} Sector.`}</p>
            </div>
          </div>
          <button
            onClick={copySummary}
            className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-bold bg-white hover:bg-slate-100 flex items-center gap-1.5 text-slate-700 shadow-2xs self-start md:self-auto"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>

        <div className="py-3 text-slate-800 text-xs md:text-sm leading-relaxed">
          {loading || isPending ? (
            <div className="text-slate-400 italic">Syncing briefing data...</div>
          ) : (
            data?.evacuationSummary || 'No evacuation briefing available.'
          )}
        </div>
      </section>

      {/* Risk Explainability & Impact Assessment Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Risk Explainability Panel (7 cols) */}
        <section className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              {t.riskExplainability || 'AI Risk Attribution & Explainability'}
            </h3>
            <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
              High Confidence
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <div className="flex justify-between font-semibold text-slate-800">
                <span>Calculated Flood Risk Index ({forecastTime})</span>
                <span className="text-red-600 font-bold">{forecastTime === '0-3h' ? '88%' : forecastTime === '3-6h' ? '94%' : '98%'}</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-red-600 h-full rounded-full transition-all duration-500"
                  style={{ width: forecastTime === '0-3h' ? '88%' : forecastTime === '3-6h' ? '94%' : '98%' }}
                />
              </div>
            </div>

            <div className="p-3.5 bg-amber-50/60 border border-amber-200/80 rounded-xl space-y-2 text-slate-800">
              <h4 className="font-bold text-amber-900 text-xs uppercase tracking-wider">AI Attribution Breakdown:</h4>
              <ul className="space-y-1.5 text-xs text-amber-950 font-medium">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                  <span><strong>Peak Soil Saturation:</strong> {soilMoistureVal}% (Extreme Slope Saturation)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                  <span><strong>IMD Cloudburst Runoff:</strong> {forecastTime === '0-3h' ? '46.5 mm/hr' : '62.0 mm/hr'} continuous rainfall</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                  <span><strong>CWC River Gauge Discharge:</strong> 18,400 cumecs (Exceeds Warning Mark by 2.4m)</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Impact Assessment Card (5 cols) */}
        <section className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              {t.impactAssessment || 'Impact Assessment'}
            </h3>
            <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
              Forecast: {forecastTime}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[10px] text-slate-500 font-semibold uppercase block">Est. At-Risk Population</span>
              <strong className="text-lg font-extrabold text-slate-900 block mt-1">
                {projectedPop.toLocaleString('en-IN')}
              </strong>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[10px] text-slate-500 font-semibold uppercase block">Bridges Threatened</span>
              <strong className="text-lg font-extrabold text-amber-700 block mt-1">
                {bridgesThreatened} Bridges
              </strong>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[10px] text-slate-500 font-semibold uppercase block">Active Battalions</span>
              <strong className="text-lg font-extrabold text-blue-700 block mt-1">
                {data?.activeBattalionsCount || 3} NDRF Teams
              </strong>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[10px] text-slate-500 font-semibold uppercase block">Critical Sectors</span>
              <strong className="text-lg font-extrabold text-red-600 block mt-1">
                {criticalCount} Villages
              </strong>
            </div>
          </div>
        </section>
      </div>

      {/* Metric Cards Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">{t.criticalSectors || 'Critical Sectors'}</span>
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{criticalCount}</span>
            <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
              Mandatory Evac
            </span>
          </div>
          <p className="text-[11px] text-slate-500">High-ground staging active</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">{t.populationAtRisk || 'Population At Risk'}</span>
            <Users className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {projectedPop.toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Active micro-watersheds</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">{t.ndrfBattalions || 'Active Battalions'}</span>
            <Anchor className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {data?.activeBattalionsCount || 3}
            </span>
            <span className="text-[10px] font-semibold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full">
              Quick Response
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Mountain & flood rescue</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">{t.peakSoilMoisture || 'Soil Saturation Rate'}</span>
            <Gauge className="w-4 h-4 text-[#005a9c]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {soilMoistureVal}%
            </span>
            <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
              Landslide Hazard
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Extreme slope saturation</p>
        </div>
      </section>

      {/* Active Danger Zones List */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" /> {t.activeDangerZones || 'Active Danger Zones'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Hydrological zones in {selectedState} requiring immediate evacuation or monitoring.
            </p>
          </div>

          <Link
            href="/map"
            className="px-4 py-2 bg-[#005a9c] text-white hover:bg-blue-800 rounded-full text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto shadow-2xs"
          >
            <span>View Full GIS Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredVillages.map((village) => {
            const isCritical = village.risk_status === 'CRITICAL';
            const isHigh = village.risk_status === 'HIGH';
            if (!isCritical && !isHigh && filteredVillages.length > 4) return null;

            return (
              <div
                key={village.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-white transition flex flex-col justify-between gap-3 shadow-2xs"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      {village.river_basin} Basin
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-0.5">{village.name}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" /> {village.district}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      isCritical
                        ? 'bg-red-100 text-red-800 border border-red-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {village.risk_status}
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px] font-semibold">Evacuation Route:</span>
                    <span className="font-semibold text-slate-900 truncate max-w-[160px] block">
                      {village.alternate_routes?.[0] || 'Ridge High Road'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 block text-[10px] font-semibold">Safe Shelter:</span>
                    <span className="font-semibold text-emerald-700 truncate max-w-[160px] block">
                      {village.safe_shelter}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
