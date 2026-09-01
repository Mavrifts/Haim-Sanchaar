'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useActiveState, ActiveState } from '@/context/StateContext';
import {
  Shield,
  Home,
  Map as MapIcon,
  Table,
  Bell,
  Compass,
  Radio,
  Clock,
  ExternalLink,
  Wifi,
  WifiOff
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { selectedState, setSelectedState, lowBandwidth, setLowBandwidth } = useActiveState();
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        }) + ' • ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { label: 'Home Dashboard', href: '/', icon: Home },
    { label: 'Live GIS Map', href: '/map', icon: MapIcon },
    { label: 'Telemetry Table', href: '/telemetry', icon: Table },
    { label: 'Emergency Comms', href: '/alerts', icon: Bell },
  ];

  return (
    <div className="flex h-screen bg-[#F5F5F7] text-[#1D1D1F] overflow-hidden">
      {/* Persistent Left Sidebar */}
      <aside className="w-64 bg-white border-r border-black/[0.06] flex flex-col shrink-0">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-black/[0.06] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-neutral-100 border border-black/[0.06] flex items-center justify-center text-neutral-600">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-sm tracking-tight text-[#1D1D1F]">NDRF Command</h2>
            <span className="text-[10px] font-semibold text-[#86868B] uppercase tracking-wider">Tactical System</span>
          </div>
        </div>

        {/* State Selector */}
        <div className="p-4 border-b border-black/[0.06]">
          <span className="text-[11px] font-semibold text-[#86868B] uppercase tracking-wider block mb-2 px-2">
            Active Sector
          </span>
          <div className="grid grid-cols-1 gap-1.5 bg-black/[0.03] p-1.5 rounded-2xl border border-black/[0.04]">
            {(['Himachal Pradesh', 'Uttarakhand', 'Ladakh', 'Jammu & Kashmir'] as ActiveState[]).map((state) => (
              <button
                key={state}
                onClick={() => setSelectedState(state)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer border ${
                  selectedState === state
                    ? 'bg-neutral-100 text-neutral-800 border-black/[0.06]'
                    : 'border-transparent text-[#1D1D1F] hover:bg-black/[0.03]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Compass className={`w-3.5 h-3.5 ${selectedState === state ? 'text-neutral-700' : 'text-neutral-400'}`} />
                  <span className="truncate">{state}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <span className="text-[11px] font-semibold text-[#86868B] uppercase tracking-wider block mb-2 px-3">
            Menu Navigation
          </span>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
                  isActive
                    ? 'bg-neutral-100 text-neutral-800 border-black/[0.06]'
                    : 'border-transparent text-[#86868B] hover:text-[#1D1D1F] hover:bg-black/[0.02]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-neutral-700' : 'text-[#86868B]'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-black/[0.06] bg-black/[0.01]">
          <div className="flex items-center gap-2 text-[10px] font-semibold text-[#86868B] mb-2 px-1">
            <Radio className="w-3.5 h-3.5 text-emerald-600/80 animate-pulse" />
            <span>Operational Feed Live</span>
          </div>
          <div className="text-[10px] text-[#86868B] px-1 font-mono flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#86868B]" />
            <span className="truncate">{currentTime || 'Syncing...'}</span>
          </div>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Ambient top light */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/[0.01] rounded-full blur-[120px] pointer-events-none" />

        {/* Top Header Bar */}
        <header className="h-16 border-b border-black/[0.06] bg-white/80 backdrop-blur-md px-6 md:px-8 flex items-center justify-between shrink-0 z-30">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80" />
              HQ Server Connected
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Low-Bandwidth Mode Switch */}
            <div className="flex items-center gap-2 bg-black/[0.02] border border-black/[0.06] px-3 py-1.5 rounded-full select-none">
              {lowBandwidth ? (
                <WifiOff className="w-3.5 h-3.5 text-amber-600" />
              ) : (
                <Wifi className="w-3.5 h-3.5 text-neutral-400" />
              )}
              <span className="text-[10px] font-semibold text-neutral-600 uppercase tracking-wider">
                Low-Bandwidth (Field)
              </span>
              <button
                type="button"
                onClick={() => setLowBandwidth(!lowBandwidth)}
                className={`relative inline-flex h-4 w-8 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  lowBandwidth ? 'bg-amber-600/20 border-amber-500/20' : 'bg-black/[0.08] border-black/[0.04]'
                }`}
                aria-label="Toggle Low-Bandwidth mode"
              >
                <span
                  className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                    lowBandwidth ? 'translate-x-4 bg-amber-700' : 'translate-x-0 bg-neutral-400'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-[#86868B] bg-black/[0.02] border border-black/[0.06] px-3.5 py-1.5 rounded-full">
              <span>Active:</span>
              <span className="text-[#1D1D1F] font-bold">{selectedState}</span>
            </div>
          </div>
        </header>

        {/* Scrollable Workspace */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {children}
        </div>
      </main>
    </div>
  );
}
