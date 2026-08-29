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
  ExternalLink
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { selectedState, setSelectedState } = useActiveState();
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
      <aside className="w-64 bg-white border-r border-black/[0.08] flex flex-col shrink-0">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-black/[0.06] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#0071E3] to-[#005bb5] flex items-center justify-center shadow-sm text-white">
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
            {(['Himachal Pradesh', 'Uttarakhand'] as ActiveState[]).map((state) => (
              <button
                key={state}
                onClick={() => setSelectedState(state)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer ${
                  selectedState === state
                    ? 'bg-[#0071E3] text-white shadow-sm'
                    : 'text-[#1D1D1F] hover:bg-black/[0.05]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Compass className={`w-3.5 h-3.5 ${selectedState === state ? 'text-white' : 'text-[#0071E3]'}`} />
                  <span>{state}</span>
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
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-black/[0.06] text-[#0071E3]'
                    : 'text-[#86868B] hover:text-[#1D1D1F] hover:bg-black/[0.03]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#0071E3]' : 'text-[#86868B]'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-black/[0.06] bg-black/[0.01]">
          <div className="flex items-center gap-2 text-[10px] font-semibold text-[#86868B] mb-2 px-1">
            <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
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
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/[0.02] rounded-full blur-[120px] pointer-events-none" />

        {/* Top Header Bar */}
        <header className="h-16 border-b border-black/[0.06] bg-white/80 backdrop-blur-md px-6 md:px-8 flex items-center justify-between shrink-0 z-30">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-700 border border-emerald-500/15">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              HQ Server Connected
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-[#86868B] bg-black/[0.03] border border-black/[0.05] px-3.5 py-1.5 rounded-full">
            <span>Active:</span>
            <span className="text-[#1D1D1F] font-bold">{selectedState}</span>
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
