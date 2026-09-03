'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useActiveState } from '@/context/StateContext';
import { Radio, Clock, X, Globe, User } from 'lucide-react';

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

  const [language, setLanguage] = useState('English');
  const languages = ['English', 'हिन्दी', 'डोगरी', 'कश्मीरी', 'लाद्दाखी', 'पहाड़ी', 'गढ़वाली', 'বাংলা'];

  // Simplified translations for core UI
  const translations: Record<string, any> = {
    'English': {
      liveTelemetry: 'Live Telemetry',
      evacuationDirective: 'Evacuation Directive',
      emergencyHelpline: 'Emergency Helpline',
      dataSources: 'Data Sources',
      homeDashboard: 'Home Dashboard',
      liveGisMap: 'Live GIS Map',
      telemetryData: 'Telemetry Data',
      emergencyDirectives: 'Emergency Directives',
    },
    'हिन्दी': {
      liveTelemetry: 'लाइव टेलीमेट्री',
      evacuationDirective: 'निकासी निर्देश',
      emergencyHelpline: 'आपातकालीन हेल्पलाइन',
      dataSources: 'डेटा स्रोत',
      homeDashboard: 'होम डैशबोर्ड',
      liveGisMap: 'लाइव जीआईएस मानचित्र',
      telemetryData: 'टेलीमेट्री डेटा',
      emergencyDirectives: 'आपातकालीन निर्देश',
    },
    // Adding more translations would follow this pattern
  };

  const navItems = [
    { label: 'Home Dashboard', href: '/', key: 'homeDashboard' },
    { label: 'Live GIS Map', href: '/map', key: 'liveGisMap' },
    { label: 'Telemetry Data', href: '/telemetry', key: 'telemetryData' },
    { label: 'Data Sources', href: '#', isModalTrigger: true, key: 'dataSources' },
    { label: 'Emergency Directives', href: '/alerts', key: 'emergencyDirectives' },
  ];

  const t = (key: string) => translations[language]?.[key] || key;

  const [isDataSourcesOpen, setIsDataSourcesOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-white border-b border-slate-300 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-red-600 animate-pulse" />
            <h1 className="text-lg font-bold tracking-tight text-slate-900">Hem Sanchar</h1>
          </div>
          <div className="text-xs text-slate-500 font-mono hidden md:block">| {currentTime}</div>
        </div>

        {/* Official MHA Leadership Card */}
        <div className="hidden lg:flex items-center gap-3 border border-slate-300 rounded-lg p-2 bg-white">
          <div className="w-10 h-12 bg-slate-200 rounded border border-slate-300 shadow-sm flex items-center justify-center">
            <User className="w-6 h-6 text-slate-400" />
          </div>
          <div className="text-xs">
            <p className="font-bold text-slate-800">Shri Amit Shah</p>
            <p className="text-[10px] text-slate-600">Hon'ble Union Minister of Home Affairs</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-slate-500" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="text-xs border border-slate-300 rounded px-2 py-1 bg-white"
            >
              {languages.map((lang) => <option key={lang} value={lang}>{lang}</option>)}
            </select>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b border-slate-300 flex overflow-x-auto">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => {
              if (item.isModalTrigger) setIsDataSourcesOpen(true);
              else window.location.href = item.href;
            }}
            className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
              pathname === item.href
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent hover:text-blue-600'
            }`}
          >
            {t(item.key)}
          </button>
        ))}
      </nav>

      <main className="p-6">{children}</main>

      {isDataSourcesOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 border border-slate-300">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Official Data Sources</h2>
              <button onClick={() => setIsDataSourcesOpen(false)}><X /></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}ncyHelpline: 'आपातकालीन हेल्पलाइन',
      dataSources: 'डेटा स्रोत',
      homeDashboard: 'होम डैशबोर्ड',
      liveGisMap: 'लाइव जीआईएस मैप',
      telemetryData: 'टेलीमेट्री डेटा',
      emergencyDirectives: 'आपातकालीन निर्देश',
    },
    'गढ़वाली': {
      liveTelemetry: 'लाइव टेलीमेट्री',
      evacuationDirective: 'निकासी निर्देश',
      emergencyHelpline: 'आपातकालीन हेल्पलाइन',
      dataSources: 'डेटा स्रोत',
      homeDashboard: 'होम डैशबोर्ड',
      liveGisMap: 'लाइव जीआईएस मैप',
      telemetryData: 'टेलीमेट्री डेटा',
      emergencyDirectives: 'आपातकालीन निर्देश',
    },
    'বাংলা': {
      liveTelemetry: 'লাইভ টেলিমেট্রি',
      evacuationDirective: 'উচ্ছেদ নির্দেশিকা',
      emergencyHelpline: 'জরুরি হেল্পলাইন',
      dataSources: 'তথ্য উৎস',
      homeDashboard: 'হোম ড্যাশবোর্ড',
      liveGisMap: 'লাইভ জিআইএস ম্যাপ',
      telemetryData: 'টেলিমেট্রি তথ্য',
      emergencyDirectives: 'জরুরি নির্দেশিকা',
    }
  };

  const t = translations[language] || translations['English'];

  const translatedNavItems = [
    { label: t.homeDashboard, href: '/' },
    { label: t.liveGisMap, href: '/map' },
    { label: t.telemetryData, href: '/telemetry' },
    { label: t.dataSources, href: '#', isModalTrigger: true },
    { label: t.emergencyDirectives, href: '/alerts' },
  ];
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans antialiased overflow-x-hidden">
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

        {/* MHA Leadership Card */}
        <div className="hidden lg:flex items-center gap-3 border border-slate-300 rounded-lg p-2 bg-white">
          <img src="https://www.mha.gov.in/sites/default/files/styles/leader_image/public/AmitShah_0_1.jpg" alt="Home Minister" className="w-14 h-16 rounded border border-slate-300 object-cover shadow-sm" />
          <div className="text-xs">
            <div className="font-bold text-slate-900">Shri Amit Shah — Hon'ble Union Minister of Home Affairs</div>
            <div className="text-slate-600 font-medium">Directive: Zero Casualty Target during High-Altitude Disasters</div>
          </div>
        </div>

        {/* Language Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500">Language:</label>
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            className="text-xs border border-slate-300 rounded px-2 py-1 bg-white focus:ring-1 focus:ring-blue-500 outline-none"
          >
            {languages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
          </select>
        </div>
      </header>

      <nav className="bg-[#0066b2] text-white w-full flex items-center justify-between px-6 py-0 shadow-md z-50">
        <div className="flex">
          {translatedNavItems.map((item) => {
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

      <main className="flex-1 w-full min-h-screen p-4 md:p-6 bg-slate-50">
        {children}
      </main>

      <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-xs py-4 px-6 text-center">
        <p>Designed, Developed, and Hosted for National Emergency Response | Powered by Hem Sanchar Telemetry Engine</p>
        <p className="mt-1">Developed with ❤️ by Team Power Puff Girls | Smart India Hackathon 2026</p>
      </footer>
    </div>
  );
}
