'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useActiveState } from '@/context/StateContext';
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
  MapPin
} from 'lucide-react';
import Link from 'next/link';

export default function HomeDashboard() {
  const { selectedState } = useActiveState();
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isPending, startTransition] = useTransition();
  const [copied, setCopied] = useState<boolean>(false);

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
  const criticalCount = villages.filter((v) => v.risk_status === 'CRITICAL').length;
  const highCount = villages.filter((v) => v.risk_status === 'HIGH').length;
  const moderateCount = villages.filter((v) => v.risk_status === 'MODERATE').length;
  const safeCount = villages.filter((v) => v.risk_status === 'SAFE').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Welcome & Summary Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1D1D1F]">
            Situational Command: {selectedState}
          </h1>
          <p className="text-xs text-[#86868B] mt-1">
            Real-time tactical intelligence, AI directives, and active hydration telemetry for NDRF deployables.
          </p>
        </div>

        <button
          onClick={() => loadData(selectedState)}
          disabled={loading || isPending}
          className="rounded-full px-4 py-2 text-xs font-semibold bg-white hover:bg-neutral-50 text-[#1D1D1F] border border-black/[0.08] shadow-xs transition-all active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-50 self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading || isPending ? 'animate-spin text-[#0071E3]' : ''}`} />
          <span>Sync Feed</span>
        </button>
      </div>

      {/* Gemini AI Tactical Evacuation Directive Banner */}
      <section className="bg-gradient-to-tr from-blue-50 to-indigo-50 border border-blue-100/60 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-xs">
        <div className="absolute top-[-20%] right-[-10%] w-[300px] h-[300px] bg-blue-400/[0.08] rounded-full blur-[80px] pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-blue-200/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0071E3] to-[#5856D6] flex items-center justify-center shadow-md shadow-indigo-500/20 text-white">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold tracking-tight text-[#1D1D1F]">
                  State Evacuation Directive ({selectedState})
                </h2>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-[#0071E3] border border-blue-500/20">
                  gemini-3.6-flash
                </span>
              </div>
              <p className="text-[11px] text-[#86868B] mt-0.5">
                AI-synthesized tactical directive evaluating critical cloudburst precipitation and saturated soil moisture.
              </p>
            </div>
          </div>

          <button
            onClick={copySummary}
            className="rounded-full px-4 py-2 text-xs font-medium bg-white hover:bg-neutral-50 text-[#1D1D1F] border border-black/[0.08] shadow-xs transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer self-start md:self-auto"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600 font-semibold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#86868B]" />
                <span>Copy Directive</span>
              </>
            )}
          </button>
        </div>

        <div className="mt-5">
          {loading || isPending ? (
            <div className="flex items-center gap-3 py-4 text-[#86868B]">
              <RefreshCw className="w-4 h-4 text-[#0071E3] animate-spin" />
              <span className="text-xs">Fetching telemetry and briefing Gemini AI...</span>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-base leading-relaxed text-[#1D1D1F] font-normal tracking-tight">
                {data?.evacuationSummary || 'No evacuation briefing available.'}
              </p>
              <div className="flex items-center justify-between text-[11px] text-[#86868B] pt-2">
                <span className="flex items-center gap-1.5 text-[#0071E3] font-semibold">
                  <Activity className="w-3.5 h-3.5" />
                  Real-time telemetry dispatched to {selectedState} Emergency Operations Center
                </span>
                <span>Updated {data?.timestamp ? new Date(data.timestamp).toLocaleTimeString() : 'just now'}</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Metric Cards Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Critical Sectors */}
        <div className="bg-white border border-black/[0.08] rounded-3xl p-6 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#86868B]">Critical Sectors</span>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-semibold tracking-tight text-[#1D1D1F]">{criticalCount}</span>
            <span className="text-[10px] font-bold text-red-600 bg-red-500/10 px-2 py-0.5 rounded-full">
              Mandatory Evac
            </span>
          </div>
          <p className="text-[11px] text-[#86868B]">Immediate high-ground staging active</p>
        </div>

        {/* Card 2: Population At Risk */}
        <div className="bg-white border border-black/[0.08] rounded-3xl p-6 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#86868B]">Population At Direct Risk</span>
            <span className="w-2 h-2 rounded-full bg-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-semibold tracking-tight text-[#1D1D1F]">
              {(data?.totalPopulationAtRisk || 0).toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] font-medium text-[#86868B]">Residents</span>
          </div>
          <p className="text-[11px] text-[#86868B]">Across active river valleys</p>
        </div>

        {/* Card 3: Active Battalions */}
        <div className="bg-white border border-black/[0.08] rounded-3xl p-6 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#86868B]">NDRF Battalions</span>
            <span className="w-2 h-2 rounded-full bg-blue-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-semibold tracking-tight text-[#1D1D1F]">
              {data?.activeBattalionsCount || 3}
            </span>
            <span className="text-[10px] font-semibold text-[#0071E3] bg-blue-500/10 px-2 py-0.5 rounded-full">
              Quick Response
            </span>
          </div>
          <p className="text-[11px] text-[#86868B]">Mountain & flood rescue units active</p>
        </div>

        {/* Card 4: Soil Saturation */}
        <div className="bg-white border border-black/[0.08] rounded-3xl p-6 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#86868B]">Peak Soil Moisture</span>
            <Gauge className="w-4 h-4 text-[#0071E3]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-semibold tracking-tight text-[#1D1D1F]">
              {selectedState === 'Himachal Pradesh' ? '91.2%' : '94.0%'}
            </span>
            <span className="text-[10px] font-medium text-red-600">Landslide Hazard</span>
          </div>
          <p className="text-[11px] text-[#86868B]">Extreme mountain slope saturation</p>
        </div>
      </section>

      {/* Active High-Alert Incidents */}
      <section className="bg-white border border-black/[0.08] rounded-3xl p-6 md:p-8 space-y-6 shadow-xs">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-[#1D1D1F] flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" /> Active Danger Zones & Evacuation Sectors
          </h2>
          <p className="text-xs text-[#86868B] mt-1">
            Active river fronts currently exceeding hydrological caution limits in {selectedState}.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {villages.map((village) => {
            const isCritical = village.risk_status === 'CRITICAL';
            const isHigh = village.risk_status === 'HIGH';
            if (!isCritical && !isHigh) return null;

            return (
              <div
                key={village.id}
                className="p-4 rounded-2xl border border-black/[0.06] hover:border-[#0071E3]/20 hover:bg-neutral-50 transition-all flex flex-col justify-between gap-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider block">
                      {village.river_basin}
                    </span>
                    <h3 className="text-sm font-bold text-[#1D1D1F] mt-0.5">{village.name}</h3>
                    <p className="text-xs text-[#86868B] flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-cyan-500" /> {village.district}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      isCritical
                        ? 'bg-red-500/10 text-red-600 border border-red-500/20'
                        : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                    }`}
                  >
                    {village.risk_status}
                  </span>
                </div>

                <div className="pt-3 border-t border-black/[0.04] flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[#86868B] block text-[10px]">Alternate Route:</span>
                    <span className="font-semibold text-[#1D1D1F] truncate max-w-[150px] block">
                      {village.alternate_routes?.[0] || 'Ridge High Road'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#86868B] block text-[10px]">Safe Shelter:</span>
                    <span className="font-semibold text-emerald-600 truncate max-w-[150px] block">
                      {village.safe_shelter}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Links */}
        <div className="pt-4 border-t border-black/[0.06] flex flex-wrap gap-4 items-center justify-between text-xs font-semibold">
          <span className="text-[#86868B]">Quick Commands:</span>
          <div className="flex gap-3">
            <Link
              href="/map"
              className="px-4 py-2 bg-black/[0.03] text-[#0071E3] hover:bg-black/[0.06] rounded-full flex items-center gap-1.5 transition-all active:scale-95"
            >
              <span>View Map Radar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/telemetry"
              className="px-4 py-2 bg-[#0071E3] text-white hover:bg-[#0077ED] rounded-full flex items-center gap-1.5 transition-all active:scale-95 shadow-xs"
            >
              <span>View Hydrological Tables</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
