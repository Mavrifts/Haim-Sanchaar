'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// Regional Language Translation Dictionary
const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    title: 'HEM SANCHAR',
    subtitle: 'DISASTER MANAGEMENT DIVISION | MINISTRY OF HOME AFFAIRS',
    dashboard: 'Home Dashboard',
    map: 'Live GIS Map',
    telemetry: 'Telemetry Data',
    dataSources: 'Data Sources',
    emergency: 'Emergency Directives',
    helpline: 'MHA: 011-23438252 | NDRF: 1078 | SEOC: 1070',
  },
  hi: {
    title: 'हेम संचार',
    subtitle: 'आपदा प्रबंधन प्रभाग | गृह मंत्रालय | भारत सरकार',
    dashboard: 'मुख्य डैशबोर्ड',
    map: 'लाइव जीआईएस मानचित्र',
    telemetry: 'टेलीमेट्री डेटा',
    dataSources: 'डेटा स्रोत',
    emergency: 'आपातकालीन निर्देश',
    helpline: 'एमएचए: 011-23438252 | एनडीआरएफ: 1078 | एसईओसी: 1070',
  },
  doi: {
    title: 'हेम संचार',
    subtitle: 'आपदा प्रबंधन विभाग | गृह मंत्रालय',
    dashboard: 'मुख्य डैशबोर्ड',
    map: 'लाइव जीआईएस नक्शा',
    telemetry: 'टेलीमेट्री डेटा',
    dataSources: 'डेटा सोर्स',
    emergency: 'आपातकालीन निर्देश',
    helpline: 'एमएचए: 011-23438252 | एनडीआरएफ: 1078',
  },
  ks: {
    title: 'हेम संचार',
    subtitle: 'आपदा प्रबंधन डिवीजन | गृह मंत्रालय',
    dashboard: 'अहम डैशबोर्ड',
    map: 'लाइव नक्शा',
    telemetry: 'टेलीमेट्री',
    dataSources: 'डेटा जरिया',
    emergency: 'हंगामी हिदायत',
    helpline: 'एमएचए: 011-23438252 | एनडीआरएफ: 1078',
  },
  lb: {
    title: 'हेम संचार',
    subtitle: 'आपदा प्रबंधन विभाग | गृह मंत्रालय',
    dashboard: 'डैशबोर्ड',
    map: 'जीआईएस नक्शा',
    telemetry: 'टेलीमेट्री',
    dataSources: 'डेटा',
    emergency: 'आपातकालीन निर्देश',
    helpline: 'एमएचए: 011-23438252 | एनडीआरएफ: 1078',
  },
  pa: {
    title: 'हेम संचार',
    subtitle: 'आपदा प्रबंधन प्रभाग | गृह मंत्रालय',
    dashboard: 'मुख्य डैशबोर्ड',
    map: 'लाइव जीआईएस नक्शा',
    telemetry: 'टेलीमेट्री डेटा',
    dataSources: 'डेटा स्रोत',
    emergency: 'आपातकालीन हिदायतां',
    helpline: 'एमएचए: 011-23438252 | एनडीआरएफ: 1078',
  },
  gbm: {
    title: 'हेम संचार',
    subtitle: 'आपदा प्रबंधन विभाग | गृह मंत्रालय',
    dashboard: 'मुख्य डैशबोर्ड',
    map: 'जीआईएस नक्शा',
    telemetry: 'टेलीमेट्री डेटा',
    dataSources: 'डेटा स्रोत',
    emergency: 'आपातकालीन निर्देश',
    helpline: 'एमएचए: 011-23438252 | एनडीआरएफ: 1078',
  },
  bn: {
    title: 'হেম সঞ্চার',
    subtitle: 'দুর্যোগ ব্যবস্থাপনা বিভাগ | স্বরাষ্ট্র মন্ত্রণালয়',
    dashboard: 'মূল ড্যাশবোর্ড',
    map: 'লাইভ জিআইএস মানচিত্র',
    telemetry: 'টেলিমেট্রি ডেটা',
    dataSources: 'ডেটা উৎস',
    emergency: 'জরুরী নির্দেশাবলী',
    helpline: 'এমএইচএ: 011-23438252 | এনডিআরএফ: 1078',
  },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState('en');
  const [showDataModal, setShowDataModal] = useState(false);
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased">
      {/* Top Gold Accent Strip */}
      <div className="h-1 bg-amber-500 w-full" />

      {/* Official Government Header */}
      <header className="bg-white border-b border-slate-300 px-6 py-3.5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-12 border border-slate-300 bg-slate-50 flex items-center justify-center text-[10px] font-bold text-slate-700 text-center leading-tight p-1">
            सत्यमेव जयते
          </div>
          <div>
            <p className="text-[10px] tracking-wider uppercase font-bold text-slate-500">
              {t.subtitle}
            </p>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
              {t.title} <span className="text-sm font-normal text-slate-600">(हेम संचार)</span>
            </h1>
          </div>
        </div>

        {/* Right Section: Minister Card & Language Dropdown */}
        <div className="flex items-center gap-4">
          {/* Minister Profile Card */}
          <div className="hidden lg:flex items-center gap-2 bg-slate-50 border border-slate-200 p-1.5 rounded">
            <div className="w-10 h-12 rounded border border-slate-300 bg-slate-200 flex items-center justify-center text-[9px] font-bold text-slate-600 text-center">
              HM
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 leading-tight">Shri Amit Shah</p>
              <p className="text-[10px] text-slate-600">Hon'ble Union Home Minister</p>
            </div>
          </div>

          {/* Regional Language Selector */}
          <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-300 rounded px-2 py-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Language:</span>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="bg-transparent text-slate-800 text-xs font-bold focus:outline-none cursor-pointer"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="doi">डोगरी (Dogri)</option>
              <option value="ks">कश्मीरी (Kashmiri)</option>
              <option value="lb">लाद्दाखी (Ladakhi)</option>
              <option value="pa">पहाड़ी (Pahari)</option>
              <option value="gbm">गढ़वाली (Garhwali)</option>
              <option value="bn">বাংলা (Bengali)</option>
            </select>
          </div>
        </div>
      </header>

      {/* Primary MHA Blue Navigation Bar */}
      <nav className="bg-[#005a9c] text-white px-6 py-2 flex flex-wrap items-center justify-between text-xs font-medium shadow-sm">
        <div className="flex items-center gap-6">
          <Link href="/" className="hover:text-amber-300 transition-colors font-semibold">
            {t.dashboard}
          </Link>
          <Link href="/map" className="hover:text-amber-300 transition-colors">
            {t.map}
          </Link>
          <Link href="/telemetry" className="hover:text-amber-300 transition-colors">
            {t.telemetry}
          </Link>
          <button
            onClick={() => setShowDataModal(true)}
            className="hover:text-amber-300 transition-colors cursor-pointer"
          >
            {t.dataSources}
          </button>
          <Link href="/alerts" className="hover:text-amber-300 transition-colors">
            {t.emergency}
          </Link>
        </div>

        <div className="hidden sm:block text-[11px] text-amber-200 font-mono">
          {t.helpline}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">{children}</main>

      {/* Interactive Data Sources Modal */}
      {showDataModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-lg max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4">
              Official Government Data Feeds
            </h3>
            <ul className="space-y-3 text-xs text-slate-700">
              <li className="p-2 bg-slate-50 border border-slate-200 rounded">
                <strong>Central Water Commission (CWC):</strong> River Discharge & Hydrological Gauges
              </li>
              <li className="p-2 bg-slate-50 border border-slate-200 rounded">
                <strong>India Meteorological Department (IMD):</strong> Alpine Rainfall & Micro-Climate Telemetry
              </li>
              <li className="p-2 bg-slate-50 border border-slate-200 rounded">
                <strong>Geological Survey of India (GSI):</strong> Himalayan Slope Stability Sensors
              </li>
              <li className="p-2 bg-slate-50 border border-slate-200 rounded">
                <strong>ISRO / Bhuvan:</strong> High-Resolution Geospatial Base Maps
              </li>
            </ul>
            <button
              onClick={() => setShowDataModal(false)}
              className="mt-6 w-full bg-[#005a9c] text-white py-2 rounded text-xs font-bold hover:bg-[#00487c] transition-colors"
            >
              Close Panel
            </button>
          </div>
        </div>
      )}

      {/* Official Watermark Footer */}
      <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-xs py-4 px-6 text-center mt-auto">
        <p>
          Designed, Developed, and Maintained for High-Altitude Disaster Mitigation | Hem Sanchar Telemetry Network
        </p>
        <p className="text-neutral-400 text-[11px] mt-1">
          Developed with ❤️ by Team Power Puff Girls | Smart India Hackathon 2026
        </p>
      </footer>
    </div>
  );
}
