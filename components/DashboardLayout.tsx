'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useActiveState } from '@/context/StateContext';
import { Radio, Clock, X } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { lowBandwidth, setLowBandwidth } = useActiveState();
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
    { label: 'Home Dashboard', href: '/' },
    { label: 'Live GIS Map', href: '/map' },
    { label: 'Telemetry Data', href: '/telemetry' },
    { label: 'Data Sources', href: '#', isModalTrigger: true },
    { label: 'Emergency Directives', href: '/alerts' },
  ];

  const [isDataSourcesOpen, setIsDataSourcesOpen] = useState<boolean>(false);

  return (
    <div className="flex flex-col min-h-screen bg-slate-100/60 text-slate-800 font-sans antialiased overflow-x-hidden">
      <header className="bg-white border-b border-slate-300 px-6 py-3.5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* Left: Official Seal & Elevated Branding */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded bg-slate-100 border border-slate-300 flex items-center justify-center font-bold text-slate-700 text-xs text-center leading-tight">
            सत्यमेव जयते
          </div>
          <div>
            <div className="text-[10px] tracking-wider uppercase font-bold text-slate-500">
              DISASTER MANAGEMENT DIVISION | MINISTRY OF HOME AFFAIRS
            </div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black tracking-tight text-slate-900 font-serif">
                HEM SANCHAR <span className="text-lg font-normal text-slate-600">(हेम संचार)</span>
              </h1>
              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-300">
                NATIONAL HIGH-ALTITUDE TELEMETRY
              </span>
            </div>
          </div>
        </div>

        {/* Right: Emergency Contacts & System Status */}
        <div className="flex items-center gap-6 text-xs text-slate-600 border-l border-slate-200 pl-6 hidden lg:flex">
          <div>
            <div className="font-bold text-slate-900">HELPLINE DIRECTORY</div>
            <div className="font-mono text-[11px] text-slate-600">
              MHA: 011-23438252 | NDRF: 1078 | SEOC: 1070
            </div>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded border border-emerald-200 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            SYSTEM ONLINE
          </div>
        </div>
      </header>

      <nav className="bg-[#0066b2] text-white w-full flex items-center justify-between px-6 py-0 shadow-md z-50">
        <div className="flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <button
                key={item.label}
                onClick={() => {
                  if (item.isModalTrigger) setIsDataSourcesOpen(true);
                  else window.location.href = item.href;
                }}
                className={`px-5 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#003d6b] font-semibold border-b-2 border-amber-400'
                    : 'hover:bg-[#005a9c]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
        <button
          onClick={() => setLowBandwidth?.(!lowBandwidth)}
          className="bg-amber-500 text-slate-900 text-xs font-bold px-3 py-1 rounded shadow-sm hover:bg-amber-400"
        >
          {lowBandwidth ? 'Low-Bandwidth Mode: ON' : 'Low-Bandwidth Mode: OFF'}
        </button>
      </nav>

      {isDataSourcesOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-800">Official Data Sources</h2>
              <button onClick={() => setIsDataSourcesOpen(false)} className="text-slate-500 hover:text-slate-800">
                <X />
              </button>
            </div>
            <ul className="space-y-3 text-sm text-slate-700">
              <li className="p-3 bg-slate-50 border border-slate-200 rounded"><strong>Central Water Commission (CWC)</strong> — Hydro-gauge & River Discharge Telemetry</li>
              <li className="p-3 bg-slate-50 border border-slate-200 rounded"><strong>India Meteorological Department (IMD)</strong> — High-Altitude Weather & Rain Gauges</li>
              <li className="p-3 bg-slate-50 border border-slate-200 rounded"><strong>Geological Survey of India (GSI)</strong> — Himalayan Slope Instability Data</li>
              <li className="p-3 bg-slate-50 border border-slate-200 rounded"><strong>ISRO / Bhuvan</strong> — High-Resolution Satellite Elevation & Radar Base Maps</li>
            </ul>
          </div>
        </div>
      )}

      <main className="flex-1 w-full min-h-screen p-4 md:p-6 bg-slate-100/60">
        {children}
      </main>

      <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-xs py-4 px-6 text-center">
        <p>Designed, Developed, and Hosted for National Emergency Response | Powered by Hem Sanchar Telemetry Engine</p>
        <p className="mt-1">Developed with ❤️ by Team Power Puff Girls | Smart India Hackathon 2026</p>
      </footer>
    </div>
  );
}
